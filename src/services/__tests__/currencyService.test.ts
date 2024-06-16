import axios from 'axios';
import { CurrencyCodes } from '../../constants/currencyCodes';
import { ICurrencyService } from '../currencyService';
import { exchangeRateData } from './__mocks__/exchangeRates';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('CurrencyService', () => {
  const env = process.env;
  let Service: { new (): ICurrencyService };
  let CurrencyService: ICurrencyService;

  beforeAll(async () => {
    const apiUrl = 'http://example.com/api';
    process.env.CURRENCY_DATA_PROVIDER_URL = apiUrl;
    Service = await import('../currencyService').then((file) => file.default);
    CurrencyService = new Service();
    mockedAxios.get.mockResolvedValue({ data: exchangeRateData });
  });

  afterAll(() => {
    process.env = env;
    jest.clearAllMocks();
  });

  describe('ASK exchange rates', () => {
    const testCases = [
      {
        baseCurrencyName: CurrencyCodes[CurrencyCodes.EUR],
        baseCurrency: CurrencyCodes.EUR,
        targetCurrencyName: CurrencyCodes[CurrencyCodes.USD],
        targetCurrency: CurrencyCodes.USD,
        expectedRate: 1.3,
      },
      {
        baseCurrencyName: CurrencyCodes[CurrencyCodes.USD],
        baseCurrency: CurrencyCodes.USD,
        targetCurrencyName: CurrencyCodes[CurrencyCodes.GBP],
        targetCurrency: CurrencyCodes.GBP,
        expectedRate: 1.36,
      },
      {
        baseCurrencyName: CurrencyCodes[CurrencyCodes.GBP],
        baseCurrency: CurrencyCodes.GBP,
        targetCurrencyName: CurrencyCodes[CurrencyCodes.JPY],
        targetCurrency: CurrencyCodes.JPY,
        expectedRate: 150.8,
      },
      {
        baseCurrencyName: CurrencyCodes[CurrencyCodes.JPY],
        baseCurrency: CurrencyCodes.JPY,
        targetCurrencyName: CurrencyCodes[CurrencyCodes.CHF],
        targetCurrency: CurrencyCodes.CHF,
        expectedRate: 118.5,
      },
      {
        baseCurrencyName: CurrencyCodes[CurrencyCodes.CHF],
        baseCurrency: CurrencyCodes.CHF,
        targetCurrencyName: CurrencyCodes[CurrencyCodes.UAH],
        targetCurrency: CurrencyCodes.UAH,
        expectedRate: 0.034,
      },
    ];

    it.each(testCases)(
      'should fetch the ASK exchange rate successfully for base $baseCurrencyName and target $targetCurrencyName',
      async ({ baseCurrency, targetCurrency, expectedRate }) => {
        const rate = await CurrencyService.getExchangeRate(baseCurrency, targetCurrency);
        expect(rate).toBe(expectedRate);
      },
    );
  });

  describe('BID exchange rates', () => {
    const bidTestCases = [
      {
        baseCurrencyName: CurrencyCodes[CurrencyCodes.EUR],
        baseCurrency: CurrencyCodes.EUR,
        targetCurrency: CurrencyCodes.USD,
        expectedRate: 1.2,
      },
      {
        baseCurrencyName: CurrencyCodes[CurrencyCodes.USD],
        baseCurrency: CurrencyCodes.USD,
        targetCurrency: CurrencyCodes.GBP,
        expectedRate: 1.35,
      },
      {
        baseCurrencyName: CurrencyCodes[CurrencyCodes.GBP],
        baseCurrency: CurrencyCodes.GBP,
        targetCurrency: CurrencyCodes.JPY,
        expectedRate: 150.5,
      },
      {
        baseCurrencyName: CurrencyCodes[CurrencyCodes.JPY],
        baseCurrency: CurrencyCodes.JPY,
        targetCurrency: CurrencyCodes.CHF,
        expectedRate: 118.2,
      },
      {
        baseCurrencyName: CurrencyCodes[CurrencyCodes.CHF],
        baseCurrency: CurrencyCodes.CHF,
        targetCurrency: CurrencyCodes.UAH,
        expectedRate: 0.033,
      },
    ];

    it.each(bidTestCases)(
      'should fetch the BID exchange rate successfully for base $baseCurrencyName and target $targetCurrencyName',
      async ({ baseCurrency, targetCurrency, expectedRate }) => {
        const rate = await CurrencyService.getExchangeRate(baseCurrency, targetCurrency, true);
        expect(rate).toBe(expectedRate);
      },
    );
  });

  describe('Edge cases', () => {
    it('should throw an error if the CURRENCY_DATA_PROVIDER_URL is not defined', async () => {
      expect(async () => new Service()).rejects.toThrow(
        'CURRENCY_DATA_PROVIDER_URL is not defined in environment' + ' variables',
      );
    });

    it('should throw an error if the exchange rate is not found', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      await expect(
        CurrencyService.getExchangeRate(CurrencyCodes.EUR, CurrencyCodes.USD),
      ).rejects.toThrow('Exchange rate not found');
    });

    it('should handle errors from the axios request', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      await expect(
        CurrencyService.getExchangeRate(CurrencyCodes.EUR, CurrencyCodes.USD),
      ).rejects.toThrow('Failed to fetch exchange rate');
    });

    it('should throw an error if no base currency code is provided', async () => {
      await expect(CurrencyService.getExchangeRate(undefined, CurrencyCodes.USD)).rejects.toThrow(
        'Invalid base currency code',
      );
    });

    it('should throw an error if no target currency code is provided', async () => {
      await expect(CurrencyService.getExchangeRate(CurrencyCodes.EUR, undefined)).rejects.toThrow(
        'Invalid target currency code',
      );
    });

    it('should throw an error if invalid base currency code is provided', async () => {
      await expect(
        // @ts-expect-error intentionally passed invalid currency code
        CurrencyService.getExchangeRate(999, CurrencyCodes.USD),
      ).rejects.toThrow('Invalid base currency code');
    });

    it('should throw an error if invalid target currency code is provided', async () => {
      await expect(
        // @ts-expect-error intentionally passed invalid currency code
        CurrencyService.getExchangeRate(CurrencyCodes.EUR, 999),
      ).rejects.toThrow('Invalid target currency code');
    });

    it('should throw a NotFoundError if the exchange rate is not found in the API response', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      await expect(
        CurrencyService.getExchangeRate(CurrencyCodes.EUR, CurrencyCodes.USD),
      ).rejects.toThrow('Exchange rate not found');
    });

    it('should throw an InternalServerError if the API request fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      await expect(
        CurrencyService.getExchangeRate(CurrencyCodes.EUR, CurrencyCodes.USD),
      ).rejects.toThrow('Failed to fetch exchange rate');
    });

    it('should throw an InternalServerError if the API returns an invalid response', async () => {
      mockedAxios.get.mockResolvedValue({ data: 'invalid response' });

      await expect(
        CurrencyService.getExchangeRate(CurrencyCodes.EUR, CurrencyCodes.USD),
      ).rejects.toThrow('Failed to fetch exchange rate');
    });

    it('should handle a scenario where the API returns null data', async () => {
      mockedAxios.get.mockResolvedValue({ data: null });

      await expect(
        CurrencyService.getExchangeRate(CurrencyCodes.EUR, CurrencyCodes.USD),
      ).rejects.toThrow('Failed to fetch exchange rate');
    });

    it('should handle a scenario where the API returns undefined data', async () => {
      mockedAxios.get.mockResolvedValue({ data: undefined });

      await expect(
        CurrencyService.getExchangeRate(CurrencyCodes.EUR, CurrencyCodes.USD),
      ).rejects.toThrow('Failed to fetch exchange rate');
    });

    it('should handle a scenario where the API returns an empty array', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      await expect(
        CurrencyService.getExchangeRate(CurrencyCodes.EUR, CurrencyCodes.USD),
      ).rejects.toThrow('Exchange rate not found');
    });
  });
});
