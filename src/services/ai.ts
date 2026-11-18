import {
  CFD_NOTE,
  FUNDAMENTALS_NOTE,
  INSTRUMENT_STUDY,
  MT5_NOTE,
  ORDER_NOTE,
  PAIRS_NOTE,
  PSYCH_NOTE,
  RISK_NOTE,
  SESSION_NOTE,
  TA_NOTE,
  TOPIC_COURSES,
  instrumentName,
  instrumentSession,
  sessionClock,
  weekdayLabel,
} from '@/data/engineKnowledge'
import type { AiAnswerLength, AiAttachment } from '@/types'
import { APP_NAME, DISCLAIMER, ENGINE_NAME } from '@/utils/constants'
import { formatQuoteTime, resolveFocus, symbolsInText, timeReference, TRADING_VIEW_SYMBOLS } from '@/data/tradingView'
import { formatLiveQuote, type LiveQuote } from '@/services/tradingView'
import { inspectAttachments, type ChartRead } from '@/utils/chartRead'

const SYSTEM_RULES = `You are ${ENGINE_NAME}, the study assistant for ${APP_NAME}. You teach how NSE cash and MCX commodity markets work: trend, key levels, sessions in IST, and risk. You are educational only. You never tell the user to buy or sell and never give trade calls or signals.

Which instrument to answer about:
- The message states "Answer about: ...". Answer about exactly those instruments. The instrument the user typed always wins over any instrument selected in the app.
- If it says the question is general (for example "mcx" or "commodities"), answer the general question. Do not switch to an index or a share the user did not ask about.

Live data:
- Use only the TradingView quotes listed in the message. Each has a last price, today's change, today's high and low, and the time it was fetched. Quote that time when you use a number.
- If the user asks about a past period (yesterday, last week, last month, a past date) and no data for that period is in the message, say plainly that the engine only has today's live quote and does not have figures for that period. Never estimate, recall or invent past prices.
- If no quote is listed for the instrument, say the live price did not load. Do not invent one.

How to answer a market question:
1. One line: what the instrument is and how it is quoted (points for NIFTY/BANKNIFTY, rupees per share for NSE shares, rupees per contract unit for MCX futures).
2. What today's quote shows: last price, change, and where it sits in today's high–low range.
3. A worked study example, clearly labelled "Study example — not a trade instruction": the direction being studied, the reference price (the TradingView close, never bid or ask), where the idea would be proved wrong (an example invalidation level), and the next level to watch. Typical study distances: Nifty about 40 / 80 points, Bank Nifty about 80 / 150 points, gold about 150 / 300 rupees, silver about 400 / 800 rupees, crude about 40 / 80 rupees.
4. One short note on the session (NSE about 09:15–15:30 IST, MCX about 09:00–23:30 IST) and what usually moves it.
5. One line on risk and position size.
If no timeframe was given, study the daily picture from today's quote rather than asking for one.

When a chart image is attached, the symbol, timeframe and last price printed on the chart define the study. Describe the visible pattern as educational pattern analysis, say that automated chart reading can be wrong, and do not mention other symbols.
Never use words like "call", "signal", "buy now" or "sell now". Results are not guaranteed. Close with one short risk reminder.`

export type EngineTopic =
  | 'brief'
  | 'chart'
  | 'instrument'
  | 'mt5'
  | 'risk'
  | 'orders'
  | 'sessions'
  | 'pairs'
  | 'psychology'
  | 'fundamentals'
  | 'ta'
  | 'signals'
  | 'cfd'
  | 'ib'

interface AskInput {
  prompt: string
  instrument?: string
  attachments: AiAttachment[]
  answerLength: AiAnswerLength
  history: Array<{ role: 'user' | 'assistant'; content: string }>
  liveQuotes?: LiveQuote[]
  /** Instruments resolved from the question; overrides the bottom-bar selection. */
  focusSymbols?: string[]
  apiKey?: string
  baseUrl?: string
  model?: string
}

