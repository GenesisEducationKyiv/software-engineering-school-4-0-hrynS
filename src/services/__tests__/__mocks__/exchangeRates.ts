import { CurrencyCodes } from '../../../constants/currencyCodes';

export const exchangeRateData = [
  {
    currencyCodeA: CurrencyCodes.USD,
    currencyCodeB: CurrencyCodes.EUR,
    date: 1638326400,
    rateBuy: 1.2,
    rateSell: 1.3,
  },
  {
    currencyCodeA: CurrencyCodes.GBP,
    currencyCodeB: CurrencyCodes.USD,
    date: 1638326400,
    rateBuy: 1.35,
    rateSell: 1.36,
  },
  {
    currencyCodeA: CurrencyCodes.JPY,
    currencyCodeB: CurrencyCodes.GBP,
    date: 1638326400,
    rateBuy: 150.5,
    rateSell: 150.8,
  },
  {
    currencyCodeA: CurrencyCodes.CHF,
    currencyCodeB: CurrencyCodes.JPY,
    date: 1638326400,
    rateBuy: 118.2,
    rateSell: 118.5,
  },
  {
    currencyCodeA: CurrencyCodes.UAH,
    currencyCodeB: CurrencyCodes.CHF,
    date: 1638326400,
    rateBuy: 0.033,
    rateSell: 0.034,
  },
];
