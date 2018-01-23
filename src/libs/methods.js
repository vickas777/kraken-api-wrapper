const privateMethods = [
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
  'DepositMethods',
  'DepositAddresses',
  'DepositStatus',
  'WithdrawInfo',
  'Withdraw',
  'WithdrawStatus',
  'WithdrawCancel',
];
const publicMethods = [
  'Time',
  'Assets',
  'AssetPairs',
  'Ticker',
  'OHLC',
  'Depth',
  'Trades',
  'Spread',
];

module.exports = { privateMethods, publicMethods };