const TOPIC_KEYS: Array<{ topic: EngineTopic; keys: string[] }> = [
  { topic: 'brief', keys: ['brief', 'watchlist', 'daily study', "today's educational", "today's market", 'today briefing'] },
  { topic: 'chart', keys: ['chart', 'screenshot', 'candle', 'candlestick', 'structure', 'support', 'resistance', 'trend', 'breakout'] },
  { topic: 'mt5', keys: ['mt5', 'metatrader', 'market watch', 'ticket', 'journal', 'toolbox'] },
  { topic: 'risk', keys: ['leverage', 'margin', 'lot', 'lots', 'pip', 'pips', 'position size', 'stop out', 'risk'] },
  { topic: 'orders', keys: ['order', 'limit', 'pending', 'market order', 'buy stop', 'sell stop'] },
  { topic: 'sessions', keys: ['session', 'london', 'new york', 'tokyo', 'overlap', 'liquidity', 'nse', 'mcx', 'ist'] },
  { topic: 'pairs', keys: ['pair', 'quote', 'base currency', 'spread', 'bid', 'ask', 'major', 'cross'] },
  { topic: 'psychology', keys: ['psychology', 'emotion', 'discipline', 'fomo', 'revenge'] },
  { topic: 'fundamentals', keys: ['nfp', 'cpi', 'fed', 'ecb', 'boe', 'fomc', 'news', 'fundamental', 'interest rate'] },
  { topic: 'ta', keys: ['rsi', 'macd', 'ema', 'sma', 'moving average', 'fibonacci', 'indicator', 'price action'] },
  { topic: 'signals', keys: ['buy', 'sell', 'entry', 'take profit', 'take-profit', 'stop loss', 'stop-loss', 'tp', 'sl', 'signal', 'call', 'trade', 'trading', 'should i'] },
  { topic: 'cfd', keys: ['cfd', 'contract for difference', 'overnight', 'swap'] },
  { topic: 'ib', keys: ['ib', 'introducing broker', 'partner'] },
]

