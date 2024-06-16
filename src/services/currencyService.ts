import axios from 'axios';
import { CurrencyCodes } from '../constants/currencyCodes';
import createError from 'http-errors';

type TExchangeRate = {
  currencyCodeA: number;
  currencyCodeB: number;
  date: number;
  rateBuy: number;
  rateSell: number;
};

class CurrencyService {
  private apiUrl: string;

  constructor() {
    if (!process.env.CURRENCY_DATA_PROVIDER_URL) {
      throw new Error('CURRENCY_DATA_PROVIDER_URL is not defined in environment variables');
    }
    this.apiUrl = process.env.CURRENCY_DATA_PROVIDER_URL;
  }

  public async getExchangeRate(
    baseCurrencyCode: CurrencyCodes,
    currencyCode: CurrencyCodes,
    isBidRate: boolean = false,
  ): Promise<number> {
    try {
      const response = await axios.get<TExchangeRate[]>(this.apiUrl);

      const rate = response.data.find((rate) => {
        return baseCurrencyCode === rate.currencyCodeB && currencyCode === rate.currencyCodeA;
      });

      if (!rate) {
        throw createError(404, 'Exchange rate not found');
      }

      return isBidRate ? rate.rateBuy : rate.rateSell;
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      throw createError(500, 'Failed to fetch exchange rate');
    }
  }
}

export default new CurrencyService();
