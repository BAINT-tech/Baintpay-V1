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
    { id: 'elec1', name: '⚡ Electricity Bill', type: 'electricity', suggestedPrice: 50, description: 'Pay your power bill instantly' },
    { id: 'water1', name: '💧 Water Bill', type: 'water', suggestedPrice: 30, description: 'Pay water bills', comingSoon: true },
    { id: 'internet1', name: '📡 Internet/WiFi Bill', type: 'internet', suggestedPrice: 40, description: 'Pay internet providers' },
    { id: 'starlink1', name: '🛰️ Starlink', type: 'internet', suggestedPrice: 110.00, description: 'Starlink internet subscription', popular: true },
  ],
  mobile: [
    { id: 'data1', name: '📱 Mobile Data', type: 'data', suggestedPrice: 10, description: 'Buy data bundle - any amount' },
    { id: 'airtime1', name: '📞 Airtime Top-up', type: 'airtime', suggestedPrice: 20, description: 'Mobile airtime - any amount' },
  ],
  entertainment: [
    { id: '1', name: '🎬 Netflix', suggestedPrice: 15.99, description: 'Netflix subscription' },
    { id: '2', name: '🎵 Spotify', suggestedPrice: 10.99, description: 'Spotify Premium' },
    { id: '3', name: '📺 YouTube Premium', suggestedPrice: 11.99, description: 'Ad-free YouTube' },
    { id: '4', name: '🏰 Disney+', suggestedPrice: 7.99, description: 'Disney+ subscription' },
    { id: '5', name: '🎧 Apple Music', suggestedPrice: 10.99, description: 'Apple Music subscription' },
    { id: 'dstv1', name: '📺 DSTV', suggestedPrice: 89.00, description: 'DSTV subscription', popular: true },
    { id: 'dstv2', name: '📺 GOtv', suggestedPrice: 12.00, description: 'GOtv subscription' },
    { id: 'showmax1', name: '📺 Showmax', suggestedPrice: 9.99, description: 'Showmax subscription' },
  ],
  gaming: [
    { id: '6', name: '🎮 Roblox', suggestedPrice: 9.99, description: 'Robux - any amount' },
    { id: '7', name: '🔫 PUBG Mobile', suggestedPrice: 24.99, description: 'UC coins - any amount' },
    { id: '8', name: '💎 Free Fire', suggestedPrice: 19.99, description: 'Diamonds - any amount' },
    { id: 'codm1', name: '🎖️ COD Mobile', suggestedPrice: 19.99, description: 'CP (CoD Points) - any amount', popular: true },
    { id: '9', name: '🎮 Steam', suggestedPrice: 20.00, description: 'Steam wallet' },
    { id: '10', name: '🎮 PlayStation', suggestedPrice: 25.00, description: 'PSN wallet' },
    { id: '11', name: '🎮 Xbox', suggestedPrice: 25.00, description: 'Xbox gift card' },
    { id: 'mobilelegends1', name: '⚔️ Mobile Legends', suggestedPrice: 15.99, description: 'Diamonds - any amount' },
  ],
  betting: [
    { id: 'sportybet1', name: '⚽ Sportybet', suggestedPrice: 50.00, description: 'Fund your Sportybet wallet', popular: true },
    { id: 'bet9ja1', name: '🎲 Bet9ja', suggestedPrice: 50.00, description: 'Top up Bet9ja account', popular: true },
    { id: 'betking1', name: '👑 BetKing', suggestedPrice: 30.00, description: 'Fund BetKing wallet' },
    { id: 'polymarket1', name: '📊 Polymarket', suggestedPrice: 100.00, description: 'Prediction market deposits' },
    { id: '1xbet1', name: '🎰 1xBet', suggestedPrice: 50.00, description: 'Fund 1xBet account' },
    { id: 'betway1', name: '🏆 Betway', suggestedPrice: 40.00, description: 'Top up Betway wallet' },
    { id: 'msport1', name: '⚡ MSport', suggestedPrice: 30.00, description: 'Fund MSport account' },
  ],
  shopping: [
    { id: 'jumia1', name: '🛍️ Jumia', suggestedPrice: 50.00, description: 'Jumia voucher', popular: true },
    { id: 'konga1', name: '🛍️ Konga', suggestedPrice: 50.00, description: 'Konga voucher' },
    { id: 'temu1', name: '🛒 Temu', suggestedPrice: 25.00, description: 'Temu gift card' },
    { id: 'amazon1', name: '📦 Amazon', suggestedPrice: 50.00, description: 'Amazon gift card' },
    { id: 'shein1', name: '👗 Shein', suggestedPrice: 30.00, description: 'Shein gift card' },
  ],
  transport: [
    { id: 'uber1', name: '🚕 Uber', suggestedPrice: 25.00, description: 'Uber gift card', popular: true },
    { id: 'bolt1', name: '🚗 Bolt', suggestedPrice: 20.00, description: 'Bolt credit' },
    { id: 'indriver1', name: '🚖 inDriver', suggestedPrice: 20.00, description: 'inDriver credit' },
  ],
  social: [
    { id: '12', name: '💃 TikTok', suggestedPrice: 12.99, description: 'TikTok coins' },
    { id: '13', name: '✖️ X Premium', suggestedPrice: 8.00, description: 'Twitter/X Premium' },
    { id: '14', name: '💬 Discord Nitro', suggestedPrice: 9.99, description: 'Discord Nitro' },
    { id: '15', name: '🤖 Reddit Premium', suggestedPrice: 5.99, description: 'Reddit Premium' },
    { id: 'twitch1', name: '🎮 Twitch', suggestedPrice: 4.99, description: 'Twitch subscription' },
    { id: 'twitch2', name: '💜 Twitch Turbo', suggestedPrice: 11.99, description: 'Ad-free Twitch experience' },
  ],
  ai: [
    { id: '16', name: '🤖 ChatGPT', suggestedPrice: 20.00, description: 'OpenAI credits' },
    { id: '17', name: '🧠 Claude', suggestedPrice: 20.00, description: 'Anthropic credits' },
    { id: 'gemini1', name: '✨ Google Gemini', suggestedPrice: 20.00, description: 'Gemini Advanced subscription', popular: true },
    { id: '18', name: '💻 GitHub Copilot', suggestedPrice: 10.00, description: 'AI code assistant' },
    { id: '19', name: '🎨 Midjourney', suggestedPrice: 30.00, description: 'AI image generation' },
    { id: 'perplexity1', name: '🔍 Perplexity Pro', suggestedPrice: 20.00, description: 'AI search engine' },
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
  const [step, setStep] = useState('form');
  const [selectedToken, setSelectedToken] = useState('usdt');
  const [showHistory, setShowHistory] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [formData, setFormData] = useState({
    country: 'nigeria',
    provider: '',
    accountNumber: '',
    phoneNumber: '',
    email: '',
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
    setModal(product);
    setStep('form');
    setCustomAmount(product.suggestedPrice.toString());
    setFormData({ country: 'nigeria', provider: '', accountNumber: '', phoneNumber: '', email: '' });
    setSelectedToken('usdt');
  };

  const pay = () => {
    const amount = parseFloat(customAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setStep('processing');
    setTimeout(() => setStep('confirming'), 2000);
    setTimeout(() => {
      const fees = calculateFees(amount, selectedToken);
      
      const transaction = {
        id: `BNT-${Date.now()}`,
        date: new Date().toISOString(),
        product: modal.name,
        amount: fees.amount,
        fee: fees.platformFee + fees.gasFee,
        total: fees.total,
        token: fees.token,
        chain: selectedToken === 'sol' ? 'Solana' : 'BNB Chain',
        status: 'completed',
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
        details: modal.type === 'electricity' ? {
          meter: formData.accountNumber,
          provider: formData.provider,
        } : modal.type === 'data' || modal.type === 'airtime' ? {
          phone: formData.phoneNumber,
          provider: formData.provider,
        } : {
          email: formData.email,
        },
      };
      
      saveTransaction(transaction);
      setTransactions(getTransactions());
      setStep('success');
    }, 4000);
  };

  const closeModal = () => {
    setModal(null);
    setStep('form');
    setCustomAmount('');
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
${tx.details.email ? `Email: ${tx.details.email}` : ''}

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
  { id: 'utilities', label: '💡 Bills & Internet' },  // Updated
  { id: 'mobile', label: '📱 Mobile' },
  { id: 'entertainment', label: '🎬 Entertainment' },
  { id: 'gaming', label: '🎮 Gaming' },
  { id: 'betting', label: '🎰 Betting' },
  { id: 'shopping', label: '🛍️ Shopping' },
  { id: 'transport', label: '🚕 Transport' },
  { id: 'social', label: '💬 Social' },
  { id: 'ai', label: '🤖 AI' },
];

  const amount = parseFloat(customAmount || 0);
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
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>Pay Any Amount, Anywhere</p>
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
            Pay Any Bill. Any Amount. Instantly.
          </h2>
          <p style={{ color: '#d1d5db', fontSize: '16px', marginBottom: '8px' }}>
            Custom amounts for every service. Works in every country. 🌍
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
                  fontSize: '14px', 
                  color: '#9ca3af'
                }}>
                  From ${p.suggestedPrice}
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

        {/* Payment Modal */}
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

                  {/* Country Selection - Only for utilities and mobile */}
                  {(modal.type === 'electricity' || modal.type === 'data' || modal.type === 'airtime') && (
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
                  )}

                  {/* Provider Selection for Electricity */}
                  {modal.type === 'electricity' && (
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

                  {/* Network Selection for Mobile */}
                  {(modal.type === 'data' || modal.type === 'airtime') && (
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

                  {/* Meter Number for Electricity */}
                  {modal.type === 'electricity' && (
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

                  {/* Phone Number for Mobile */}
                  {(modal.type === 'data' || modal.type === 'airtime') && (
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

                  {/* Email for Subscriptions */}
                  {!modal.type && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Email (Optional)</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData,email: e.target.value})}
                        placeholder="Enter email for delivery"
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

                  {/* Custom Amount Input - FOR EVERYONE */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      Enter Amount ($)
                    </label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder={`Suggested: $${modal.suggestedPrice}`}
                      min="1"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                      💡 Typical price: ${modal.suggestedPrice} (adjust to your needs)
                    </p>
                  </div>

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
                        <span style={{ color: '#9ca3af' }}>Amount:</span>
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
                    disabled={!customAmount || parseFloat(customAmount) <= 0}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: (!customAmount || parseFloat(customAmount) <= 0) ? '#6b7280' : 'linear-gradient(135deg, #9333ea, #ec4899)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: (!customAmount || parseFloat(customAmount) <= 0) ? 'not-allowed' : 'pointer',
                      opacity: (!customAmount || parseFloat(customAmount) <= 0) ? 0.5 : 1
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
                  <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
                    ${parseFloat(customAmount).toFixed(2)} paid for {modal.name}
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '24px' }}>
                    Transaction will be processed within 5 minutes
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
                  <p style={{ fontSize: '12px', marginTop: '8px' }}>Your payment history will appear here</p>
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
                          <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                            {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}
                          </p>
                        </div>
                        <div style={{
                          padding: '4px 8px',
                          background: 'rgba(34,197,94,0.2)',
                          border: '1px solid rgba(34,197,94,0.3)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          color: '#4ade80',
                          textTransform: 'uppercase'
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
                      {tx.details.email && (
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
                          Email: {tx.details.email}
                        </p>
                      )}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#9ca3af' }}>Amount:</span>
                        <span style={{ fontSize: '13px' }}>${tx.amount.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#9ca3af' }}>Fees:</span>
                        <span style={{ fontSize: '13px' }}>${tx.fee.toFixed(2)}</span>
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