function normalize(text: string) {
  return text.toLowerCase().replace(/[’']/g, "'")
}

function detectSymbols(text: string, selected?: string) {
  return symbolsInText(text, selected)
}

function detectTopics(text: string, hasMedia: boolean): EngineTopic[] {
  const haystack = normalize(text)
  const hits = new Set<EngineTopic>()
  if (hasMedia) hits.add('chart')
  for (const item of TOPIC_KEYS) {
    if (item.keys.some((key) => haystack.includes(key))) hits.add(item.topic)
  }
  return [...hits]
}

function previousUserText(history: AskInput['history'], prompt: string) {
  const users = history.filter((item) => item.role === 'user').map((item) => item.content)
  const last = users[users.length - 1]
  if (last === prompt) return users[users.length - 2] ?? ''
  return last ?? ''
}

function chartImageSetsSymbol(input: AskInput) {
  const hasImage = input.attachments.some((item) => item.kind === 'image')
  return hasImage && symbolsInText(input.prompt).length === 0
}

export function isFollowUp(prompt: string, history: AskInput['history']) {
  return prompt.trim().length < 48 && history.some((item) => item.role === 'assistant')
}

function focusFor(input: AskInput) {
  if (input.focusSymbols) return input.focusSymbols
  return resolveFocus({
    prompt: input.prompt,
    selected: input.instrument,
    prior: previousUserText(input.history, input.prompt),
    followUp: isFollowUp(input.prompt, input.history),
  }).symbols
}

function parseQuestion(input: AskInput) {
  const prior = previousUserText(input.history, input.prompt)
  const hasImage = input.attachments.some((item) => item.kind === 'image')
  const chartLabel = chartImageSetsSymbol(input)
  const symbols = hasImage ? detectSymbols(input.prompt) : [...focusFor(input)]
  let topics = detectTopics(input.prompt, input.attachments.length > 0)
  const shortFollowUp = isFollowUp(input.prompt, input.history)
  if (!chartLabel && (topics.length === 0 || shortFollowUp)) {
    const previous = detectTopics(prior, false)
    for (const topic of previous) topics.push(topic)
  }
  topics = [...new Set(topics)]
  if (topics.length === 0 && symbols.length) topics.push('instrument')
  if (topics.length === 0) topics.push('brief')
  return { symbols, topics, followUp: shortFollowUp }
}

const TIMEFRAME_PATTERN =
  /\b(?:m1|m5|m15|m30|h1|h4|d1|w1|1m|5m|15m|30m|1h|4h|daily|weekly|\d+\s*(?:minute|hour)s?)\b/i

const LEVEL_DISTANCE: Record<string, { stop: number; target: number }> = {
  NIFTY: { stop: 40, target: 80 },
  BANKNIFTY: { stop: 80, target: 150 },
  GOLD: { stop: 150, target: 300 },
  SILVER: { stop: 400, target: 800 },
  CRUDEOIL: { stop: 40, target: 80 },
  NATURALGAS: { stop: 3, target: 6 },
  COPPER: { stop: 8, target: 15 },
}

function detectTimeframe(text: string) {
  return text.match(TIMEFRAME_PATTERN)?.[0]
}

function detectPrice(text: string) {
  const matches = text.match(/\b\d{1,6}(?:\.\d{1,5})?\b/g) ?? []
  const quotes = matches
    .map((item) => Number(item))
    .filter((value) => value > 0 && !(Number.isInteger(value) && value >= 1900 && value <= 2100))
    .filter((value) => !Number.isInteger(value) || value >= 20)
  return quotes.at(-1)
}

function detectBias(text: string, slope?: ChartRead['slope'], live?: LiveQuote): 'buy' | 'sell' {
  const haystack = normalize(text)
  const sell = /\b(sell|short|bearish)\b/.test(haystack)
  const buy = /\b(buy|long|bullish)\b/.test(haystack)
  if (sell && !buy) return 'sell'
  if (buy && !sell) return 'buy'
  if (slope === 'lower to the right') return 'sell'
  if (slope === 'higher to the right') return 'buy'
  if (live) return live.change < 0 ? 'sell' : 'buy'
  return 'buy'
}

function detectChartBias(text: string): 'buy' | 'sell' | undefined {
  const sell = /\b(sell|short|bearish)\b/i.test(text)
  const buy = /\b(buy|long|bullish)\b/i.test(text)
  if (sell && !buy) return 'sell'
  if (buy && !sell) return 'buy'
  return undefined
}

function normalizeTimeframe(text: string) {
  const upper = text.toUpperCase()
  const rules: Array<[RegExp, string]> = [
    [/\b(?:1D|D1|DAILY)\b/, '1D'],
    [/\b(?:1W|W1|WEEKLY)\b/, '1W'],
    [/\b(?:4H|H4)\b/, '4H'],
    [/\b(?:1H|H1)\b/, '1H'],
    [/\b(?:30M|M30)\b/, '30m'],
    [/\b(?:15M|M15)\b/, '15m'],
    [/\b(?:5M|M5)\b/, '5m'],
    [/\b(?:1M|M1)\b/, '1m'],
    [/\b240\b/, '4H'],
    [/\b60\b/, '1H'],
    [/\b30\b/, '30m'],
    [/\b15\b/, '15m'],
    [/\b5\b/, '5m'],
    [/(^|[^\d.])1(?![\d.])/, '1m'],
  ]
  for (const [pattern, label] of rules) {
    if (pattern.test(upper)) return label
  }
  return undefined
}

export interface ChartLabel {
  symbol?: string
  timeframe?: string
  bias?: 'buy' | 'sell'
  printedPrice?: number
}

function symbolFromText(text: string) {
  const direct = symbolsInText(text)[0]
  if (direct) return direct
  const compact = text.toUpperCase().replace(/[^A-Z0-9]/g, '')
  let best: { symbol: string; index: number } | undefined
  for (const item of TRADING_VIEW_SYMBOLS) {
    const index = compact.indexOf(item.symbol)
    if (index >= 0 && (best === undefined || index < best.index)) best = { symbol: item.symbol, index }
  }
  if (best) return best.symbol
  if (compact.includes('BANKNIFTY') || compact.includes('NIFTYBANK')) return 'BANKNIFTY'
  if (compact.includes('NIFTY')) return 'NIFTY'
  if (compact.includes('XAU') || compact.includes('GOLD')) return 'GOLD'
  if (compact.includes('XAG') || compact.includes('SILVER')) return 'SILVER'
  if (compact.includes('CRUDE')) return 'CRUDEOIL'
  return undefined
}

function printedClose(text: string) {
  const flat = text.replace(/,/g, '')
  const labeled = flat.match(/C\s*(\d{3,5}\.\d{2,3})/i)
  const value = labeled ? Number(labeled[1]) : undefined
  return value && value > 0 ? value : undefined
}

function parseChartLabel(text: string): ChartLabel | undefined {
  const lines = text.split('\n').map((item) => item.trim()).filter(Boolean)
  if (!lines.length) return undefined
  const symbolLine = lines.find((line) => symbolFromText(line)) ?? text
  const symbol = symbolFromText(symbolLine) ?? symbolFromText(text)
  const timeframe = normalizeTimeframe(symbolLine) ?? normalizeTimeframe(text)
  const bias = detectChartBias(symbolLine) ?? detectChartBias(text)
  const printedPrice = printedClose(symbolLine) ?? printedClose(text)
  if (!symbol && !timeframe && !bias && printedPrice === undefined) return undefined
  return { symbol, timeframe, bias, printedPrice }
}

export interface ChartLevelInput {
  symbol: string
  timeframe?: string
  bias?: 'buy' | 'sell'
  quote?: LiveQuote
  rateSource?: 'live' | 'chart'
}

export function formatChartLevels(input: ChartLevelInput) {
  const title = [input.symbol, input.timeframe].filter(Boolean).join(' ')
  const bias = input.bias ?? 'sell'
  if (!input.quote || !(input.quote.close > 0)) {
    return {
      priced: false,
      text: [
        heading(title || input.symbol),
        `The live TradingView rate for ${input.symbol} did not load, so no entry, stops, or targets were set.`,
      ].join('\n\n'),
    }
  }
  const price = input.quote.close
  const distance = levelDistance(input.symbol, price)
  const direction = bias === 'buy' ? 1 : -1
  const study = INSTRUMENT_STUDY[input.symbol]
  const reason = study
    ? `${study.whatMovesIt} ${instrumentSession(input.symbol) ?? ''}`.trim()
    : 'Stops sit against the bias. Targets sit with the bias.'
  const time = formatQuoteTime(input.quote.fetchedAt)
  const rate =
    input.rateSource === 'chart'
      ? `Reference price: ${formatLevel(input.symbol, price)} (the close printed on your chart).`
      : `Reference price: ${formatLevel(input.symbol, price)}, change ${input.quote.change.toFixed(2)}% (source: TradingView${time ? `, fetched ${time}` : ''}).`
  const direction_ = bias === 'buy' ? 'Upward' : 'Downward'
  return {
    priced: true,
    text: [
      heading(`${title || input.symbol} — chart study`),
      `The chart reads as sloping ${bias === 'buy' ? 'higher' : 'lower'} to the right. Automated chart reading can be wrong, so check it against your own chart.`,
      heading('Study example — not a trade instruction'),
      bullets([
        rate,
        `Direction being studied: ${direction_}`,
        `Idea proved wrong near: ${formatLevel(input.symbol, price - direction * distance.stop)} (wider: ${formatLevel(input.symbol, price - direction * distance.stop * 2)})`,
        `Next levels to watch: ${formatLevel(input.symbol, price + direction * distance.target)}, then ${formatLevel(input.symbol, price + direction * distance.target * 2)}`,
      ]),
      `These levels use typical study distances for ${input.symbol}, not a forecast. ${reason}`,
      DISCLAIMER,
    ].join('\n\n'),
  }
}

function formatLevel(symbol: string, value: number) {
  return formatLiveQuote(symbol, value)
}

function levelDistance(symbol: string, price: number) {
  const known = LEVEL_DISTANCE[symbol]
  if (known) return known
  return { stop: price * 0.004, target: price * 0.008 }
}

function heading(title: string) {
  return `**${title}**`
}

function bullets(items: string[]) {
  return items.map((item) => `- ${item}`).join('\n')
}

function courseLine(topics: EngineTopic[]) {
  const picked = topics
    .map((topic) => TOPIC_COURSES[topic])
    .filter((item): item is { title: string; slug: string } => Boolean(item))
  const unique = picked.filter((item, index) => picked.findIndex((row) => row?.slug === item?.slug) === index)
  const first = unique[0]
  const second = unique[1]
  if (!first) return 'Suggested next lesson: Introduction to MCX.'
  if (second) return `Suggested next lessons: ${first.title}, then ${second.title}.`
  return `Suggested next lesson: ${first.title}.`
}

function instrumentSection(symbol: string, brief: boolean) {
  const study = INSTRUMENT_STUDY[symbol]
  const name = instrumentName(symbol)
  const session = instrumentSession(symbol)
  if (!study) return `${heading(`${symbol} study note`)}\n${name} is the product in focus.`
  const parts = [
    heading(`${symbol} — ${name}`),
    study.product,
    brief ? null : study.howQuoted,
    study.whatMovesIt,
    session,
    study.studyFocus,
  ].filter(Boolean)
  return parts.join('\n\n')
}

function chartSection(reads: ChartRead[], symbols: string[]) {
  if (!reads.length) return ''
  const symbolText = symbols.length ? ` on ${symbols.join(', ')}` : ''
  const lines = reads.map((read, index) => {
    const label = reads.length > 1 ? `Attachment ${index + 1} (${read.source})` : `Attached ${read.source}`
    return `${label}: ${read.note}`
  })
  return [
    heading(`What the ${reads[0]?.source === 'video' ? 'clip' : 'chart'} shows`),
    ...lines,
    heading('How to read the picture'),
    bullets([
      `A series that is higher to the right is an upward structure. Lower to the right is a downward structure${symbolText}.`,
      'The idea is proved wrong beyond the last obvious swing against that direction. The next level to watch is the next swing in the direction studied.',
      'Automated chart reading can be wrong. Treat this as educational pattern analysis and check it against your own chart.',
    ]),
  ].join('\n\n')
}

function topicSection(topic: EngineTopic, brief: boolean) {
  if (topic === 'signals') return ''
  const body: Partial<Record<EngineTopic, string>> = {
    orders: `${heading('Order types')}\n${ORDER_NOTE}`,
    risk: `${heading('Risk, size and leverage')}\n${RISK_NOTE}`,
    mt5: `${heading('The trading screen')}\n${MT5_NOTE}`,
    pairs: `${heading('Quotes')}\n${PAIRS_NOTE}`,
    sessions: `${heading('Sessions and liquidity')}\n${SESSION_NOTE}`,
    ta: `${heading('Chart language')}\n${TA_NOTE}`,
    fundamentals: `${heading('Calendar literacy')}\n${FUNDAMENTALS_NOTE}`,
    psychology: `${heading('Process over impulse')}\n${PSYCH_NOTE}`,
    cfd: `${heading('NSE and MCX')}\n${CFD_NOTE}`,
    ib: `${heading('IB education')}\nIntroducing-broker work is about explaining products, risk, and account opening clearly. It is not about promising results or circulating signals. If you support clients, send them to structured lessons rather than a screenshot with arrows.`,
  }
  const text = body[topic]
  if (!text) return ''
  if (brief) return text.split('\n\n')[0] ?? text
  return text
}

function briefSection(symbols: string[], quotes: LiveQuote[] = []) {
  const now = new Date()
  const clock = sessionClock(now)
  const watch = symbols.length ? symbols : ['NIFTY', 'BANKNIFTY', 'GOLD']
  const rows = watch
    .map((symbol) => quotes.find((item) => item.symbol === symbol && item.close > 0))
    .filter((item): item is LiveQuote => Boolean(item))
  const updated = formatQuoteTime(Math.max(0, ...rows.map((item) => item.fetchedAt ?? 0)) || undefined)
  return [
    heading(`Today's study brief — ${weekdayLabel(now)}`),
    `IST clock: ${clock.summary}`,
    rows.length
      ? `${heading(`Live snapshot${updated ? ` (TradingView, updated ${updated})` : ' (TradingView)'}`)}\n${bullets(
          rows.map(
            (item) =>
              `${item.symbol}: ${formatLevel(item.symbol, item.close)} (${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%), today's range ${formatLevel(item.symbol, item.low)} – ${formatLevel(item.symbol, item.high)}`,
          ),
        )}`
      : 'Live prices did not load, so no figures are shown. The engine does not invent prices.',
    heading('A practical study loop (no orders required)'),
    bullets([
      `Write three names on a pad: ${watch.join(', ')}. For each, note whether it is an NSE cash index, an NSE share, or an MCX future, and the next print that can affect it.`,
      'Open one timeframe only (H1 or H4 is enough for a daily worksheet). Label last obvious swing high and low.',
      'Check whether you are on a demo or live account. If you are studying, demo is the right classroom.',
      'Decide in writing whether today is a study day. Sitting out is a complete outcome.',
    ]),
    heading('Session reminder'),
    SESSION_NOTE,
  ].join('\n\n')
}

function answerLead(prompt: string, symbols: string[], followUp: boolean) {
  const asked = prompt.replace(/\s+/g, ' ').trim()
  const about = symbols.length ? ` — focusing on ${symbols.join(', ')}` : ''
  if (followUp) return `Follow-up received${about}.`
  return `You asked: “${asked}”${about}.`
}

function marketQuestion(topics: EngineTopic[], symbols: string[]) {
  return symbols.length > 0 || topics.some((topic) => ['signals', 'instrument', 'brief', 'chart', 'ta'].includes(topic))
}

function quoteFor(input: AskInput, symbol: string) {
  return input.liveQuotes?.find((item) => item.symbol === symbol && Number.isFinite(item.close) && item.close > 0)
}

function oneCall(input: AskInput, symbol: string | undefined, context: string, reads: ChartRead[], typedPrice?: number) {
  const timeframe = detectTimeframe(context)
  const live = symbol ? quoteFor(input, symbol) : undefined
  const price = typedPrice ?? live?.close
  const missing = [
    symbol ? null : 'the market (for example NIFTY or GOLD)',
    price !== undefined ? null : 'the last price — the TradingView quote did not load for this symbol',
  ].filter((item): item is string => Boolean(item))

  if (!symbol || price === undefined) {
    return [
      heading(symbol ? `${symbol} — live price not available` : 'Which market?'),
      symbol
        ? 'The TradingView quote did not load for this symbol, so no levels are shown. The engine does not invent prices. Try again in a moment.'
        : 'Name the market you want to study, for example gold, crude oil, Nifty or a share such as RELIANCE.',
      missing.length > 1 ? bullets(missing) : '',
    ]
      .filter(Boolean)
      .join('\n\n')
  }

  const studyTimeframe = timeframe ?? 'daily'
  const bias = detectBias(context, reads[0]?.slope, live)
  const distance = levelDistance(symbol, price)
  const direction = bias === 'buy' ? 1 : -1
  const study = INSTRUMENT_STUDY[symbol]
  const reason = study
    ? `${study.whatMovesIt} ${instrumentSession(symbol) ?? ''}`.trim()
    : 'The invalidation sits beyond a small swing and the next level is the next measured move in the studied direction.'
  const time = live ? formatQuoteTime(live.fetchedAt) : ''
  const snapshot =
    typedPrice === undefined && live
      ? bullets([
          `Last price: ${formatLevel(symbol, live.close)} (${live.change >= 0 ? '+' : ''}${live.change.toFixed(2)}% today)`,
          `Today's range: ${formatLevel(symbol, live.low)} – ${formatLevel(symbol, live.high)}`,
          `Source: TradingView ${live.ticker}${time ? `, fetched ${time}` : ''}`,
        ])
      : `Reference price: ${formatLevel(symbol, price)} (the price you typed).`

  return [
    heading(`${symbol} — ${instrumentName(symbol)}`),
    snapshot,
    heading(`Study example (${studyTimeframe}) — not a trade instruction`),
    bullets([
      `Direction being studied: ${bias === 'buy' ? 'upward' : 'downward'}${live && typedPrice === undefined ? ` (today's change is ${live.change >= 0 ? 'positive' : 'negative'})` : ''}`,
      `Reference price: ${formatLevel(symbol, price)}`,
      `Idea proved wrong near: ${formatLevel(symbol, price - direction * distance.stop)}`,
      `Next level to watch: ${formatLevel(symbol, price + direction * distance.target)}`,
    ]),
    `${reason}${timeframe ? '' : ' Add a timeframe such as H1 or H4 to study a shorter window.'}`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

function timeSection(prompt: string) {
  const ref = timeReference(prompt)
  if (!ref || ref.live) return ''
  return `${heading(`About “${ref.label}”`)}\nThe engine only has today's live TradingView quote. It does not have verified figures for ${ref.label}, so it will not quote them. Open the chart on TradingView or your broker platform for that period.`
}

function callSection(input: AskInput, symbols: string[], reads: ChartRead[]) {
  const context = `${input.prompt} ${previousUserText(input.history, input.prompt)}`
  const targets = symbols.slice(0, 3)
  const typedPrice = targets.length === 1 ? detectPrice(context) : undefined
  if (!targets.length) return oneCall(input, undefined, context, reads, typedPrice)
  return targets.map((symbol) => oneCall(input, symbol, context, reads, typedPrice)).join('\n\n')
}

async function composeReply(input: AskInput) {
  const reads = await inspectAttachments(input.attachments)
  const parsed = parseQuestion(input)
  const brief = input.answerLength === 'brief'
  const sections: string[] = [answerLead(input.prompt, parsed.symbols, parsed.followUp)]

  sections.push(timeSection(input.prompt))

  const isBrief = parsed.topics.includes('brief') && !reads.length
  if (!isBrief && marketQuestion(parsed.topics, parsed.symbols)) {
    sections.push(callSection(input, parsed.symbols, reads))
  }

  if (isBrief) {
    sections.push(briefSection(parsed.symbols, input.liveQuotes))
  }

  if (reads.length) sections.push(chartSection(reads, parsed.symbols))

  const uniqueSymbols = parsed.symbols.slice(0, brief ? 1 : 3)
  for (const symbol of uniqueSymbols) {
    sections.push(instrumentSection(symbol, brief))
  }

  const topicOrder: EngineTopic[] = ['signals', 'orders', 'risk', 'mt5', 'pairs', 'sessions', 'ta', 'fundamentals', 'psychology', 'cfd', 'ib']
  const used = new Set<EngineTopic>()
  for (const topic of topicOrder) {
    if (!parsed.topics.includes(topic)) continue
    if (topic === 'brief' || topic === 'chart' || topic === 'instrument') continue
    const block = topicSection(topic, brief)
    if (block) {
      sections.push(block)
      used.add(topic)
    }
    if (brief && used.size >= 1) break
    if (!brief && used.size >= 3) break
  }

  if (!reads.length && uniqueSymbols.length === 0 && used.size === 0 && !parsed.topics.includes('brief')) {
    sections.push(
      `${heading('How to study a market question')}\nName a market (for example gold, crude oil, Nifty or RELIANCE) and, if you like, a timeframe such as H1. The engine reads the live TradingView price and explains the trend, key levels and risk. Results are not guaranteed.`,
    )
  }

  if (!brief) sections.push(courseLine(parsed.topics))
  sections.push(DISCLAIMER)
  return sections.filter(Boolean).join('\n\n')
}

function historyWithoutDuplicate(input: AskInput) {
  const history = input.history.slice(-18)
  const last = history[history.length - 1]
  if (last?.role === 'user' && last.content === input.prompt) return history.slice(0, -1)
  return history
}

function quoteBlock(quotes: LiveQuote[] | undefined, focus: string[]) {
  if (!quotes?.length) return ''
  const picked = focus.length ? quotes.filter((item) => focus.includes(item.symbol)) : quotes.slice(0, 6)
  if (!picked.length) return `No TradingView quote loaded for ${focus.join(', ')}. Do not invent a price.`
  const lines = picked.map((item) => {
    const time = formatQuoteTime(item.fetchedAt)
    return `${item.symbol} (${item.ticker}) LAST ${item.close}, change ${item.change.toFixed(2)}% today, today's high ${item.high}, low ${item.low}${time ? `, fetched ${time}` : ''}. Bid ${item.bid} and ask ${item.ask} are not the reference price.`
  })
  return `TradingView live quotes (today's session only — no historical data is provided):\n${lines.join('\n')}`
}

function focusLine(input: AskInput, focus: string[]) {
  if (focus.length) {
    const named = symbolsInText(input.prompt)
    const why = named.length ? 'the user named it in the question' : 'it is the instrument the user is studying'
    return `Answer about: ${focus.join(', ')} (${why}). Do not answer about any other instrument${input.instrument && !focus.includes(input.instrument) ? `, including ${input.instrument} which is only selected in the app` : ''}.`
  }
  return 'The question is general and names no specific instrument. Answer it generally (for example explain MCX or the market asked about). Do not pick an instrument the user did not mention.'
}

function timeLine(prompt: string) {
  const ref = timeReference(prompt)
  if (!ref) return ''
  if (ref.live) return 'The user asks about today. Use the live quotes above and state their fetch time.'
  return `The user asks about "${ref.label}". No data for that period is provided. Say clearly that the engine only has today's live quote and does not have verified figures for ${ref.label}. Do not estimate or recall past prices.`
}

function userContent(input: AskInput, chartNote: string) {
  const images = input.attachments.filter((item) => item.kind === 'image' && item.dataUrl.length < 1_200_000).slice(0, 2)
  const chartLabel = chartImageSetsSymbol(input)
  const focus = focusFor(input)
  const text = [
    chartLabel ? '' : quoteBlock(input.liveQuotes, focus),
    chartLabel
      ? 'A chart image is attached. The symbol, timeframe, and last price printed on the chart are the ones for this answer. That label wins over every other symbol. A gold chart is GOLD. A Nifty chart is NIFTY. Use the price shown on the chart. Do not analyse a currency pair.'
      : focusLine(input, focus),
    chartLabel ? '' : timeLine(input.prompt),
    chartNote,
    input.attachments.some((item) => item.kind === 'video') ? 'A short video clip was attached. Describe the chart pattern it shows as educational pattern analysis and say that automated reading can be wrong.' : '',
    `Answer length: ${input.answerLength === 'brief' ? 'concise' : 'thorough but readable'}.`,
    input.prompt,
  ]
    .filter(Boolean)
    .join('\n')

  if (!images.length) return text
  return [
    { type: 'text', text },
    ...images.map((image) => ({ type: 'image_url' as const, image_url: { url: image.dataUrl } })),
  ]
}

async function readSseStream(
  response: Response,
  onToken: (token: string) => void,
  signal?: AbortSignal,
  onThinking?: (token: string) => void,
) {
  if (!response.body) throw new Error('The live model returned an empty stream.')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let output = ''
  let sawContent = false

  while (true) {
    if (signal?.aborted) break
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const raw of lines) {
      const line = raw.trim()
      if (!line.startsWith('data:')) continue
      const data = line.slice(5).trim()
      if (!data || data === '[DONE]') continue
      try {
        const payload = JSON.parse(data) as {
          choices?: Array<{ delta?: { content?: string | null; reasoning?: string | null } }>
        }
        const delta = payload.choices?.[0]?.delta
        const token = delta?.content
        const thought = delta?.reasoning
        if (thought && !sawContent) onThinking?.(thought)
        if (token) {
          sawContent = true
          output += token
          onToken(token)
        }
      } catch {
        // ignore malformed keep-alive chunks
      }
    }
  }

  if (!sawContent && !output) throw new Error('The live model did not return any text.')
  return output
}

async function streamLocal(input: AskInput, onToken: (token: string) => void) {
  const text = await composeReply(input)
  const parts = text.split(/(\s+)/)
  let output = ''
  for (let index = 0; index < parts.length; index += 5) {
    const chunk = parts.slice(index, index + 5).join('')
    output += chunk
    onToken(chunk)
    await new Promise((resolve) => window.setTimeout(resolve, 6))
  }
  return output
}

function loadHtmlImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not read the chart image.'))
    image.src = src
  })
}

