export interface LiveQuote {
  symbol: string
  ticker: string
  close: number
  change: number
  high: number
  low: number
  bid: number
  ask: number
}

const INDEXES = new Set(['NIFTY', 'BANKNIFTY'])

export function formatLiveQuote(symbol: string, value: number) {
  const upper = symbol.toUpperCase()
  if (INDEXES.has(upper)) return value.toFixed(2)
  if (upper === 'NATURALGAS' || upper === 'CRUDEOIL') return value.toFixed(2)
  if (value >= 1000) return value.toFixed(1)
  return value.toFixed(2)
}

export const tradingViewService = {
  async quotes(symbols?: string[]) {
    const query = symbols?.length ? `?symbols=${encodeURIComponent(symbols.join(','))}` : ''
    const response = await fetch(`${import.meta.env.BASE_URL.replace(/\/$/, '')}/api/engine/quotes${query}`, {
      signal: AbortSignal.timeout(4000),
    })
    if (!response.ok) return [] as LiveQuote[]
    const payload = (await response.json()) as { quotes?: LiveQuote[] }
    return (payload.quotes ?? []).filter((item) => Number.isFinite(item.close) && item.close > 0)
  },
}
