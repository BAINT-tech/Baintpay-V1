const Flutterwave = require('flutterwave-node-v3');
const vtpass = require('./vtpass');

class PaymentManager {
  constructor() {
    this.flutterwave = new Flutterwave(
      process.env.FLW_PUBLIC_KEY,
      process.env.FLW_SECRET_KEY
    );
  }

  async processPayment(type, params) {
    const { phoneNumber, amount, country, network, meterNumber, disco, meterType } = params;

    // Use VTPass for Nigerian services
    if (country?.toLowerCase() === 'nigeria' || country === 'NG') {
      switch(type) {
        case 'electricity':
          return await vtpass.payElectricity(meterNumber, amount, disco, meterType || 'prepaid');
        
        case 'airtime':
          return await vtpass.buyAirtime(phoneNumber, amount, network);
        
        case 'data':
          return await vtpass.buyData(phoneNumber, amount, network);
        
        default:
          throw new Error(`Unsupported payment type: ${type}`);
      }
    }

    // Use Flutterwave for other countries
    return await this.processFlutterwavePayment(type, params);
  }

  async processFlutterwavePayment(type, params) {
    const { phoneNumber, amount, country, meterNumber, provider, meterType } = params;

    const payload = {
      country: country.toUpperCase(),
      customer: phoneNumber || meterNumber,
      amount: parseFloat(amount),
      type: type === 'electricity' ? meterType || 'prepaid' : type,
      recurrence: "ONCE",
      reference: `BNT-FLW-${Date.now()}`
    };

    const response = await this.flutterwave.Bills.create_bill(payload);

    if (response.status !== 'success') {
      throw new Error(response.message || 'Payment failed');
    }

    return {
      success: true,
      provider: 'flutterwave',
      reference: response.data.reference,
      token: response.data.token,
      units: response.data.units,
      rawResponse: response
    };
  }
}

module.exports = new PaymentManager();
