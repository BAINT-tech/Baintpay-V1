const axios = require('axios');

class VTPassService {
  constructor() {
    this.baseUrl = process.env.VTPASS_ENVIRONMENT === 'production'
      ? 'https://api.vtpass.com/api'
      : 'https://sandbox.vtpass.com/api';
    
    this.apiKey = process.env.VTPASS_API_KEY;
    this.secretKey = process.env.VTPASS_SECRET_KEY;
  }

  async buyAirtime(phoneNumber, amount, network) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/pay`,
        {
          request_id: `BNT-AIR-${Date.now()}`,
          serviceID: `${network.toLowerCase()}-airtime`,
          amount: parseFloat(amount),
          phone: phoneNumber
        },
        {
          headers: {
            'api-key': this.apiKey,
            'secret-key': this.secretKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: response.data.code === '000',
        provider: 'vtpass',
        transactionId: response.data.requestId,
        message: response.data.response_description,
        rawResponse: response.data
      };
    } catch (error) {
      console.error('VTPass airtime error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.response_description || 'Airtime purchase failed');
    }
  }

  async buyData(phoneNumber, amount, network) {
    try {
      // Get available data plans
      const plansResponse = await axios.get(
        `${this.baseUrl}/service-variations?serviceID=${network.toLowerCase()}-data`,
        {
          headers: {
            'api-key': this.apiKey,
            'secret-key': this.secretKey
          }
        }
      );

      const plans = plansResponse.data.content.varations || [];
      const selectedPlan = plans.find(p => Math.abs(parseFloat(p.variation_amount) - parseFloat(amount)) < 1) || plans[0];

      const response = await axios.post(
        `${this.baseUrl}/pay`,
        {
          request_id: `BNT-DATA-${Date.now()}`,
          serviceID: `${network.toLowerCase()}-data`,
          billersCode: phoneNumber,
          variation_code: selectedPlan.variation_code,
          amount: parseFloat(selectedPlan.variation_amount),
          phone: phoneNumber
        },
        {
          headers: {
            'api-key': this.apiKey,
            'secret-key': this.secretKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: response.data.code === '000',
        provider: 'vtpass',
        transactionId: response.data.requestId,
        planName: selectedPlan.name,
        message: response.data.response_description,
        rawResponse: response.data
      };
    } catch (error) {
      console.error('VTPass data error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.response_description || 'Data purchase failed');
    }
  }

  async payElectricity(meterNumber, amount, disco, meterType) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/pay`,
        {
          request_id: `BNT-ELEC-${Date.now()}`,
          serviceID: disco.toLowerCase(),
          billersCode: meterNumber,
          variation_code: meterType,
          amount: parseFloat(amount),
          phone: '08000000000'
        },
        {
          headers: {
            'api-key': this.apiKey,
            'secret-key': this.secretKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: response.data.code === '000',
        provider: 'vtpass',
        transactionId: response.data.requestId,
        token: response.data.purchased_code || response.data.token,
        units: response.data.units,
        message: response.data.response_description,
        rawResponse: response.data
      };
    } catch (error) {
      console.error('VTPass electricity error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.response_description || 'Electricity payment failed');
    }
  }

  async verifyTransaction(requestId) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/requery`,
        { request_id: requestId },
        {
          headers: {
            'api-key': this.apiKey,
            'secret-key': this.secretKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: response.data.code === '000',
        status: response.data.content?.transactions?.status || 'pending',
        data: response.data
      };
    } catch (error) {
      console.error('VTPass verify error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new VTPassService();