async function chartJpeg(dataUrl: string, cropTop?: number) {
  try {
    const image = await loadHtmlImage(dataUrl)
    const scale = Math.min(1, 1200 / Math.max(image.naturalWidth || image.width, 1))
    const fullWidth = Math.max(1, Math.round((image.naturalWidth || image.width) * scale))
    const fullHeight = Math.max(1, Math.round((image.naturalHeight || image.height) * scale))
    const height = cropTop ? Math.max(48, Math.round(fullHeight * cropTop)) : fullHeight
    const canvas = document.createElement('canvas')
    canvas.width = fullWidth
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return dataUrl
    context.drawImage(image, 0, 0, image.naturalWidth || image.width, ((image.naturalHeight || image.height) * height) / fullHeight, 0, 0, fullWidth, height)
    return canvas.toDataURL('image/jpeg', 0.62)
  } catch {
    return dataUrl
  }
}

async function scaleDataUrl(dataUrl: string, factor: number) {
  try {
    const image = await loadHtmlImage(dataUrl)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round((image.naturalWidth || image.width) * factor))
    canvas.height = Math.max(1, Math.round((image.naturalHeight || image.height) * factor))
    const context = canvas.getContext('2d')
    if (!context) return dataUrl
    context.imageSmoothingEnabled = false
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png')
  } catch {
    return dataUrl
  }
}

