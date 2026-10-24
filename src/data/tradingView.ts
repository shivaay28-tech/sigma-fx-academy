export const TRADING_VIEW_SYMBOLS = [
  { symbol: 'NIFTY', ticker: 'NSE:NIFTY', market: 'india' },
  { symbol: 'BANKNIFTY', ticker: 'NSE:BANKNIFTY', market: 'india' },
  { symbol: 'RELIANCE', ticker: 'NSE:RELIANCE', market: 'india' },
  { symbol: 'HDFCBANK', ticker: 'NSE:HDFCBANK', market: 'india' },
  { symbol: 'TCS', ticker: 'NSE:TCS', market: 'india' },
  { symbol: 'SBIN', ticker: 'NSE:SBIN', market: 'india' },
  { symbol: 'INFY', ticker: 'NSE:INFY', market: 'india' },
  { symbol: 'GOLD', ticker: 'MCX:GOLD1!', market: 'futures' },
  { symbol: 'SILVER', ticker: 'MCX:SILVER1!', market: 'futures' },
  { symbol: 'CRUDEOIL', ticker: 'MCX:CRUDEOIL1!', market: 'futures' },
  { symbol: 'NATURALGAS', ticker: 'MCX:NATURALGAS1!', market: 'futures' },
  { symbol: 'COPPER', ticker: 'MCX:COPPER1!', market: 'futures' },
  { symbol: 'ZINC', ticker: 'MCX:ZINC1!', market: 'futures' },
  { symbol: 'ALUMINIUM', ticker: 'MCX:ALUMINIUM1!', market: 'futures' },
  { symbol: 'LEAD', ticker: 'MCX:LEAD1!', market: 'futures' },
  { symbol: 'NICKEL', ticker: 'MCX:NICKEL1!', market: 'futures' },
] as const

export type TradingViewMarket = (typeof TRADING_VIEW_SYMBOLS)[number]['market']

const SYMBOL_ALIASES: Array<{ symbol: string; keys: string[] }> = [
  { symbol: 'NIFTY', keys: ['nifty 50', 'nifty50', 'nifty'] },
  { symbol: 'BANKNIFTY', keys: ['bank nifty', 'banknifty', 'nifty bank'] },
  { symbol: 'RELIANCE', keys: ['reliance'] },
  { symbol: 'HDFCBANK', keys: ['hdfc bank', 'hdfcbank', 'hdfc'] },
  { symbol: 'TCS', keys: ['tcs', 'tata consultancy'] },
  { symbol: 'SBIN', keys: ['sbin', 'state bank'] },
  { symbol: 'INFY', keys: ['infy', 'infosys'] },
  { symbol: 'GOLD', keys: ['gold', 'xau'] },
  { symbol: 'SILVER', keys: ['silver', 'xag'] },
  { symbol: 'CRUDEOIL', keys: ['crude oil', 'crudeoil', 'crude', 'oil'] },
  { symbol: 'NATURALGAS', keys: ['natural gas', 'naturalgas', 'natgas'] },
  { symbol: 'COPPER', keys: ['copper'] },
  { symbol: 'ZINC', keys: ['zinc'] },
  { symbol: 'ALUMINIUM', keys: ['aluminium', 'aluminum'] },
  { symbol: 'LEAD', keys: ['mcx lead', 'lead'] },
  { symbol: 'NICKEL', keys: ['nickel'] },
]

const BOARD_CODES = TRADING_VIEW_SYMBOLS.map((item) => item.symbol).join('|')

export function tradingViewTicker(symbol: string) {
  return TRADING_VIEW_SYMBOLS.find((item) => item.symbol === symbol)?.ticker
}

export function tradingViewSymbol(symbol: string) {
  return TRADING_VIEW_SYMBOLS.find((item) => item.symbol.toUpperCase() === symbol.toUpperCase())
}

function hasAlias(haystack: string, key: string) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, 'i').test(haystack)
}

export function symbolsInText(text: string, selected?: string) {
  const found = new Set<string>()
  const selectedCode = selected?.toUpperCase()
  if (selectedCode && (tradingViewSymbol(selectedCode) || SYMBOL_ALIASES.some((item) => item.symbol === selectedCode))) {
    found.add(selectedCode)
  }
  const haystack = text.toLowerCase()
  for (const item of SYMBOL_ALIASES) {
    if (item.keys.some((key) => hasAlias(haystack, key))) found.add(item.symbol)
  }
  if (found.has('NIFTY') && found.has('BANKNIFTY') && /\bbank nifty\b|\bnifty bank\b|\bbanknifty\b/i.test(text)) {
    const withoutBank = haystack.replace(/\bbank nifty\b|\bnifty bank\b|\bbanknifty\b/g, ' ')
    if (!/\bnifty\b/.test(withoutBank)) found.delete('NIFTY')
  }
  const upper = text.toUpperCase()
  for (const match of upper.match(new RegExp(`\\b(?:${BOARD_CODES})\\b`, 'g')) ?? []) found.add(match)
  return [...found]
}
