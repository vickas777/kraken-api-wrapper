const methods = {};

methods.private = [
  'Balance',
  'TradeBalance',
  'OpenOrders',
  'ClosedOrders',
  'QueryOrders',
  'TradesHistory',
  'QueryTrades',
  'OpenPositions',
  'Ledgers',
  'QueryLedgers',
  'TradeVolume',
  'AddOrder',
  'CancelOrder',
];
methods.public = [
  'Time',
  'Assets',
  'AssetPairs',
  'Ticker',
  'OHLC',
  'Depth',
  'Trades',
  'Spread',
];

module.exports = methods;
