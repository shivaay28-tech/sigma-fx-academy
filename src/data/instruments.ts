import type { Instrument } from '@/types'

const NSE_SESSION = 'NSE cash trades about 09:15–15:30 IST. The opening auction and the closing minutes can print wider moves than the middle of the session.'
const MCX_SESSION = 'The usual MCX session runs about 09:00–23:30 IST. Agricultural hours differ, and the exchange calendar is the one that counts.'

export const instruments: Instrument[] = [
  {
    symbol: 'NIFTY',
    name: 'Nifty 50',
    sessionNote: `${NSE_SESSION} The quote is the cash index in points, not a futures contract and not a currency pair.`,
  },
  {
    symbol: 'BANKNIFTY',
    name: 'Nifty Bank',
    sessionNote: `${NSE_SESSION} Banking stocks dominate this index, so a move in the large banks often shows up here first.`,
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    sessionNote: `${NSE_SESSION} Quoted in rupees per share on the NSE cash market.`,
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank',
    sessionNote: `${NSE_SESSION} Quoted in rupees per share. Bank Nifty often moves with this name.`,
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    sessionNote: `${NSE_SESSION} Quoted in rupees per share. IT results and the rupee are common study points.`,
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    sessionNote: `${NSE_SESSION} Quoted in rupees per share on the NSE cash market.`,
  },
  {
    symbol: 'INFY',
    name: 'Infosys',
    sessionNote: `${NSE_SESSION} Quoted in rupees per share. Results and the rupee are the usual calendar items.`,
  },
  {
    symbol: 'GOLD',
    name: 'MCX Gold',
    sessionNote: `${MCX_SESSION} The continuous gold contract is commonly quoted in rupees per 10 grams. Confirm the unit on the contract sheet.`,
  },
  {
    symbol: 'SILVER',
    name: 'MCX Silver',
    sessionNote: `${MCX_SESSION} The continuous silver contract is commonly quoted in rupees per kilogram.`,
  },
  {
    symbol: 'CRUDEOIL',
    name: 'MCX Crude oil',
    sessionNote: `${MCX_SESSION} The continuous crude contract is commonly quoted in rupees per barrel.`,
  },
  {
    symbol: 'NATURALGAS',
    name: 'MCX Natural gas',
    sessionNote: `${MCX_SESSION} Quoted in rupees on the contract’s own unit. Read that unit before comparing it with an overseas gas price.`,
  },
  {
    symbol: 'COPPER',
    name: 'MCX Copper',
    sessionNote: `${MCX_SESSION} The continuous copper contract is commonly quoted in rupees per kilogram.`,
  },
  {
    symbol: 'ZINC',
    name: 'MCX Zinc',
    sessionNote: `${MCX_SESSION} A base-metal future, commonly quoted in rupees per kilogram.`,
  },
  {
    symbol: 'ALUMINIUM',
    name: 'MCX Aluminium',
    sessionNote: `${MCX_SESSION} A base-metal future, commonly quoted in rupees per kilogram.`,
  },
  {
    symbol: 'LEAD',
    name: 'MCX Lead',
    sessionNote: `${MCX_SESSION} A base-metal future, commonly quoted in rupees per kilogram.`,
  },
  {
    symbol: 'NICKEL',
    name: 'MCX Nickel',
    sessionNote: `${MCX_SESSION} A base-metal future, commonly quoted in rupees per kilogram.`,
  },
]
