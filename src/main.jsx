import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserProvider } from 'ethers';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import axios from 'axios';
import './index.css';

const API_URL = 'http://localhost:4000';

// Utility data
const ELECTRICITY_PROVIDERS = {
  nigeria: [
    { id: 'ikedc', name: 'Ikeja Electric (IKEDC)', icon: '⚡' },
    { id: 'ekedc', name: 'Eko Electric (EKEDC)', icon: '⚡' },
    { id: 'aedc', name: 'Abuja Electric (AEDC)', icon: '⚡' },
    { id: 'phed', name: 'Port Harcourt Electric (PHED)', icon: '⚡' },
  ],
  kenya: [
    { id: 'kplc', name: 'Kenya Power (KPLC)', icon: '⚡' },
  ],
  ghana: [
    { id: 'ecg', name: 'ECG Ghana', icon: '⚡' },
  ],
  southafrica: [
    { id: 'eskom', name: 'Eskom', icon: '⚡' },
    { id: 'citypower', name: 'City Power Johannesburg', icon: '⚡' },
  ],
};

// Wallet Connect Component
function WalletConnect({ onConnect, isConnected, address, chain, onDisconnect }) {
  const [showMenu, setShowMenu] = useState(false);
  const [provider, setProvider] = useState(null);
  
  const { publicKey, disconnect: solanaDisconnect } = useWallet();

  useEffect(() => {
    if (publicKey) {
      onConnect('solana', publicKey.toBase58());
    }
  }, [publicKey]);

  const connectMetaMask = async (chainId) => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const chainName = chainId === 'bnb' ? 'bnb' : chainId === 'base' ? 'base' : 'avalanche';
      
      onConnect(chainName, accounts[0]);
      setProvider(provider);
      setShowMenu(false);
    } catch (error) {
      console.error('MetaMask connection error:', error);
      alert('Failed to connect MetaMask');
    }
  };

  const handleDisconnect = () => {
    if (chain === 'solana') {
      solanaDisconnect();
    }
    onDisconnect();
    setProvider(null);
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            <span className="text-xs text-gray-400">({chain.toUpperCase()})</span>
          </div>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all font-semibold"
      >
        🔗 Connect Wallet
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-purple-500/30 rounded-lg shadow-xl z-50">
          <div className="p-2">
            <button
              onClick={() => connectMetaMask('bnb')}
              className="w-full px-4 py-3 text-left hover:bg-purple-500/20 transition-all rounded-lg flex items-center gap-3"
            >
              <span className="text-2xl">💎</span>
              <div>
                <div className="font-semibold">BNB Chain</div>
                <div className="text-xs text-gray-400">MetaMask / Trust Wallet</div>
              </div>
            </button>
            
            <button
              onClick={() => connectMetaMask('base')}
              className="w-full px-4 py-3 text-left hover:bg-purple-500/20 transition-all rounded-lg flex items-center gap-3"
            >
              <span className="text-2xl">🔵</span>
              <div>
                <div className="font-semibold">Base</div>
                <div className="text-xs text-gray-400">MetaMask / Coinbase</div>
              </div>
            </button>

            <div className="px-4 py-2">
              <WalletMultiButton className="!bg-purple-600 !rounded-lg !w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Electricity Bill Payment Modal
function ElectricityModal({ isOpen, onClose, walletAddress, chain }) {
  const [country, setCountry] = useState('nigeria');
  const [provider, setProvider] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState('form');

  const handlePay = async () => {
    if (!meterNumber || !amount) {
      alert('Please fill all fields');
      return;
    }

    setStep('processing');

    try {
      const order = await axios.post(`${API_URL}/api/orders/create`, {
        productId: 'utility-electricity',
        chain: chain,
        tokenSymbol: chain === 'bnb' ? 'BNB' : chain === 'solana' ? 'SOL' : 'ETH',
        fromAddress: walletAddress,
        metadata: {
          type: 'electricity',
          country,
          provider,
          meterNumber,
          amount,
        }
      });

      setStep('confirming');
      
      await axios.post(`${API_URL}/api/payments/monitor`, {
        orderId: order.data.orderId,
        txHash: '0xdemo' + Date.now()
      });

      setTimeout(() => setStep('success'), 3000);
    } catch (error) {
      alert('Payment failed: ' + error.message);
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">💡 Pay Electricity Bill</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
        </div>

        {step === 'form' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Country</label>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setProvider('');
                }}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
              >
                <option value="nigeria">🇳🇬 Nigeria</option>
                <option value="kenya">🇰🇪 Kenya</option>
                <option value="ghana">🇬🇭 Ghana</option>
                <option value="southafrica">🇿🇦 South Africa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
              >
                <option value="">Select provider...</option>
                {ELECTRICITY_PROVIDERS[country]?.map(p => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Meter Number</label>
              <input
                type="text"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                placeholder="Enter meter number"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Amount (USD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
              />
            </div>

            <button
              onClick={handlePay}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all"
            >
              Pay ${amount || '0'} with Crypto
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">Processing Payment...</h3>
          </div>
        )}

        {step === 'confirming' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">Confirming...</h3>
            <p className="text-gray-400">Crediting your meter</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Payment Successful!</h3>
            <div className="bg-white/5 rounded-xl p-4 my-4">
              <p className="text-sm text-gray-400 mb-2">${amount} credited to:</p>
              <p className="text-lg font-mono font-bold">{meterNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-green-600 rounded-xl font-semibold hover:bg-green-500 transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Product Payment Modal
function ProductModal({ isOpen, onClose, product, walletAddress, chain }) {
  const [step, setStep] = useState('select');

  const handlePay = async () => {
    setStep('processing');
    
    try {
      const order = await axios.post(`${API_URL}/api/orders/create`, {
        productId: product.id,
        chain: chain,
        tokenSymbol: chain === 'bnb' ? 'BNB' : chain === 'solana' ? 'SOL' : 'ETH',
        fromAddress: walletAddress,
      });

      setStep('confirming');
      
      await axios.post(`${API_URL}/api/payments/monitor`, {
        orderId: order.data.orderId,
        txHash: '0xdemo' + Date.now()
      });

      setTimeout(() => setStep('success'), 3000);
    } catch (error) {
      alert('Payment failed: ' + error.message);
      setStep('select');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
        </div>

        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <h3 className="font-bold mb-1">{product.name}</h3>
          <p className="text-sm text-gray-400 mb-3">{product.provider}</p>
          <div className="flex justify-between items-center pt-3 border-t border-white/10">
            <span className="text-gray-400">Total</span>
            <span className="text-2xl font-bold text-green-400">${product.price_usd}</span>
          </div>
        </div>

        {step === 'select' && (
          <button
            onClick={handlePay}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            Pay ${product.price_usd}
          </button>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">Processing...</h3>
          </div>
        )}

        {step === 'confirming' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">Confirming...</h3>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Success!</h3>
            <div className="bg-white/5 rounded-xl p-4 my-4">
              <p className="text-sm text-gray-400 mb-2">Your Code:</p>
              <p className="text-2xl font-mono font-bold">XXXX-YYYY-ZZZZ</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-green-600 rounded-xl font-semibold hover:bg-green-500 transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Main App
function AppContent() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('utilities');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [showElectricityModal, setShowElectricityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [activeTab]);

  const loadProducts = async () => {
    try {
      const category = activeTab === 'utilities' ? 'mobile' : activeTab;
      const response = await axios.get(`${API_URL}/api/products`, { params: { category } });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleConnect = (chain, address) => {
    setIsConnected(true);
    setSelectedChain(chain);
    setWalletAddress(address);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    setSelectedChain('');
  };

  const handleBuy = (product) => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }
    setSelectedProduct(product);
  };

  const tabs = [
    { id: 'utilities', label: 'Utilities', icon: '💡' },
    { id: 'streaming', label: 'Streaming', icon: '🎬' },
    { id: 'gaming', label: 'Gaming', icon: '🎮' },
    { id: 'social', label: 'Social', icon: '💬' },
    { id: 'ai', label: 'AI Tools', icon: '🤖' },
    { id: 'mobile', label: 'Mobile', icon: '📱' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-purple-500/20 backdrop-blur-sm bg-black/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
                💎
              </div>
              <div>
                <h1 className="text-2xl font-bold">BaintWallet</h1>
                <p className="text-xs text-gray-400">Pay Bills with Crypto</p>
              </div>
            </div>

            <WalletConnect
              onConnect={handleConnect}
              isConnected={isConnected}
              address={walletAddress}
              chain={selectedChain}
              onDisconnect={handleDisconnect}
            />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Pay Everything with Crypto
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Electricity bills, streaming, gaming, and more. Multi-chain payments across Africa and beyond.
        </p>
      </section>

      {/* Tabs */}
      <section className="container mx-auto px-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Utilities Section */}
        {activeTab === 'utilities' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <button
              onClick={() => {
                if (!isConnected) {
                  alert('Connect wallet first!');
                  return;
                }
                setShowElectricityModal(true);
              }}
              className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-8 hover:border-purple-500 transition-all group text-left"
            >
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-2">Electricity Bills</h3>
              <p className="text-gray-400 mb-4">Pay your power bill instantly</p>
              <p className="text-sm text-gray-500">Nigeria • Kenya • Ghana • South Africa</p>
              <div className="mt-4 text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                Pay Now →
              </div>
            </button>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 opacity-50">
              <div className="text-6xl mb-4">💧</div>
              <h3 className="text-2xl font-bold mb-2">Water Bills</h3>
              <p className="text-gray-400 mb-4">Coming soon</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 opacity-50">
              <div className="text-6xl mb-4">📡</div>
              <h3 className="text-2xl font-bold mb-2">Internet Bills</h3>
              <p className="text-gray-400 mb-4">Coming soon</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {activeTab !== 'utilities' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all"
              >
                <div className="h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-1">{product.provider}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-400">${product.price_usd}</span>
                    <button
                      onClick={() => handleBuy(product)}
                      className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-all text-sm font-semibold"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      <ElectricityModal
        isOpen={showElectricityModal}
        onClose={() => setShowElectricityModal(false)}
        walletAddress={walletAddress}
        chain={selectedChain}
      />

      {selectedProduct && (
        <ProductModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          walletAddress={walletAddress}
          chain={selectedChain}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-purple-500/20 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p className="mb-2">🚀 Built with 💜 by Baint Team</p>
          <p className="text-sm">Pay bills and buy services with crypto</p>
        </div>
      </footer>
    </div>
  );
}

// Wrap with Solana Wallet Provider
function App() {
  const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
