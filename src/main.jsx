import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

// Styles
const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
    color: white;
    min-height: 100vh;
  }
`;

// Mock Products Data
const PRODUCTS = {
  utilities: [
    { id: 'elec1', name: '⚡ Pay Electricity Bill', type: 'utility', price: 'Variable' }
  ],
  streaming: [
    { id: '1', name: 'Netflix Premium', price: 15.99 },
    { id: '2', name: 'Spotify Premium', price: 10.99 },
    { id: '3', name: 'YouTube Premium', price: 11.99 },
    { id: '4', name: 'Disney+', price: 7.99 },
  ],
  gaming: [
    { id: '5', name: 'Roblox 1000 Robux', price: 9.99 },
    { id: '6', name: 'PUBG 1800 UC', price: 24.99 },
    { id: '7', name: 'Free Fire Diamonds', price: 19.99 },
    { id: '8', name: 'Steam $20', price: 20.00 },
  ],
  social: [
    { id: '9', name: 'TikTok 1000 Coins', price: 12.99 },
    { id: '10', name: 'X Premium', price: 8.00 },
    { id: '11', name: 'Discord Nitro', price: 9.99 },
  ],
  ai: [
    { id: '12', name: 'OpenAI $50 Credits', price: 50.00 },
    { id: '13', name: 'Claude API $50', price: 50.00 },
    { id: '14', name: 'GitHub Copilot', price: 10.00 },
  ],
};

// Main App
function App() {
  const [wallet, setWallet] = useState(null);
  const [tab, setTab] = useState('utilities');
  const [modal, setModal] = useState(null);
  const [billModal, setBillModal] = useState(false);
  const [step, setStep] = useState('form');

  // Connect Wallet
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

  // Buy Product
  const buy = (product) => {
    if (!wallet) {
      alert('Connect wallet first!');
      return;
    }
    if (product.type === 'utility') {
      setBillModal(true);
    } else {
      setModal(product);
      setStep('form');
    }
  };

  // Pay
  const pay = () => {
    setStep('processing');
    setTimeout(() => setStep('confirming'), 2000);
    setTimeout(() => setStep('success'), 4000);
  };

  const tabs = [
    { id: 'utilities', label: '💡 Utilities' },
    { id: 'streaming', label: '🎬 Streaming' },
    { id: 'gaming', label: '🎮 Gaming' },
    { id: 'social', label: '💬 Social' },
    { id: 'ai', label: '🤖 AI Tools' },
  ];

  return (
    <>
      <style>{styles}</style>
      
      <div style={{ minHeight: '100vh', padding: '16px' }}>
        {/* Header */}
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
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>💎 BaintWallet</h1>
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>Pay Bills with Crypto</p>
          </div>
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

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
            Pay Everything with Crypto
          </h2>
          <p style={{ color: '#d1d5db' }}>
            Electricity bills, streaming, gaming & more
          </p>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          overflowX: 'auto',
          marginBottom: '24px',
          paddingBottom: '8px'
        }}>
          {tabs.map(t => (
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

        {/* Products Grid */}
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
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '16px'
              }}
            >
              <div style={{
                height: '100px',
                background: 'linear-gradient(135deg, #9333ea, #ec4899)',
                borderRadius: '8px',
                marginBottom: '12px'
              }}></div>
              <h3 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
                {p.name}
              </h3>
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
                  {typeof p.price === 'number' ? `$${p.price}` : p.price}
                </span>
                <button
                  onClick={() => buy(p)}
                  style={{
                    padding: '8px 16px',
                    background: '#9333ea',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Product Modal */}
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
              border: '1px solid rgba(168,85,247,0.3)'
            }}>
              {step === 'form' && (
                <>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
                    {modal.name}
                  </h2>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#4ade80', marginBottom: '24px' }}>
                    ${modal.price}
                  </p>
                  <button
                    onClick={pay}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #9333ea, #ec4899)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Pay Now
                  </button>
                </>
              )}

              {step === 'processing' && (
                <div style={{ textAlign: 'center', padding: '32px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    border: '4px solid #9333ea',
                    borderTop: '4px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px'
                  }}></div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Processing...</h3>
                </div>
              )}

              {step === 'confirming' && (
                <div style={{ textAlign: 'center', padding: '32px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    border: '4px solid #eab308',
                    borderTop: '4px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px'
                  }}></div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Confirming...</h3>
                </div>
              )}

              {step === 'success' && (
                <div style={{ textAlign: 'center', padding: '32px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: '#22c55e',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '32px'
                  }}>✓</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ade80', marginBottom: '16px' }}>
                    Success!
                  </h3>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '16px'
                  }}>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>Your Code:</p>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      XXXX-YYYY-ZZZZ
                    </p>
                  </div>
                  <button
                    onClick={() => setModal(null)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#22c55e',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontWeight: 'bold',
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

        {/* Bill Modal */}
        {billModal && (
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
              width: '100%'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
                💡 Pay Electricity Bill
              </h2>
              <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
                Coming soon! Nigeria, Kenya, Ghana, South Africa
              </p>
              <button
                onClick={() => setBillModal(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#9333ea',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
