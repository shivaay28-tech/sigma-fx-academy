import { instruments } from '@/data/instruments'

export const TOPIC_COURSES: Record<string, { title: string; slug: string }> = {
  pairs: { title: 'MCX Gold, Silver, Crude, and Copper', slug: 'mcx-gold-silver-crude-and-copper' },
  sessions: { title: 'Introduction to MCX', slug: 'introduction-to-mcx' },
  orders: { title: 'MCX Orders and Expiry', slug: 'mcx-orders-and-expiry' },
  risk: { title: 'MCX Lots, Margin, and Mark-to-Market', slug: 'mcx-lots-margin-and-mark-to-market' },
  mt5: { title: 'The MCX Trading Screen', slug: 'the-mcx-trading-screen' },
  ta: { title: 'Charts for MCX Commodities', slug: 'charts-for-mcx-commodities' },
  fundamentals: { title: 'What Moves MCX Prices', slug: 'what-moves-mcx-prices' },
  psychology: { title: 'Trading Psychology', slug: 'trading-psychology' },
  cfd: { title: 'NSC and MCX', slug: 'nsc-and-mcx' },
  ib: { title: 'Commodity Participants', slug: 'commodity-participants' },
  chart: { title: 'Charts for MCX Commodities', slug: 'charts-for-mcx-commodities' },
  instrument: { title: 'MCX Gold, Silver, Crude, and Copper', slug: 'mcx-gold-silver-crude-and-copper' },
  brief: { title: 'What Moves MCX Prices', slug: 'what-moves-mcx-prices' },
  signals: { title: 'Risk on MCX Contracts', slug: 'risk-management-fundamentals' },
}

export const INSTRUMENT_STUDY: Record<
  string,
  { product: string; howQuoted: string; whatMovesIt: string; studyFocus: string }
> = {
  NIFTY: {
    product: 'NIFTY is the Nifty 50 cash index on the National Stock Exchange. The board uses the cash index, not a currency pair.',
    howQuoted: 'The quote is in index points. A move of 40 points is a distance on that index. It is not a pip and it is not a rupee per share.',
    whatMovesIt: 'The cash session, RBI and government headlines, and the large weights in the index usually matter more than an overseas forex clock. The useful window is about 09:15–15:30 IST.',
    studyFocus: 'Name the timeframe, then the last swing in points. An example stop of about 40 points and a target of about 80 points is a study distance, not advice.',
  },
  BANKNIFTY: {
    product: 'BANKNIFTY is the Nifty Bank cash index. It follows the large Indian banks on the NSE.',
    howQuoted: 'Quoted in index points. Bank Nifty often moves more points than Nifty on the same day, so a Nifty distance is the wrong ruler.',
    whatMovesIt: 'Bank results, credit headlines, and the NSE cash session. The index is closed after about 15:30 IST even if MCX metals are still trading.',
    studyFocus: 'An example study distance is about 80 points to the stop and about 150 points to the target. Convert that into rupees only after you know the lot you would actually use.',
  },
  RELIANCE: {
    product: 'RELIANCE is the NSE cash share of Reliance Industries.',
    howQuoted: 'Quoted in rupees per share. The lot for delivery is one share; a derivatives lot is a different number on the contract sheet.',
    whatMovesIt: 'Company results, energy headlines, and the broader Nifty session. The cash book is about 09:15–15:30 IST.',
    studyFocus: 'Read the rupee price on the NSE quote. Do not convert it into a forex pair.',
  },
  HDFCBANK: {
    product: 'HDFCBANK is the NSE cash share of HDFC Bank.',
    howQuoted: 'Quoted in rupees per share during the NSE cash session.',
    whatMovesIt: 'Bank results and the same session that moves Bank Nifty.',
    studyFocus: 'Keep the share price in rupees. A move in Bank Nifty is context, not the same quote.',
  },
  TCS: {
    product: 'TCS is the NSE cash share of Tata Consultancy Services.',
    howQuoted: 'Quoted in rupees per share.',
    whatMovesIt: 'Quarterly results and the rupee often sit next to this chart. The session is NSE cash hours.',
    studyFocus: 'Use the NSE close as the price. Do not describe the move in pips.',
  },
  SBIN: {
    product: 'SBIN is the NSE cash share of State Bank of India.',
    howQuoted: 'Quoted in rupees per share.',
    whatMovesIt: 'Public-sector bank headlines and the NSE cash session.',
    studyFocus: 'Stay on the rupee quote. Bank Nifty is a related index, not a substitute price.',
  },
  INFY: {
    product: 'INFY is the NSE cash share of Infosys.',
    howQuoted: 'Quoted in rupees per share.',
    whatMovesIt: 'Results season and the rupee are the usual study points, inside NSE cash hours.',
    studyFocus: 'Read the NSE close. A dollar chart of a US-listed name is a different market.',
  },
  GOLD: {
    product: 'GOLD is the MCX continuous gold future. It is a rupee commodity contract, not XAUUSD.',
    howQuoted: 'The main contract is commonly quoted in rupees per 10 grams. A move of 150 rupees is a price distance on that quote. Confirm the unit before talking about a lot.',
    whatMovesIt: 'The domestic session, the overseas gold reference, and the rupee. MCX is often open from about 09:00 to 23:30 IST, which is longer than the NSE cash session.',
    studyFocus: 'An example study stop is about 150 rupees and an example target is about 300 rupees from the close. Those numbers are examples on the quote, not a recommendation.',
  },
  SILVER: {
    product: 'SILVER is the MCX continuous silver future.',
    howQuoted: 'Commonly quoted in rupees per kilogram. Silver’s rupee distance is wider than gold’s, so a gold stop does not transfer.',
    whatMovesIt: 'The same bullion session as MCX gold, plus industrial-demand headlines. Confirm the contract month if the screen is not the continuous symbol.',
    studyFocus: 'An example study distance is about 400 rupees to the stop and about 800 rupees to the target.',
  },
  CRUDEOIL: {
    product: 'CRUDEOIL is the MCX continuous crude oil future.',
    howQuoted: 'Commonly quoted in rupees per barrel. Inventory week and the contract unit belong in the note before any size talk.',
    whatMovesIt: 'Overseas crude headlines, the rupee, and the MCX evening session. NSE cash can already be closed while this contract is still printing.',
    studyFocus: 'An example study stop is about 40 rupees and an example target is about 80 rupees.',
  },
  NATURALGAS: {
    product: 'NATURALGAS is the MCX continuous natural-gas future.',
    howQuoted: 'Quoted in rupees on the contract’s own unit. Read that unit on the sheet before comparing it with an overseas gas price.',
    whatMovesIt: 'Storage headlines and the MCX energy session. The quote can travel farther, in percent, than crude on the same day.',
    studyFocus: 'An example study stop is about 3 rupees and an example target is about 6 rupees on this quote.',
  },
  COPPER: {
    product: 'COPPER is the MCX continuous copper future.',
    howQuoted: 'Commonly quoted in rupees per kilogram.',
    whatMovesIt: 'Industrial-demand headlines and the MCX base-metal session.',
    studyFocus: 'An example study stop is about 8 rupees and an example target is about 15 rupees.',
  },
}