type OcrWorker = {
  recognize: (image: string) => Promise<{ data: { text: string } }>
  setParameters: (params: Record<string, string>) => Promise<unknown>
  terminate: () => Promise<unknown>
}

let ocrWorker: Promise<OcrWorker> | undefined

async function readHeaderText(dataUrl: string) {
  const header = await scaleDataUrl(await chartJpeg(dataUrl, 0.36), 2)
  if (!ocrWorker) {
    ocrWorker = import('tesseract.js').then(async ({ createWorker, PSM }) => {
      const worker = await createWorker('eng', 1, {
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/worker.min.js',
      })
      await worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_BLOCK })
      return worker
    })
  }
  const worker = await ocrWorker
  const headerText = (await worker.recognize(header)).data.text
  if (symbolFromText(headerText)) return headerText
  const full = await chartJpeg(dataUrl)
  const fullText = (await worker.recognize(full)).data.text
  return `${headerText}\n${fullText}`
}

async function readServerLabel(image: string, signal?: AbortSignal): Promise<ChartLabel | undefined> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL.replace(/\/$/, '')}/api/engine/chart-label`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
      signal,
    })
    if (!response.ok) return undefined
    const payload = (await response.json()) as { symbol?: string | null; timeframe?: string | null; printedPrice?: number | null }
    if (!payload.symbol) return undefined
    return {
      symbol: payload.symbol,
      timeframe: payload.timeframe ?? undefined,
      printedPrice: payload.printedPrice ?? undefined,
    }
  } catch {
    return undefined
  }
}

export const aiService = {
  isLive() {
    return true
  },

  async readChartLabel(image: AiAttachment, signal?: AbortSignal) {
    if (signal?.aborted) return undefined
    const prepared = await chartJpeg(image.dataUrl)
    let label: ChartLabel | undefined
    try {
      const headerText = await Promise.race([
        readHeaderText(image.dataUrl),
        new Promise<string>((resolve) => window.setTimeout(() => resolve(''), 20000)),
      ])
      label = parseChartLabel(headerText)
    } catch {
      ocrWorker = undefined
    }
    if (!label?.symbol && !signal?.aborted) {
      const serverLabel = await readServerLabel(prepared, signal)
      if (serverLabel?.symbol) label = { ...label, ...serverLabel, symbol: serverLabel.symbol }
    }
    if (!label?.symbol) return undefined
    if (!label.bias) {
      const reads = await inspectAttachments([{ kind: 'image', dataUrl: prepared }])
      const read = reads[0]
      if (read?.slope === 'lower to the right' || (read && read.redShare >= read.greenShare)) label.bias = 'sell'
      else label.bias = 'buy'
    }
    return label
  },

  async ask(input: AskInput) {
    let output = ''
    await this.askStream(input, (token) => {
      output += token
    })
    return output
  },

  async askStream(
    input: AskInput,
    onToken: (token: string) => void,
    signal?: AbortSignal,
    onThinking?: (token: string) => void,
  ) {
    const reads = await inspectAttachments(input.attachments)
    const chartNote = reads.length
      ? chartImageSetsSymbol(input)
        ? `Visible swing on the attached chart: ${reads.map((item) => item.slope).join(', ')}.`
        : reads.map((item) => item.note).join(' ')
      : ''
    const messages = [
      { role: 'system', content: SYSTEM_RULES },
      ...historyWithoutDuplicate(input).map((item) => ({ role: item.role, content: item.content })),
      { role: 'user', content: userContent(input, chartNote) },
    ]

    const attempts: Array<{ url: string; headers: Record<string, string>; body: unknown }> = [
      {
        url: `${import.meta.env.BASE_URL.replace(/\/$/, '')}/api/engine/chat`,
        headers: { 'Content-Type': 'application/json' },
        body: {
          messages,
          apiKey: input.apiKey,
          baseUrl: input.baseUrl,
          model: input.model,
          temperature: 0.55,
        },
      },
      {
        url: 'https://text.pollinations.ai/openai',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer anonymous' },
        body: {
          messages,
          model: input.model || 'openai',
          temperature: 0.55,
          stream: true,
        },
      },
    ]

    const hasImage = input.attachments.some((item) => item.kind === 'image')
    for (const attempt of attempts) {
      try {
        const timeout = AbortSignal.timeout(hasImage ? 55000 : 20000)
        const combined = signal
          ? AbortSignal.any([signal, timeout])
          : timeout
        const response = await fetch(attempt.url, {
          method: 'POST',
          headers: attempt.headers,
          signal: combined,
          body: JSON.stringify(attempt.body),
        })
        if (!response.ok) continue
        const type = response.headers.get('content-type') ?? ''
        if (type.includes('application/json') && !type.includes('event-stream')) {
          const payload = (await response.json()) as {
            choices?: Array<{ message?: { content?: string | null } }>
          }
          const text = payload.choices?.[0]?.message?.content ?? ''
          if (!text.trim()) continue
          onToken(text)
          return text
        }
        return await readSseStream(response, onToken, combined, onThinking)
      } catch {
        if (signal?.aborted) return ''
      }
    }

    return streamLocal(input, onToken)
  },
}
