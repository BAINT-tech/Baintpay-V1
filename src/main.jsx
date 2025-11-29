import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
    color: white;
    min-height: 100vh;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const PRODUCTS = {
  utilities: [
    { id: 'elec1', name: '⚡ Electricity Bill', type: 'electricity', price: 'Variable', description: 'Pay your power bill instantly' },
    { id: 'water1', name: '💧 Water Bill', type: 'water', price: 'Variable', description: 'Pay water bills', comingSoon: true },
    { id: 'internet1', name: '📡 Internet/WiFi Bill', type: 'internet', price: 'Variable', description: 'Pay internet providers', comingSoon: true },
  ],
  mobile: [
    { id: 'data1', name: '📱 Mobile Data 1GB', type: 'data', price: 5.00, description: '1GB data bundle' },
    { id: 'data2', name: '📱 Mobile Data 5GB', type: 'data', price: 15.00, description: '5GB data bundle' },
    { id: 'data3', name: '📱 Mobile Data 10GB', type: 'data', price: 25.00, description: '10GB data bundle' },
    { id: 'airtime1', name: '📞 Airtime $10', type: 'airtime', price: 10.00, description: 'Mobile airtime top-up' },
    { id: 'airtime2', name: '📞 Airtime $20', type: 'airtime', price: 20.00, description: 'Mobile airtime top-up' },
    { id: 'airtime3', name: '📞 Airtime $50', type: 'airtime', price: 50.00, description: 'Mobile airtime top-up' },
  ],
  entertainment: [
    { id: '1', name: 'Netflix Premium', price: 15.99, description: 'HD streaming for 1 month' },
    { id: '2', name: 'Spotify Premium', price: 10.99, description: 'Ad-free music streaming' },
    { id: '3', name: 'YouTube Premium', price: 11.99, description: 'Ad-free YouTube + Music' },
    { id: '4', name: 'Disney+', price: 7.99, description: 'Disney, Marvel, Star Wars' },
    { id: '5', name: 'Apple Music', price: 10.99, description: 'Music streaming service' },
    { id: 'dstv1', name: '📺 DSTV Premium', price: 89.00, description: 'Full bouquet + sports', popular: true },
    { id: 'dstv2', name: '📺 DSTV Compact Plus', price: 35.00, description: 'Sports + movies' },
    { id: 'gotv1', name: '📺 GOtv Supa', price: 12.00, description: 'Budget sports package' },
  ],
  gaming: [
    { id: '6', name: 'Roblox 1000 Robux', price: 9.99, description: 'In-game currency' },
    { id: '7', name: 'PUBG 1800 UC', price: 24.99, description: 'PUBG Mobile currency' },
    { id: '8', name: 'Free Fire 2200 Diamonds', price: 19.99, description: 'Free Fire currency' },
    { id: '9', name: 'Steam $20', price: 20.00, description: 'Steam wallet gift card' },
    { id: '10', name: 'PlayStation $25', price: 25.00, description: 'PSN gift card' },
    { id: '11', name: 'Xbox $25', price: 25.00, description: 'Xbox gift card' },
  ],
  shopping: [
    { id: 'jumia1', name: '🛍️ Jumia $25 Voucher', price: 25.00, description: 'Shop on Jumia', popular: true },
    { id: 'jumia2', name: '🛍️ Jumia $50 Voucher', price: 50.00, description: 'Shop on Jumia', popular: true },
    { id: 'jumia3', name: '🛍️ Jumia $100 Voucher', price: 100.00, description: 'Shop on Jumia' },
    { id: 'temu1', name: '🛒 Temu $25 Gift Card', price: 25.00, description: 'Shop on Temu' },
    { id: 'temu2', name: '🛒 Temu $50 Gift Card', price: 50.00, description: 'Shop on Temu' },
    { id: 'amazon1', name: '📦 Amazon $25', price: 25.00, description: 'Amazon gift card' },
  ],
  transport: [
    { id: 'uber1', name: '🚕 Uber $25 Gift Card', price: 25.00, description: 'Ride credit', popular: true },
    { id: 'uber2', name: '🚕 Uber $50 Gift Card', price: 50.00, description: 'Ride credit' },
    { id: 'bolt1', name: '🚗 Bolt €20 Credit', price: 22.00, description: 'Bolt ride credit' },
    { id: 'bolt2', name: '🚗 Bolt €50 Credit', price: 55.00, description: 'Bolt ride credit' },
  ],
  social: [
    { id: '12', name: 'TikTok 1000 Coins', price: 12.99, description: 'TikTok coins for gifts' },
    { id: '13', name: 'X Premium', price: 8.00, description: 'Twitter/X Premium' },
    { id: '14', name: 'Discord Nitro', price: 9.99, description: 'Discord premium features' },
    { id: '15', name: 'Reddit Premium', price: 5.99, description: 'Ad-free Reddit' },
  ],
  ai: [
    { id: '16', name: 'OpenAI $50 Credits', price: 50.00, description: 'ChatGPT API credits' },
    { id: '17', name: 'Claude API $50', price: 50.00, description: 'Anthropic Claude credits' },
    { id: '18', name: 'GitHub Copilot', price: 10.00, description: 'AI code assistant' },
    { id: '19', name: 'Midjourney Pro', price: 30.00, description: 'AI image generation' },
  ],
};