export function instrumentName(symbol?: string) {
  return instruments.find((item) => item.symbol === symbol)?.name ?? symbol ?? 'this market'
}

export function instrumentSession(symbol?: string) {
  return instruments.find((item) => item.symbol === symbol)?.sessionNote
}

export const ORDER_NOTE = `A market order is a request to transact now at the available bid or ask. A limit waits for a more favourable price and may never fill. A stop becomes a market order when a trigger is reached — it is a risk or entry mechanism, not a promise. On NSE cash the order is in shares. On MCX the order is in lots of a dated contract, and many contracts can go to delivery, so a study example squares off before expiry. None of these order types is a recommendation.`

export const RISK_NOTE = `On MCX, margin is SPAN plus exposure margin, and profit or loss is marked on the full lot, not on a pip. On NSE cash, the risk is the rupee move times the number of shares. A useful study drill: take the live close, apply a small example distance, and multiply by the lot or the share count. Then repeat at ten times the size. The chart did not change. The rupees did.`

export const MT5_NOTE = `On an NSE or MCX screen, start with the symbol, the exchange, and the quotation unit. Nifty is index points. A share is rupees per share. MCX gold is commonly rupees per 10 grams, silver per kilogram, and crude per barrel. Read the expiry before the chart. The contract note is the record of what was sent.`

export const PAIRS_NOTE = `This board does not use currency pairs. NIFTY and BANKNIFTY are NSE cash indexes in points. RELIANCE, HDFCBANK, TCS, SBIN, and INFY are NSE shares in rupees. GOLD, SILVER, CRUDEOIL, NATURALGAS, COPPER, ZINC, ALUMINIUM, LEAD, and NICKEL are MCX futures in rupees per the contract unit. Read the live close on this board, not a delayed overseas screenshot.`

export const SESSION_NOTE = `NSE cash trades about 09:15–15:30 IST. MCX non-agri contracts usually trade about 09:00–23:30 IST, so gold and crude can still be printing after the equity cash market has closed. Agricultural MCX hours are shorter. A holiday on the Indian calendar can close one book and leave the other open. Sitting out of a session is a valid study choice.`

export const TA_NOTE = `Technical analysis here is a labelling language: swing high, swing low, range versus a series of higher highs, and whether an indicator is describing the past. Support and resistance are areas where price reacted before — they are not walls. Indicators such as RSI or a moving average summarise history; they do not authorise a trade. Timeframe first, then structure, then risk distance.`

export const FUNDAMENTALS_NOTE = `A calendar is a study tool. For NSE, company results, RBI decisions, and the budget can move the cash session. For MCX, inventory headlines, the overseas commodity reference, and the rupee can move the evening session. You do not need a forecast. You need the product, the session, and the fact that “no position” is an allowed outcome.`

export const PSYCH_NOTE = `Charts invite action. Education asks you to delay it. Common traps: revenge after a loss, increasing size to “get it back”, and treating a demo win as a live edge. A written rule such as “I study this timeframe and I do not place a live order today” is more useful than a new indicator.`

export const CFD_NOTE = `NSE cash is the share or the index itself, traded about 09:15–15:30 IST. MCX is the commodity derivatives exchange: a gold, silver, crude, or metal future is a standardised contract in rupees, and many contracts can go to delivery. The quotation unit on the contract sheet decides what a one-rupee move is worth. A currency pair is a different market and is not on this board.`

export function sessionClock(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const hour = Number(parts.find((item) => item.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((item) => item.type === 'minute')?.value ?? 0)
  const clock = hour + minute / 60
  const nse = clock >= 9.25 && clock < 15.5
  const mcx = clock >= 9 && clock < 23.5
  const open: string[] = []
  if (nse) open.push('NSE cash is open, about 09:15–15:30 IST')
  if (mcx) open.push('MCX is open, about 09:00–23:30 IST')
  if (!open.length) open.push('NSE cash and MCX are both closed on this IST clock')
  const overlap = nse && mcx ? 'Both sessions overlap through the equity cash day.' : 'After 15:30 IST, MCX can still be open while NSE cash is closed.'
  return { hour: clock, nse, mcx, summary: `${open.join('; ')}. ${overlap}` }
}

export function weekdayLabel(now = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(now)
}
