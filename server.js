require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const { createClient } = require('@supabase/supabase-js');
const paymentManager = require('./services/paymentManager');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const provider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);

// Verify crypto transaction
app.post('/api/verify-transaction', async (req, res) => {
  const { txHash, expectedAmount, userWallet } = req.body;

  try {
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      return res.status(400).json({ 
        success: false, 
        error: 'Transaction not found or still pending' 
      });
    }

    if (receipt.status !== 1) {
      return res.status(400).json({ 
        success: false, 
        error: 'Transaction failed on blockchain' 
      });
    }

    const tx = await provider.getTransaction(txHash);

    if (tx.to.toLowerCase() !== process.env.BUSINESS_WALLET.toLowerCase()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Payment sent to wrong address' 
      });
    }

    if (tx.from.toLowerCase() !== userWallet.toLowerCase()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Sender address mismatch' 
      });
    }

    const amountSent = ethers.formatEther(tx.value);
    const tolerance = parseFloat(expectedAmount) * 0.02;
    
    if (Math.abs(parseFloat(amountSent) - parseFloat(expectedAmount)) > tolerance) {
      return res.status(400).json({ 
        success: false, 
        error: `Amount mismatch. Expected: ${expectedAmount}, Got: ${amountSent}` 
      });
    }

    res.json({
      success: true,
      verified: true,
      amount: amountSent,
      from: tx.from,
      to: tx.to,
      blockNumber: receipt.blockNumber
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Pay electricity
app.post('/api/pay/electricity', async (req, res) => {
  const { txHash, meterNumber, amount, provider, country, userWallet, meterType } = req.body;

  try {
    // Note: In development, you can skip verification for testing
    // Comment out in production
    if (process.env.NODE_ENV === 'production') {
      const verifyResponse = await fetch('http://localhost:3001/api/verify-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash, expectedAmount: amount, userWallet })
      });

      const verifyData = await verifyResponse.json();
      if (!verifyData.success) {
        return res.status(400).json(verifyData);
      }
    }

    const result = await paymentManager.processPayment('electricity', {
      meterNumber,
      amount,
      disco: provider,
      country,
      meterType: meterType || 'prepaid'
    });

    const { data: transaction } = await supabase
      .from('transactions')
      .insert([{
        tx_hash: txHash || `TEST-${Date.now()}`,
        wallet_address: userWallet,
        product: 'Electricity',
        amount: parseFloat(amount),
        status: 'completed',
        payment_provider: result.provider,
        details: {
          meterNumber,
          provider,
          country,
          reference: result.transactionId || result.reference,
          token: result.token,
          units: result.units
        }
      }])
      .select()
      .single();

    res.json({
      success: true,
      transactionId: transaction.id,
      message: 'Electricity payment successful',
      token: result.token,
      units: result.units,
      provider: result.provider
    });

  } catch (error) {
    console.error('Electricity payment error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Buy airtime
app.post('/api/pay/airtime', async (req, res) => {
  const { txHash, phoneNumber, amount, network, country, userWallet } = req.body;

  try {
    const result = await paymentManager.processPayment('airtime', {
      phoneNumber,
      amount,
      network,
      country
    });

    const { data: transaction } = await supabase
      .from('transactions')
      .insert([{
        tx_hash: txHash || `TEST-${Date.now()}`,
        wallet_address: userWallet,
        product: 'Airtime',
        amount: parseFloat(amount),
        status: 'completed',
        payment_provider: result.provider,
        details: {
          phoneNumber,
          network,
          country,
          transactionId: result.transactionId
        }
      }])
      .select()
      .single();

    res.json({
      success: true,
      transactionId: transaction.id,
      message: 'Airtime purchase successful',
      provider: result.provider
    });

  } catch (error) {
    console.error('Airtime purchase error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Buy data
app.post('/api/pay/data', async (req, res) => {
  const { txHash, phoneNumber, amount, network, country, userWallet } = req.body;

  try {
    const result = await paymentManager.processPayment('data', {
      phoneNumber,
      amount,
      network,
      country
    });

    const { data: transaction } = await supabase
      .from('transactions')
      .insert([{
        tx_hash: txHash || `TEST-${Date.now()}`,
        wallet_address: userWallet,
        product: 'Mobile Data',
        amount: parseFloat(amount),
        status: 'completed',
        payment_provider: result.provider,
        details: {
          phoneNumber,
          network,
          country,
          planName: result.planName,
          transactionId: result.transactionId
        }
      }])
      .select()
      .single();

    res.json({
      success: true,
      transactionId: transaction.id,
      message: 'Data purchase successful',
      planName: result.planName,
      provider: result.provider
    });

  } catch (error) {
    console.error('Data purchase error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get transactions
app.get('/api/transactions/:wallet', async (req, res) => {
  const { wallet } = req.params;

  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_address', wallet.toLowerCase())
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, transactions: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'BaintPay API is running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 BaintPay API running on port ${PORT}`);
  console.log(`📍 Business Wallet: ${process.env.BUSINESS_WALLET}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