const PAYMENT_TOKENS = [
  { id: 'usdt', name: 'USDT', symbol: 'USDT', icon: '💵', recommended: true, fee: 1.5 },
  { id: 'usdc', name: 'USDC', symbol: 'USDC', icon: '💰', recommended: true, fee: 1.5 },
  { id: 'bnb', name: 'BNB', symbol: 'BNB', icon: '💎', recommended: false, fee: 2.0 },
  { id: 'sol', name: 'SOL', symbol: 'SOL', icon: '◎', recommended: false, fee: 2.0 },
];

const COUNTRIES = {
  nigeria: { flag: '🇳🇬', name: 'Nigeria', code: 'NG' },
  kenya: { flag: '🇰🇪', name: 'Kenya', code: 'KE' },
  ghana: { flag: '🇬🇭', name: 'Ghana', code: 'GH' },
  southafrica: { flag: '🇿🇦', name: 'South Africa', code: 'ZA' },
};

const ELECTRICITY_PROVIDERS = {
  nigeria: [
    { id: 'ikedc', name: 'Ikeja Electric (IKEDC)' },
    { id: 'ekedc', name: 'Eko Electric (EKEDC)' },
    { id: 'aedc', name: 'Abuja Electric (AEDC)' },
    { id: 'phed', name: 'Port Harcourt Electric (PHED)' },
    { id: 'ibedc', name: 'Ibadan Electric (IBEDC)' },
  ],
  kenya: [{ id: 'kplc', name: 'Kenya Power (KPLC)' }],
  ghana: [{ id: 'ecg', name: 'ECG Ghana' }],
  southafrica: [
    { id: 'eskom', name: 'Eskom' },
    { id: 'citypower', name: 'City Power Johannesburg' },
  ],
};

const MOBILE_PROVIDERS = {
  nigeria: ['MTN', 'Glo', 'Airtel', '9mobile'],
  kenya: ['Safaricom', 'Airtel', 'Telkom'],
  ghana: ['MTN', 'Vodafone', 'AirtelTigo'],
  southafrica: ['Vodacom', 'MTN', 'Cell C', 'Telkom'],
};

