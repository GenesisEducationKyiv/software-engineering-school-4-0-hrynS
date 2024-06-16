import User from './user';
import Currency from './currency';
import ExchangeRate from './exchangeRate';
import Subscription from './subscription';

User.hasMany(Subscription, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'subscriptions',
});

Subscription.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'userId',
  as: 'user',
});

// Currency has many Subscriptions as base currency
Currency.hasMany(Subscription, {
  sourceKey: 'code',
  foreignKey: 'baseCurrencyCode',
  as: 'baseSubscriptions',
});

// Currency has many Subscriptions as target currency
Currency.hasMany(Subscription, {
  sourceKey: 'code',
  foreignKey: 'targetCurrencyCode',
  as: 'targetSubscriptions',
});

Subscription.belongsTo(Currency, {
  targetKey: 'code',
  foreignKey: 'baseCurrencyCode',
  as: 'baseCurrency',
});

Subscription.belongsTo(Currency, {
  targetKey: 'code',
  foreignKey: 'targetCurrencyCode',
  as: 'targetCurrency',
});

Currency.hasMany(ExchangeRate, {
  sourceKey: 'code',
  foreignKey: 'baseCurrencyCode',
  as: 'baseExchangeRates',
});

Currency.hasMany(ExchangeRate, {
  sourceKey: 'code',
  foreignKey: 'targetCurrencyCode',
  as: 'targetExchangeRates',
});

ExchangeRate.belongsTo(Currency, {
  targetKey: 'code',
  foreignKey: 'baseCurrencyCode',
  as: 'baseCurrency',
});

ExchangeRate.belongsTo(Currency, {
  targetKey: 'code',
  foreignKey: 'targetCurrencyCode',
  as: 'targetCurrency',
});

export { User, Currency, ExchangeRate, Subscription };
