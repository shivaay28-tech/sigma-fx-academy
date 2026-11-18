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
  const upper = text.toUpperCase()
  for (const match of upper.match(new RegExp(`\\b(?:${BOARD_CODES})\\b`, 'g')) ?? []) found.add(match)
  if (found.has('NIFTY') && found.has('BANKNIFTY') && /\bbank nifty\b|\bnifty bank\b|\bbanknifty\b/i.test(text)) {
    const withoutBank = haystack.replace(/\bbank nifty\b|\bnifty bank\b|\bbanknifty\b/g, ' ')
    if (!/\bnifty\b/.test(withoutBank)) found.delete('NIFTY')
  }
  return [...found]
}

const GENERAL_MARKET = /\b(?:mcx|commodit(?:y|ies)|nse|bse|stocks?|shares?|equit(?:y|ies)|metals?|energy)\b/i

const NOT_TICKERS = new Set([
  'MCX', 'NSE', 'BSE', 'IST', 'USD', 'INR', 'RSI', 'MACD', 'EMA', 'SMA', 'ATR', 'VWAP', 'OHLC', 'SL', 'TP',
  'SL1', 'SL2', 'TP1', 'TP2', 'H1', 'H4', 'D1', 'W1', 'M1', 'M5', 'M15', 'M30', '1H', '4H', '1D', '1W',
  'AI', 'OK', 'IPO', 'FII', 'DII', 'RBI', 'GDP', 'CPI', 'FED', 'FOMC', 'NFP', 'ECB', 'PDF', 'FAQ', 'I', 'A',
  'MT5', 'CFD', 'IB', 'LTP', 'YTD', 'EOD', 'FNO', 'FO', 'ETF', 'THE', 'AND', 'FOR', 'BUY', 'SELL',
])

/** ALL-CAPS words the user typed that may be NSE tickers (e.g. TATAMOTORS). Only treated as symbols when a live quote comes back. */
export function tickerCandidates(text: string) {
  const known = new Set(TRADING_VIEW_SYMBOLS.map((item) => item.symbol as string))
  const words = text.match(/\b[A-Z][A-Z0-9&-]{1,14}\b/g) ?? []
  return [...new Set(words)].filter((word) => !NOT_TICKERS.has(word) && !known.has(word)).slice(0, 3)
}

export type FocusSource = 'question' | 'follow-up' | 'selected' | 'general'

/**
 * Decide which instrument(s) an engine answer is about.
 * What the user typed always wins over the bottom-bar selection.
 */
export function resolveFocus(input: { prompt: string; selected?: string; prior?: string; followUp?: boolean }): {
  symbols: string[]
  source: FocusSource
} {
  const named = symbolsInText(input.prompt)
  if (named.length) return { symbols: named, source: 'question' }
  if (input.followUp) {
    const previous = input.prior ? symbolsInText(input.prior) : []
    if (previous.length) return { symbols: previous, source: 'follow-up' }
    if (input.selected) return { symbols: [input.selected.toUpperCase()], source: 'follow-up' }
  }
  if (GENERAL_MARKET.test(input.prompt)) return { symbols: [], source: 'general' }
  return input.selected ? { symbols: [input.selected.toUpperCase()], source: 'selected' } : { symbols: [], source: 'general' }
}

export interface TimeReference {
  label: string
  /** true when the latest TradingView quote (today's session) answers it */
  live: boolean
}

const WEEKDAYS = '(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)'

/** Time words in a question. Past periods need history we do not load, so they are flagged as not live. */
export function timeReference(text: string): TimeReference | undefined {
  const t = text.toLowerCase()
  const past: Array<[RegExp, (match: RegExpMatchArray) => string]> = [
    [/\byesterday\b/, () => 'yesterday'],
    [new RegExp(`\\b(?:last|previous|on)\\s+${WEEKDAYS}\\b`), (m) => m[0]],
    [/\b(?:last|past|previous)\s+(\d{1,3})\s+(day|week|month|year)s?\b/, (m) => m[0]],
    [/\b(?:last|previous|past)\s+(?:week|month|quarter|year)\b/, (m) => m[0]],
    [/\bthis\s+(?:week|month|quarter|year)\b/, (m) => m[0]],
    [/\b(?:ytd|year to date|month to date|week to date)\b/, (m) => m[0]],
    [/\b\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/, (m) => m[0]],
  ]
  for (const [pattern, label] of past) {
    const match = t.match(pattern)
    if (match) return { label: label(match), live: false }
  }
  if (/\b(?:today'?s?|now|right now|current(?:ly)?|live|latest|this session)\b/.test(t.replace(/’/g, "'"))) {
    return { label: 'today', live: true }
  }
  return undefined
}

export function formatQuoteTime(at?: number) {
  if (!at) return ''
  return `${new Date(at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata', hour12: false })} IST`
}