const calculateFees = (amount, tokenId = 'usdt') => {
  const token = PAYMENT_TOKENS.find(t => t.id === tokenId) || PAYMENT_TOKENS[0];
  const platformFee = amount * (token.fee / 100);
  const gasFee = tokenId === 'usdt' || tokenId === 'usdc' ? 0.10 : 0.05;
  const total = amount + platformFee + gasFee;
  
  return {
    amount: parseFloat(amount),
    platformFee: parseFloat(platformFee.toFixed(2)),
    gasFee: parseFloat(gasFee.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    token: token.symbol,
    savings: tokenId === 'usdt' || tokenId === 'usdc' ? 0.50 : 0,
  };
};

const saveTransaction = (tx) => {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  transactions.unshift(tx);
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

const getTransactions = () => {
  return JSON.parse(localStorage.getItem('transactions') || '[]');
};

function App() {
  const [wallet, setWallet] = useState(null);
  const [tab, setTab] = useState('utilities');
  const [modal, setModal] = useState(null);
  const [utilityModal, setUtilityModal] = useState(null);
  const [step, setStep] = useState('form');
  const [selectedToken, setSelectedToken] = useState('usdt');
  const [showHistory, setShowHistory] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    country: 'nigeria',
    provider: '',
    accountNumber: '',
    amount: '',
    phoneNumber: '',
  });

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or Trust Wallet!');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWallet(accounts[0]);
    } catch (e) {
      alert('Failed to connect wallet');
    }
  };

  const buy = (product) => {
    if (!wallet) {
      alert('Connect wallet first!');
      return;
    }
    if (product.comingSoon) {
      alert('Coming soon! Stay tuned 🚀');
      return;
    }
    if (product.type === 'electricity' || product.type === 'water' || product.type === 'internet') {
      setUtilityModal(product);
      setStep('form');
      setFormData({ country: 'nigeria', provider: '', accountNumber: '', amount: '', phoneNumber: '' });
    } else if (product.type === 'data' || product.type === 'airtime') {
      setUtilityModal(product);
      setStep('form');
      setFormData({ country: 'nigeria', provider: '', accountNumber: '', amount: product.price, phoneNumber: '' });
    } else {
      setModal(product);
      setStep('form');
    }
    setSelectedToken('usdt');
  };

  const pay = () => {
    setStep('processing');
    setTimeout(() => setStep('confirming'), 2000);
    setTimeout(() => {
      const product = modal || utilityModal;
      const amount = product.price === 'Variable' ? parseFloat(formData.amount) : product.price;
      const fees = calculateFees(amount, selectedToken);
      
      const transaction = {
        id: `BNT-${Date.now()}`,
        date: new Date().toISOString(),
        product: product.name,
        amount: fees.amount,
        fee: fees.platformFee + fees.gasFee,
        total: fees.total,
        token: fees.token,
        chain: selectedToken === 'sol' ? 'Solana' : 'BNB Chain',
        status: 'completed',
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
        details: product.type === 'electricity' ? {
          meter: formData.accountNumber,
          provider: formData.provider,
        } : product.type === 'data' || product.type === 'airtime' ? {
          phone: formData.phoneNumber,
          provider: formData.provider,
        } : {},
      };
      
      saveTransaction(transaction);
      setTransactions(getTransactions());
      setStep('success');
    }, 4000);
  };

  const closeModal = () => {
    setModal(null);
    setUtilityModal(null);
    setStep('form');
  };

  const downloadReceipt = (tx) => {
    const receipt = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       BaintPay Receipt
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transaction ID: ${tx.id}
Date: ${new Date(tx.date).toLocaleString()}

Service: ${tx.product}
${tx.details.meter ? `Meter: ${tx.details.meter}` : ''}
${tx.details.phone ? `Phone: ${tx.details.phone}` : ''}
${tx.details.provider ? `Provider: ${tx.details.provider}` : ''}

Amount: $${tx.amount.toFixed(2)}
Fee: $${tx.fee.toFixed(2)}
Total Paid: $${tx.total.toFixed(2)}

Payment Method: ${tx.token}
Chain: ${tx.chain}
Tx Hash: ${tx.txHash.slice(0, 20)}...

Status: ✅ ${tx.status}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Keep this for your records
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BaintPay_Receipt_${tx.id}.txt`;
    a.click();
  };

  const tabs = [
    { id: 'utilities', label: '💡 Utilities' },
    { id: 'mobile', label: '📱 Mobile' },
    { id: 'entertainment', label: '🎬 Entertainment' },
    { id: 'gaming', label: '🎮 Gaming' },
    { id: 'shopping', label: '🛍️ Shopping' },
    { id: 'transport', label: '🚕 Transport' },
    { id: 'social', label: '💬 Social' },
    { id: 'ai', label: '🤖 AI' },
  ];

  const product = modal || utilityModal;
  const amount = product && (product.price === 'Variable' ? parseFloat(formData.amount || 0) : product.price);
  const fees = amount > 0 ? calculateFees(amount, selectedToken) : null;

  return (
    <>
      <style>{styles}</style>
      
      <div style={{ minHeight: '100vh', padding: '16px', paddingBottom: '80px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px',
          padding: '16px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '12px',
          border: '1px solid rgba(168,85,247,0.3)'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>💎 BaintPay</h1>
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>Pay Bills Instantly</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {wallet && (
              <button
                onClick={() => setShowHistory(true)}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(168,85,247,0.2)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                📋 History
              </button>
            )}
            {!wallet ? (
              <button 
                onClick={connectWallet}
                style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #9333ea, #ec4899)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Connect
              </button>
            ) : (
              <div style={{
                padding: '8px 12px',
                background: 'rgba(34,197,94,0.2)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '8px',
                fontSize: '12px'
              }}>
                {wallet.slice(0,6)}...{wallet.slice(-4)}
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
            Pay Bills. Anywhere. Instantly.
          </h2>
          <p style={{ color: '#d1d5db', fontSize: '16px', marginBottom: '8px' }}>
            Electricity, data, streaming, shopping and more with crypto
          </p>
          <div style={{ 
            display: 'inline-flex', 
            gap: '8px', 
            background: 'rgba(34,197,94,0.1)',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(34,197,94,0.2)'
          }}>
            <span style={{ fontSize: '14px', color: '#4ade80' }}>💵 Pay with USDT/USDC • Save on fees</span>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          overflowX: 'auto',
          marginBottom: '24px',
          paddingBottom: '8px'
        }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '12px 16px',
                background: tab === t.id 
                  ? 'linear-gradient(135deg, #9333ea, #ec4899)' 
                  : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          {PRODUCTS[tab].map(p => (
            <div 
              key={p.id}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: `1px solid ${p.popular ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px',
                padding: '16px',
                opacity: p.comingSoon ? 0.6 : 1,
                position: 'relative'
              }}
            >
              {p.comingSoon && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#f59e0b',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  SOON
                </div>
              )}
              {p.popular && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#22c55e',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  POPULAR
                </div>
              )}
              <div style={{
                height: '100px',
                background: 'linear-gradient(135deg, #9333ea, #ec4899)',
                borderRadius: '8px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px'
              }}>
                {p.name.split(' ')[0]}
              </div>
              <h3 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                {p.name.replace(/^[^\s]+\s/, '')}
              </h3>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>
                {p.description}
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  color: '#4ade80'
                }}>
                  {typeof p.price === 'number' ? '$' + p.price.toFixed(2) : p.price}
                </span>
                <button
                  onClick={() => buy(p)}
                  disabled={p.comingSoon}
                  style={{
                    padding: '8px 16px',
                    background: p.comingSoon ? '#6b7280' : '#9333ea',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: p.comingSoon ? 'not-allowed' : 'pointer'
                  }}
                >
                  {p.comingSoon ? 'Soon' : 'Buy'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Regular Products Modal */}
        {modal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 50
          }}>
            <div style={{
              background: '#1e293b',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid rgba(168,85,247,0.3)'
            }}>
              {step === 'form' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{modal.name}</h2>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '24px', cursor: 'pointer' }}>×</button>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>{modal.description}</p>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Pay with</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {PAYMENT_TOKENS.map(token => (
                        <button
                          key={token.id}
                          onClick={() => setSelectedToken(token.id)}
                          style={{
                            padding: '12px',
                            background: selectedToken === token.id ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                            border: selectedToken === token.id ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            position: 'relative'
                          }}
                        >
                          {token.recommended && (
                            <div style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              background: '#22c55e',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '9px',
                              fontWeight: 'bold'
                            }}>
                              BEST
                            </div>
                          )}
                          <div style={{ fontSize: '24px', marginBottom: '4px' }}>{token.icon}</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{token.name}</div>
                          <div style={{ fontSize: '11px', color: '#9ca3af' }}>{token.fee}% fee</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {fees && (
                    <div style={{
                      background: 'rgba(255,255,255,0.05)',
                      padding: '16px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>Payment Breakdown</h3>
                      <div style={{ fontSize: '13px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af' }}>Bill Amount:</span>
                        <span>${fees.amount.toFixed(2)}</span>
                      </div>
                      <div style={{ fontSize: '13px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af' }}>Platform Fee ({PAYMENT_TOKENS.find(t => t.id === selectedToken).fee}%):</span>
                        <span>${fees.platformFee.toFixed(2)}</span>
                      </div>
                      <div style={{ fontSize: '13px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af' }}>Gas Fee (est.):</span>
                        <span>${fees.gasFee.toFixed(2)}</span>
                      </div>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Total:</span>
                          <span style={{ color: '#4ade80' }}>{fees.total.toFixed(2)} {fees.token}</span>
                        </div>
                      </div>
                      {fees.savings > 0 && (
                        <div style={{ 
                          marginTop: '8px', 
                          padding: '8px', 
                          background: 'rgba(34,197,94,0.1)', 
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#4ade80'
                        }}>
                          💰 You save ${fees.savings.toFixed(2)} with stablecoins!
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={pay}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #9333ea, #ec4899)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',cursor: 'pointer'
                    }}
                  >
                    Pay Now
                  </button>
                </>
              )}

              {step === 'processing' && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    border: '4px solid rgba(168,85,247,0.2)',
                    borderTop: '4px solid #9333ea',
                    borderRadius: '50%',
                    margin: '0 auto 24px',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Processing Payment</h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px' }}>Preparing transaction...</p>
                </div>
              )}

              {step === 'confirming' && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    border: '4px solid rgba(168,85,247,0.2)',
                    borderTop: '4px solid #9333ea',
                    borderRadius: '50%',
                    margin: '0 auto 24px',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Confirming on Chain</h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px' }}>Waiting for blockchain confirmation...</p>
                </div>
              )}

              {step === 'success' && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#22c55e' }}>Payment Successful!</h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>
                    Your {modal.name} has been activated
                  </p>
                  <button
                    onClick={closeModal}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #9333ea, #ec4899)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Utility Bills Modal (Electricity, Data, Airtime) */}
        {utilityModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 50
          }}>
            <div style={{
              background: '#1e293b',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid rgba(168,85,247,0.3)'
            }}>
              {step === 'form' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{utilityModal.name}</h2>
                    <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '24px', cursor: 'pointer' }}>×</button>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>{utilityModal.description}</p>

                  {/* Country Selection */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Select Country</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {Object.entries(COUNTRIES).map(([key, country]) => (
                        <button
                          key={key}
                          onClick={() => setFormData({...formData, country: key, provider: ''})}
                          style={{
                            padding: '12px',
                            background: formData.country === key ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                            border: formData.country === key ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          <div style={{ fontSize: '24px', marginBottom: '4px' }}>{country.flag}</div>
                          <div style={{ fontWeight: 'bold' }}>{country.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Provider Selection */}
                  {utilityModal.type === 'electricity' && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Select Provider</label>
                      <select
                        value={formData.provider}
                        onChange={(e) => setFormData({...formData, provider: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Choose provider</option>
                        {ELECTRICITY_PROVIDERS[formData.country].map(provider => (
                          <option key={provider.id} value={provider.id}>{provider.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(utilityModal.type === 'data' || utilityModal.type === 'airtime') && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Select Network</label>
                      <select
                        value={formData.provider}
                        onChange={(e) => setFormData({...formData, provider: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Choose network</option>
                        {MOBILE_PROVIDERS[formData.country].map(provider => (
                          <option key={provider} value={provider}>{provider}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Account Number / Phone Number */}
                  {utilityModal.type === 'electricity' && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Meter Number</label>
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                        placeholder="Enter meter number"
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  )}

                  {(utilityModal.type === 'data' || utilityModal.type === 'airtime') && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        placeholder="Enter phone number"
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  )}

                  {/* Amount Input (for variable price items) */}
                  {utilityModal.price === 'Variable' && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Amount ($)</label>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        placeholder="Enter amount"
                        min="1"
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  )}

                  {/* Payment Token Selection */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Pay with</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {PAYMENT_TOKENS.map(token => (
                        <button
                          key={token.id}
                          onClick={() => setSelectedToken(token.id)}
                          style={{
                            padding: '12px',
                            background: selectedToken === token.id ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                            border: selectedToken === token.id ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            position: 'relative'
                          }}
                        >
                          {token.recommended && (
                            <div style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              background: '#22c55e',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '9px',
                              fontWeight: 'bold'
                            }}>
                              BEST
                            </div>
                          )}
                          <div style={{ fontSize: '24px', marginBottom: '4px' }}>{token.icon}</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{token.name}</div>
                          <div style={{ fontSize: '11px', color: '#9ca3af' }}>{token.fee}% fee</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  {fees && (
                    <div style={{
                      background: 'rgba(255,255,255,0.05)',
                      padding: '16px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>Payment Breakdown</h3>
                      <div style={{ fontSize: '13px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af' }}>Bill Amount:</span>
                        <span>${fees.amount.toFixed(2)}</span>
                      </div>
                      <div style={{ fontSize: '13px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af' }}>Platform Fee ({PAYMENT_TOKENS.find(t => t.id === selectedToken).fee}%):</span>
                        <span>${fees.platformFee.toFixed(2)}</span>
                      </div>
                      <div style={{ fontSize: '13px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af' }}>Gas Fee (est.):</span>
                        <span>${fees.gasFee.toFixed(2)}</span>
                      </div>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Total:</span>
                          <span style={{ color: '#4ade80' }}>{fees.total.toFixed(2)} {fees.token}</span>
                        </div>
                      </div>
                      {fees.savings > 0 && (
                        <div style={{ 
                          marginTop: '8px', 
                          padding: '8px', 
                          background: 'rgba(34,197,94,0.1)', 
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#4ade80'
                        }}>
                          💰 You save ${fees.savings.toFixed(2)} with stablecoins!
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={pay}
                    disabled={!formData.provider || (utilityModal.type === 'electricity' && !formData.accountNumber) || ((utilityModal.type === 'data' || utilityModal.type === 'airtime') && !formData.phoneNumber) || (utilityModal.price === 'Variable' && !formData.amount)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: (!formData.provider || (utilityModal.type === 'electricity' && !formData.accountNumber) || ((utilityModal.type === 'data' || utilityModal.type === 'airtime') && !formData.phoneNumber) || (utilityModal.price === 'Variable' && !formData.amount)) ? '#6b7280' : 'linear-gradient(135deg, #9333ea, #ec4899)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: (!formData.provider || (utilityModal.type === 'electricity' && !formData.accountNumber) || ((utilityModal.type === 'data' || utilityModal.type === 'airtime') && !formData.phoneNumber) || (utilityModal.price === 'Variable' && !formData.amount)) ? 'not-allowed' : 'pointer',
                      opacity: (!formData.provider || (utilityModal.type === 'electricity' && !formData.accountNumber) || ((utilityModal.type === 'data' || utilityModal.type === 'airtime') && !formData.phoneNumber) || (utilityModal.price === 'Variable' && !formData.amount)) ? 0.5 : 1
                    }}
                  >
                    Pay Now
                  </button>
                </>
              )}

              {step === 'processing' && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    border: '4px solid rgba(168,85,247,0.2)',
                    borderTop: '4px solid #9333ea',
                    borderRadius: '50%',
                    margin: '0 auto 24px',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Processing Payment</h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px' }}>Preparing transaction...</p>
                </div>
              )}

              {step === 'confirming' && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    border: '4px solid rgba(168,85,247,0.2)',
                    borderTop: '4px solid #9333ea',
                    borderRadius: '50%',
                    margin: '0 auto 24px',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Confirming on Chain</h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px' }}>Waiting for blockchain confirmation...</p>
                </div>
              )}

              {step === 'success' && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#22c55e' }}>Payment Successful!</h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>
                    Your {utilityModal.name} payment has been processed
                  </p>
                  <button
                    onClick={closeModal}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #9333ea, #ec4899)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transaction History Modal */}
        {showHistory && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 50
          }}>
            <div style={{
              background: '#1e293b',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid rgba(168,85,247,0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Transaction History</h2>
                <button 
                  onClick={() => setShowHistory(false)} 
                  style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '24px', cursor: 'pointer' }}
                >×</button>
              </div>

              {transactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                  <p>No transactions yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {transactions.map(tx => (
                    <div 
                      key={tx.id}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <div>
                          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>{tx.product}</h3>
                          <p style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                        <div style={{
                          padding: '4px 8px',
                          background: 'rgba(34,197,94,0.2)',
                          border: '1px solid rgba(34,197,94,0.3)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          color: '#4ade80'
                        }}>
                          {tx.status}
                        </div>
                      </div>
                      
                      {tx.details.meter && (
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                          Meter: {tx.details.meter}
                        </p>
                      )}
                      {tx.details.phone && (
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                          Phone: {tx.details.phone}
                        </p>
                      )}
                      {tx.details.provider && (
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
                          Provider: {tx.details.provider}
                        </p>
                      )}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#9ca3af' }}>Amount:</span>
                        <span style={{ fontSize: '13px' }}>${tx.amount.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#9ca3af' }}>Total Paid:</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#4ade80' }}>
                          {tx.total.toFixed(2)} {tx.token}
                        </span>
                      </div>
                      
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#9ca3af',
                        marginBottom: '8px',
                        wordBreak: 'break-all'
                      }}>
                        {tx.chain} • {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                      </div>
                      
                      <button
                        onClick={() => downloadReceipt(tx)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: 'rgba(168,85,247,0.2)',
                          border: '1px solid rgba(168,85,247,0.3)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        📥 Download Receipt
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
