import type { Course, Lesson, Module } from '@/types'
import { APP_NAME } from '@/utils/constants'

// Second catalogue batch (November 2026): 14 courses that bring the academy to 25.
// Contract details that change (lot sizes, margins, duty and tax rates) are deliberately
// not quoted. Lessons send learners to the current exchange specification instead.

function lesson(id: string, slug: string, title: string, durationMinutes: number, order: number, summary: string, content: string[]): Lesson {
  return { id, slug, title, durationMinutes, order, summary, content, resourceName: 'Lesson notes (PDF)' }
}

function module(id: string, title: string, order: number, lessons: Lesson[]): Module {
  return { id, title, order, lessons }
}

const SPEC_NOTE =
  'Contract sizes, tick values and margins are set by the exchange and can change. Always check the current contract specification on the MCX website or your broker terminal before relying on a number.'

export const extraCourses: Course[] = [
  // ───────────────────────── MCX Basics ─────────────────────────
  {
    id: 'course-x01',
    slug: 'mcx-mini-and-micro-contracts',
    title: 'MCX Mini and Micro Contracts',
    subtitle: 'Smaller lots of the same commodity, and why size matters.',
    description:
      'Many MCX commodities trade in more than one contract size. This course explains how mini and micro contracts relate to the main contract, what changes and what stays the same, and how a smaller lot changes the rupee value of every price move.',
    categoryId: 'cat-mcx-basics',
    difficulty: 'Beginner',
    durationHours: 1.5,
    objectives: [
      'Explain what a mini or micro contract is',
      'Show how lot size changes the rupee value of a price move',
      'Recognise that a smaller lot reduces size, not risk per rupee of exposure',
      'Find the current contract specification before trading',
    ],
    instructor: APP_NAME,
    status: 'published',
    popular: true,
    featured: false,
    quizId: 'quiz-x01',
    modules: [
      module('mod-x01-1', 'One commodity, several sizes', 1, [
        lesson('l-x01-1', 'why-smaller-contracts-exist', 'Why smaller contracts exist', 10, 1,
          'Mini and micro contracts let participants trade the same commodity in a smaller quantity.',
          [
            'A futures contract fixes a quantity of the commodity. For gold, silver and crude oil, MCX lists a main contract and one or more smaller versions, often called mini, micro, guinea or petal contracts. They track the same underlying commodity and are quoted in the same way, usually in rupees per unit.',
            'The difference is the quantity in one lot. A smaller lot means each one-rupee move in price changes the profit or loss by a smaller amount. That makes the contract easier to fit to a smaller account, and it makes practice with real numbers less costly.',
            SPEC_NOTE,
          ]),
        lesson('l-x01-2', 'same-price-different-value', 'Same price, different rupee value', 12, 2,
          'The quoted price is the same idea across sizes. The value of each move depends on the lot.',
          [
            'Suppose a hypothetical main contract represents 100 units and a mini represents 10 units of the same commodity, both quoted per unit. If the price moves by ₹5, the main contract changes by ₹500 per lot and the mini by ₹50 per lot. The chart looks identical. The money does not.',
            'This is why the first question about any trade is not “where is the price going?” but “what is one tick worth on this contract, and how many lots am I holding?”. Two people looking at the same chart can carry very different risk.',
            'Smaller contracts can also have different trading activity. A contract with fewer participants can show wider gaps between the best bid and the best offer. Check both the depth and the volume before assuming a smaller contract trades the same way as the main one.',
          ]),
      ]),
      module('mod-x01-2', 'Using size sensibly', 2, [
        lesson('l-x01-3', 'smaller-is-not-safer', 'Smaller is not automatically safer', 11, 3,
          'Ten mini lots can carry the same exposure as one main lot.',
          [
            'A mini contract reduces exposure only if you hold fewer units in total. Buying ten mini lots instead of one main lot of the same total quantity leaves the exposure unchanged. The risk comes from the total quantity, not from the name of the contract.',
            'Margin is collateral, not the limit of a loss. On a smaller contract the margin is smaller, but the profit or loss is still calculated on the full quantity held, and prices can move beyond the margin you posted.',
            'A sensible use of smaller contracts is to match the position to a planned rupee risk, a topic covered in the Position Sizing course.',
          ]),
        lesson('l-x01-4', 'reading-the-spec-sheet', 'Reading the contract specification', 12, 4,
          'Every contract has a specification sheet. Learn which lines matter first.',
          [
            'A contract specification lists the trading unit, the quotation unit, the tick size, the expiry date, the delivery or settlement rules, and the daily price limits. These lines decide what one move is worth and what happens if a position stays open.',
            'Start with three lines: the trading unit (how much is in one lot), the quotation unit (what the price refers to, such as per 10 grams or per barrel) and the tick size (the smallest price change). Together they tell you the rupee value of one tick per lot.',
            'Then read the expiry and settlement lines. Some contracts settle in cash and some can lead to physical delivery. Knowing which one you hold is basic risk management, not an advanced topic.',
          ]),
      ]),
    ],
  },
  {
    id: 'course-x02',
    slug: 'options-on-mcx-futures',
    title: 'Options on MCX Futures: The Basics',
    subtitle: 'Calls, puts, premium and strike — explained without a strategy pitch.',
    description:
      'MCX lists options on several commodities. This course explains what an option is, how calls and puts work, why the buyer pays a premium, and why the seller of an option takes on a very different risk to the buyer.',
    categoryId: 'cat-mcx-basics',
    difficulty: 'Intermediate',
    durationHours: 2,
    objectives: [
      'Define a call option and a put option',
      'Explain premium, strike price and expiry',
      'Compare the risk of buying and selling an option',
      'Describe what happens to an option at expiry',
    ],
    instructor: APP_NAME,
    status: 'published',
    popular: false,
    featured: false,
    quizId: 'quiz-x02',
    modules: [
      module('mod-x02-1', 'What an option is', 1, [
        lesson('l-x02-1', 'calls-and-puts', 'Calls and puts', 14, 1,
          'An option gives the buyer a right, not an obligation.',
          [
            'A call option gives its buyer the right, but not the obligation, to buy the underlying at a fixed price, called the strike price, on or before expiry, depending on the contract style. A put option gives its buyer the right to sell at the strike price.',
            'On MCX, many commodity options use a futures contract as the underlying, and some use the physical good. The contract specification says which one applies and how the option settles. Read it before studying any example.',
            'The buyer pays a price for this right, called the premium. The seller, also called the writer, receives the premium and takes on the obligation if the buyer exercises.',
          ]),
        lesson('l-x02-2', 'premium-and-strike', 'Premium, strike and expiry', 14, 2,
          'The premium reflects how far the strike is from the market, the time left and how much the price is expected to move.',
          [
            'An option is in the money when exercising it would have value now: a call with a strike below the current price, or a put with a strike above it. It is out of the money when the opposite is true. At the money means the strike is close to the current price.',
            'The premium has two parts. Intrinsic value is the amount the option is in the money. Time value is the rest, and it reflects the time left to expiry and how much the market expects the price to move. Time value shrinks as expiry approaches, all else equal.',
            'Expected movement, called implied volatility, matters a great deal. When markets expect large moves, premiums rise. When they expect calm, premiums fall. An option can lose value even if the price moves in the buyer’s favour, if time and volatility work against it.',
          ]),
      ]),
      module('mod-x02-2', 'Risk on each side', 2, [
        lesson('l-x02-3', 'buyer-versus-seller-risk', 'Buyer risk versus seller risk', 13, 3,
          'A buyer can lose the premium. A seller can lose far more than the premium received.',
          [
            'For an option buyer, the maximum loss is the premium paid plus costs. The option can expire worthless, and many do. A limited loss is not the same as a likely gain.',
            'For an option seller, the maximum gain is the premium received, while the potential loss can be very large if the price moves sharply against the position. Sellers usually post margin, and that margin can increase quickly in volatile markets.',
            'Selling options because they “usually expire worthless” ignores the size of the losses in the cases where they do not. This course explains the mechanics. It does not recommend any options strategy.',
          ]),
        lesson('l-x02-4', 'what-happens-at-expiry', 'What happens at expiry', 12, 4,
          'Check the settlement rules: an option can become a futures position or settle in another way.',
          [
            'At expiry, an option that is in the money may be exercised automatically according to exchange rules. Depending on the contract, exercise can result in a position in the underlying futures contract, or in settlement linked to the physical good.',
            'This matters because a small option position can turn into a full futures position with its own margin and its own delivery rules. Many participants close options before expiry to avoid this.',
            'Before trading any option, read the exercise and settlement section of the contract specification and confirm with your broker how expiring positions are handled.',
          ]),
      ]),
    ],
  },

  // ───────────────────────── NSC and MCX / markets ─────────────────────────
  {
    id: 'course-x03',
    slug: 'indian-markets-nse-cash-and-indices',
    title: 'Indian Markets: NSE Cash and Indices',
    subtitle: 'Shares, Nifty 50 and Bank Nifty — what they are and how they are quoted.',
    description:
      'The AI Engine and many learners talk about Nifty, Bank Nifty and large NSE shares. This course explains the NSE cash market, how an index is built, how shares are quoted and settled, and how the equity session fits beside the MCX day.',
    categoryId: 'cat-markets',
    difficulty: 'Beginner',
    durationHours: 1.5,
    objectives: [
      'Describe the NSE cash market and its session',
      'Explain what an index such as Nifty 50 measures',
      'Read a share quote in rupees per share',
      'Compare the NSE and MCX trading days',
    ],
    instructor: APP_NAME,
    status: 'published',
    popular: true,
    featured: false,
    quizId: 'quiz-x03',
    modules: [
      module('mod-x03-1', 'The cash market', 1, [
        lesson('l-x03-1', 'what-is-the-nse-cash-market', 'What is the NSE cash market?', 11, 1,
          'In the cash market you buy and sell shares themselves, quoted in rupees per share.',
          [
            'The National Stock Exchange of India (NSE) runs a cash market where shares of listed companies are bought and sold. A share quote is in rupees per share. If a share is quoted at ₹1,500, one share costs about ₹1,500 plus charges and taxes.',
            'The normal equity session runs from about 09:15 to 15:30 IST, with a short pre-open session before it. The exchange publishes the exact timings and holidays, and those are the ones that count.',
            'Indian equity trades settle on a T+1 basis: the shares and money change hands one working day after the trade. Settlement is handled by clearing corporations and depositories, not by the buyer and seller directly.',
          ]),
        lesson('l-x03-2', 'reading-a-share-quote', 'Reading a share quote', 10, 2,
          'Last price, change, day range and volume tell you what already happened today.',
          [
            'A share quote usually shows the last traded price, the change from the previous close in rupees and percent, the day’s high and low, and the volume traded. Together they describe today’s session so far.',
            'The bid is the best price a buyer is currently offering, and the ask, or offer, is the best price a seller will accept. The difference between them is the spread. Large, actively traded shares usually have narrow spreads.',
            'None of these numbers predicts the next move. They are a record of what has happened, and reading them accurately is the first step in any study of a share.',
          ]),
      ]),
      module('mod-x03-2', 'Indices and the trading day', 2, [
        lesson('l-x03-3', 'how-an-index-works', 'How an index like Nifty 50 works', 13, 3,
          'An index summarises many shares in one number, measured in points.',
          [
            'The Nifty 50 is an index of 50 large companies listed on the NSE, weighted by free-float market capitalisation. Larger companies, measured by the shares available to the public, have a bigger effect on the index. The index is quoted in points, not rupees.',
            'Bank Nifty, officially Nifty Bank, tracks large banking shares. Because a few big banks carry heavy weights, a move in one large bank can show up quickly in the index.',
            'You cannot buy the index itself in the cash market. People gain exposure through index funds, exchange-traded funds or index derivatives. This course covers the index as a number to understand, not as a product to trade.',
          ]),
        lesson('l-x03-4', 'nse-and-mcx-days-side-by-side', 'NSE and MCX days side by side', 11, 4,
          'Equities close in the afternoon. Many MCX commodities trade late into the evening.',
          [
            'The NSE equity session ends in mid-afternoon IST. Non-agricultural MCX contracts usually continue until late evening, overlapping with European and US trading hours. Global news after the Indian equity close can therefore show up first in MCX prices.',
            'This difference explains why a commodity can move sharply at night while Indian shares are closed, and why shares can open with a gap the next morning after overnight global news.',
            'When the AI Engine or a lesson refers to “today’s session”, check which market it means. A Nifty session and a gold session are not the same hours.',
          ]),
      ]),
    ],
  },
  {
    id: 'course-x04',
    slug: 'bullion-prices-in-india',
    title: 'Bullion Prices in India',
    subtitle: 'From the international price to the rupee price you see.',
    description:
      'Why does gold in India not simply equal the international price? This course walks through the main pieces: the dollar price, the rupee exchange rate, import duty and taxes, and the local premium or discount.',
    categoryId: 'cat-markets',
    difficulty: 'Intermediate',
    durationHours: 1.5,
    objectives: [
      'Convert an international bullion price into an approximate rupee price',
      'Explain how the rupee–dollar rate affects Indian gold and silver prices',
      'Describe the role of import duty and taxes in the landed price',
      'Explain local premiums and discounts',
    ],
    instructor: APP_NAME,
    status: 'published',
    popular: false,
    featured: false,
    quizId: 'quiz-x04',
    modules: [
      module('mod-x04-1', 'Building the rupee price', 1, [
        lesson('l-x04-1', 'from-dollars-to-rupees', 'From dollars to rupees', 13, 1,
          'International gold is priced in US dollars per troy ounce. Indian prices are in rupees per 10 grams.',
          [
            'Global gold is quoted in US dollars per troy ounce, and one troy ounce is about 31.1 grams. Indian gold is commonly quoted in rupees per 10 grams. To compare them you convert both the currency and the unit.',
            'Because the dollar price is converted at the rupee–dollar rate, Indian gold can rise even when international gold is flat, if the rupee weakens. The reverse is also true. Two forces, not one, move the rupee price.',
            'The conversion gives an approximate parity price. The actual Indian price also includes duties, taxes and local market conditions, covered in the next lessons.',
          ]),
        lesson('l-x04-2', 'duty-and-taxes', 'Import duty and taxes', 12, 2,
          'India imports most of its gold, so import duty and taxes add to the landed cost.',
          [
            'India imports most of the gold it uses. Imported gold attracts customs duty and related charges, and goods and services tax (GST) applies to retail purchases. Together these raise the landed cost above the simple converted international price.',
            'These rates are set by the government and have changed several times, often in the Union Budget. A change in duty can move the domestic price on the day it is announced, even if international prices do not move.',
            'This course does not quote current rates because they change. Check the latest official notifications when you need the exact figures.',
          ]),
      ]),
      module('mod-x04-2', 'Local market conditions', 2, [
        lesson('l-x04-3', 'premiums-and-discounts', 'Local premiums and discounts', 12, 3,
          'Dealers can quote above or below the parity price, depending on local demand.',
          [
            'In strong demand periods such as weddings and festivals, Indian dealers may charge a premium over the official parity price. In weak demand periods they may offer a discount to attract buyers.',
            'Premiums and discounts are a useful window into physical demand in India, separate from the global futures market. Industry reports often track them week to week.',
            'The MCX futures price, the spot jeweller price and the international price are related but not identical. Expect small, changing gaps between them.',
          ]),
        lesson('l-x04-4', 'silver-is-different', 'Why silver behaves differently', 11, 4,
          'Silver is both a precious metal and an industrial input.',
          [
            'Silver follows many of the same drivers as gold, including the dollar and interest rates, but a large share of silver demand comes from industry, such as electronics and solar panels. Industrial demand links silver to the wider economy.',
            'Silver is quoted in India per kilogram, and its price usually moves by a larger percentage than gold on the same day. Larger percentage moves mean larger rupee swings per lot.',
            'When studying silver, look at both precious-metal drivers and industrial news. Treat it as a related but separate market from gold.',
          ]),
      ]),
    ],
  },

  // ───────────────────────── Technical analysis ─────────────────────────
  {
    id: 'course-x05',
    slug: 'candlestick-patterns-for-commodities',
    title: 'Candlestick Patterns for Commodities',
    subtitle: 'How to read a candle, and why context matters more than the name.',
    description:
      'Candlestick charts show the open, high, low and close of each period. This course teaches how to read single candles and a few well-known patterns on gold, silver and crude charts, and why a pattern without context means very little.',
    categoryId: 'cat-technical',
    difficulty: 'Beginner',
    durationHours: 1.5,
    objectives: [
      'Read the open, high, low and close from a candle',
      'Recognise a doji, a hammer and an engulfing pattern',
      'Explain why the timeframe and location of a pattern matter',
      'Describe patterns as descriptions, not predictions',
    ],
    instructor: APP_NAME,
    status: 'published',
    popular: true,
    featured: false,
    quizId: 'quiz-x05',
    modules: [
      module('mod-x05-1', 'Reading one candle', 1, [
        lesson('l-x05-1', 'anatomy-of-a-candle', 'Anatomy of a candle', 10, 1,
          'The body shows the open and close. The wicks show the high and low.',
          [
            'Each candle covers one period, such as five minutes, one hour or one day. The thick part, the body, runs between the open and the close. The thin lines above and below, called wicks or shadows, reach the period’s high and low.',
            'A candle is usually coloured one way when the close is above the open (often green or white) and another way when the close is below the open (often red or black). Colours vary by platform, so check your chart settings.',
            'A long body shows a strong move from open to close. Long wicks show that price travelled far during the period but was pushed back before the close.',
          ]),
        lesson('l-x05-2', 'common-single-candles', 'Doji and hammer', 12, 2,
          'Some single candles describe indecision or rejection of a price level.',
          [
            'A doji has an open and close that are almost the same, so its body is very thin. It describes a period where neither buyers nor sellers ended in control. On its own, it says nothing about what comes next.',
            'A hammer has a small body near the top of the range and a long lower wick. It shows that price fell during the period but recovered much of the fall before the close. When it appears after a decline, some traders read it as a possible sign of buying interest.',
            'The reverse shape, a small body near the bottom with a long upper wick, shows that a rise was pushed back. Names differ between books, but the useful skill is describing what the wick and body show.',
          ]),
      ]),
      module('mod-x05-2', 'Patterns in context', 2, [
        lesson('l-x05-3', 'engulfing-patterns', 'Engulfing patterns', 12, 3,
          'A two-candle pattern where the second body covers the first.',
          [
            'A bullish engulfing pattern is a down candle followed by an up candle whose body fully covers the previous body. A bearish engulfing pattern is the reverse. Both describe a shift in control from one side to the other within two periods.',
            'The same shape means different things in different places. An engulfing pattern at a level the market has reacted to before carries more information than one in the middle of a quiet range.',
            'Commodity markets often gap between sessions, especially after weekends or major news. Gaps can distort two-candle patterns, so check whether the candles are really comparable.',
          ]),
        lesson('l-x05-4', 'context-and-timeframe', 'Context and timeframe', 11, 4,
          'A pattern on a five-minute chart and on a daily chart are not the same evidence.',
          [
            'A pattern on a daily chart summarises a whole session and many participants. The same pattern on a one-minute chart can appear and disappear many times a day. Higher timeframes usually carry more weight, but they also move more slowly.',
            'Before naming a pattern, note the trend on a higher timeframe, the nearest support and resistance levels, and any scheduled news. These often matter more than the pattern itself.',
            'Studies of candlestick patterns show mixed results, and no pattern works every time. Use patterns to describe price behaviour clearly, and always plan where an idea would be proved wrong.',
          ]),
      ]),
    ],
  },
  {
    id: 'course-x06',
    slug: 'support-resistance-and-trend',
    title: 'Support, Resistance and Trend Structure',
    subtitle: 'Mark the levels the market has already respected.',
    description:
      'Support and resistance are price areas where the market has reacted before. Trend structure describes the sequence of highs and lows. This course shows how to mark both on a commodity chart, objectively and without forcing a story.',
    categoryId: 'cat-technical',
    difficulty: 'Intermediate',
    durationHours: 2,
    objectives: [
      'Identify support and resistance zones from past reactions',
      'Describe an uptrend, a downtrend and a range using highs and lows',
      'Explain breakouts and false breakouts',
      'Use levels to plan where an idea is proved wrong',
    ],
    instructor: APP_NAME,
    status: 'published',
    popular: false,
    featured: false,
    quizId: 'quiz-x06',
    modules: [
      module('mod-x06-1', 'Levels', 1, [
        lesson('l-x06-1', 'what-support-and-resistance-are', 'What support and resistance are', 12, 1,
          'Areas where price has turned before, drawn as zones rather than exact lines.',
          [
            'Support is a price area below the current price where falls have stopped or reversed before. Resistance is an area above the current price where rises have stalled. They form because many participants remember and react to the same prices.',
            'Draw them as zones, not thin lines. Commodities rarely turn at exactly the same rupee each time, and a zone reflects that.',
            'Round numbers, previous day highs and lows, and the edges of long ranges are common places for reactions. The more clearly and the more often price has reacted at a level, the more attention it tends to get.',
          ]),
        lesson('l-x06-2', 'role-reversal', 'When support becomes resistance', 11, 2,
          'A broken level often changes role.',
          [
            'When price falls clearly through support, that area sometimes acts as resistance on a later rise. The same can happen in reverse: broken resistance can later act as support. This is called role reversal.',
            'Role reversal is a tendency, not a rule. Mark the level, watch how price behaves when it returns, and describe what you see rather than assuming the outcome.',
            'Keep the number of levels small. A chart covered in lines makes every move look explained after the fact and helps no one decide anything in advance.',
          ]),
      ]),
      module('mod-x06-2', 'Trend and breakouts', 2, [
        lesson('l-x06-3', 'highs-and-lows', 'Trend through highs and lows', 13, 3,
          'An uptrend makes higher highs and higher lows. A downtrend makes lower highs and lower lows.',
          [
            'In an uptrend, each swing high is above the previous one, and each swing low is also above the previous low. In a downtrend, both highs and lows step lower. When neither pattern holds, the market is in a range.',
            'A trend is considered damaged when the pattern breaks, for example when an uptrend makes a lower low. That is a description of structure, not a forecast of a reversal.',
            'Always state the timeframe. Gold can be in an uptrend on the daily chart and a downtrend on the 15-minute chart at the same time.',
          ]),
        lesson('l-x06-4', 'breakouts-and-false-breakouts', 'Breakouts and false breakouts', 13, 4,
          'Price moving through a level is only half the story. What it does next matters.',
          [
            'A breakout happens when price moves clearly through support or resistance. Some breakouts continue, while others reverse quickly back inside the range. The second kind is called a false breakout.',
            'Common ways to judge a breakout include whether a candle closes beyond the level, whether volume increases, and whether price holds the level when it returns to it. None of these guarantees the outcome.',
            'Levels are most useful for planning risk. If an idea depends on support holding, a clear close below that support is where the idea is proved wrong. Decide that point before the trade, not during it.',
          ]),
      ]),
    ],
  },
  {
    id: 'course-x07',
    slug: 'indicators-in-context',
    title: 'Indicators in Context: Moving Averages, RSI and ATR',
    subtitle: 'Three common tools, what they calculate and what they cannot do.',
    description:
      'Indicators are calculations on past prices. This course explains three widely used ones — moving averages, the Relative Strength Index and the Average True Range — how each is calculated in plain language, and how to use them as labels rather than instructions.',
    categoryId: 'cat-technical',
    difficulty: 'Intermediate',
    durationHours: 2,
    objectives: [
      'Explain what a simple and an exponential moving average show',
      'Describe how RSI is read and why “overbought” is not a sell signal',
      'Use ATR to describe how much a market usually moves',
      'Avoid stacking indicators that measure the same thing',
    ],
    instructor: APP_NAME,
    status: 'published',
    popular: false,
    featured: false,
    quizId: 'quiz-x07',
    modules: [
      module('mod-x07-1', 'Trend and momentum', 1, [
        lesson('l-x07-1', 'moving-averages', 'Moving averages', 13, 1,
          'An average of recent closing prices that smooths out noise.',
          [
            'A simple moving average (SMA) adds the closing prices of the last N periods and divides by N. A 20-day SMA is the average close of the last 20 days. An exponential moving average (EMA) gives more weight to recent prices, so it reacts faster.',
            'Moving averages lag because they are built from past prices. They are useful for describing direction: price above a rising average is often described as an uptrend, and price below a falling average as a downtrend.',
            'In sideways markets, price crosses moving averages often and the crosses carry little meaning. That is a limitation of the tool, not a failure of the trader.',
          ]),
        lesson('l-x07-2', 'rsi', 'The Relative Strength Index (RSI)', 13, 2,
          'RSI measures the speed of recent gains against recent losses on a 0–100 scale.',
          [
            'The RSI compares the size of recent up moves with recent down moves, commonly over 14 periods, and scales the result from 0 to 100. Readings above 70 are often called overbought and readings below 30 oversold.',
            '“Overbought” does not mean “about to fall”. In a strong uptrend, RSI can stay above 70 for a long time while price keeps rising. The label describes recent momentum, not the next move.',
            'Some traders look for divergence, where price makes a new high but RSI does not. Divergence describes slowing momentum. It can last a long time before anything changes, or nothing may change at all.',
          ]),
      ]),
      module('mod-x07-2', 'Volatility and discipline', 2, [
        lesson('l-x07-3', 'atr', 'Average True Range (ATR)', 12, 3,
          'ATR measures how much a market typically moves, not which way.',
          [
            'True range for a period is the largest of: the high minus the low, the high minus the previous close, or the previous close minus the low. ATR is the average of true range over a number of periods, commonly 14.',
            'ATR is expressed in price units, such as rupees for gold. If gold’s daily ATR is ₹1,200, a typical day has recently covered about that much from its extremes. It says nothing about direction.',
            'ATR helps place realistic invalidation levels. A stop placed well inside the normal daily movement is likely to be hit by ordinary noise, even if the idea behind the trade is reasonable.',
          ]),
        lesson('l-x07-4', 'fewer-better-indicators', 'Fewer, better-understood indicators', 10, 4,
          'Five momentum indicators on one chart usually say the same thing five times.',
          [
            'Many indicators are built from the same closing prices, so they tend to agree with each other. Adding more of them feels like more evidence, but it is often the same evidence repeated.',
            'A balanced set might include one tool for trend (a moving average), one for momentum (RSI) and one for volatility (ATR), each used for a clear question.',
            'Write down what each indicator is for before you use it. If you cannot say what question it answers, it is decoration.',
          ]),
      ]),
    ],
  },

  // ───────────────────────── Fundamental analysis ─────────────────────────
  {
    id: 'course-x08',
    slug: 'crude-oil-drivers',
    title: 'What Drives Crude Oil Prices',
    subtitle: 'Inventories, OPEC+, demand and the rupee.',
    description:
      'Crude oil is one of the most actively traded MCX contracts. This course explains the main forces behind its price: supply decisions, inventory reports, global demand, geopolitical events, and the rupee conversion that turns a dollar price into an MCX price.',
    categoryId: 'cat-fundamental',
    difficulty: 'Intermediate',
    durationHours: 2,
    objectives: [
      'Explain how supply decisions by major producers can affect prices',
      'Describe what weekly inventory reports measure',
      'Link global demand and the economy to oil prices',
      'Explain how the rupee affects MCX crude',
    ],
    instructor: APP_NAME,
    status: 'published',
    popular: true,
    featured: false,
    quizId: 'quiz-x08',
    modules: [
      module('mod-x08-1', 'Supply and storage', 1, [
        lesson('l-x08-1', 'supply-and-opec', 'Supply and OPEC+', 13, 1,
          'Production decisions by large producers can shift the balance of the market.',
          [
            'OPEC+ is a group of oil-producing countries, including OPEC members and partners such as Russia, that coordinate production targets. Announcements about raising or cutting output can move prices, sometimes before the change takes effect.',
            'Other supply matters too, such as US shale production, outages from weather or conflict, and sanctions that change where oil can be sold. Supply news is often uncertain at first and revised later.',
            'MCX crude oil tracks international benchmarks closely, so these global events show up in Indian prices, adjusted by the rupee.',
          ]),
        lesson('l-x08-2', 'inventory-reports', 'Inventory reports', 12, 2,
          'Weekly data on stored oil show whether supply is running ahead of demand.',
          [
            'In the United States, the Energy Information Administration (EIA) publishes weekly data on crude oil and fuel inventories, usually in the middle of the week. Industry groups publish estimates beforehand.',
            'Markets compare the reported change with expectations. A larger build in inventories than expected can be read as weaker demand or stronger supply, and a larger draw as the opposite. The surprise matters more than the raw number.',
            'Because these reports come out during Indian evening or night hours, MCX crude can move sharply around their release. Check the release time in IST before studying a crude chart that evening.',
          ]),
      ]),
      module('mod-x08-2', 'Demand and currency', 2, [
        lesson('l-x08-3', 'demand-and-the-economy', 'Demand and the economy', 12, 3,
          'Oil demand rises and falls with economic activity, travel and industry.',
          [
            'Crude is refined into fuels used in transport, industry and power. When economies grow, demand for oil tends to rise. When growth slows, demand expectations fall and prices often follow.',
            'Data on manufacturing, travel and the largest importing economies, including China and India, are watched for signs of demand. Seasonal patterns, such as summer driving in the US, also play a role.',
            'Geopolitical events in producing regions can raise prices on fears of disruption, even if supply is not actually lost. These moves can reverse quickly once the risk is reassessed.',
          ]),
        lesson('l-x08-4', 'rupee-and-mcx-crude', 'The rupee and MCX crude', 11, 4,
          'MCX crude is a dollar commodity priced in rupees.',
          [
            'International crude is priced in US dollars per barrel. MCX crude is quoted in rupees per barrel. A weaker rupee raises the MCX price for the same dollar price, and a stronger rupee lowers it.',
            'On most days, movement in the dollar price dominates. On days of large currency moves, the rupee can explain a noticeable part of the MCX change.',
            'When comparing an MCX crude chart with an international one, remember to account for both the currency and contract differences, such as expiry months.',
          ]),
      ]),
    ],
  },
  {
    id: 'course-x09',
    slug: 'gold-and-silver-drivers',
    title: 'What Drives Gold and Silver Prices',
    subtitle: 'Interest rates, the dollar, central banks and demand.',
    description:
      'Gold and silver respond to a mix of global and Indian factors. This course explains the role of interest rates, the US dollar, central bank buying, investment flows and Indian physical demand, and why no single factor explains every move.',
    categoryId: 'cat-fundamental',
    difficulty: 'Intermediate',
    durationHours: 2,
    objectives: [
      'Explain why gold often reacts to real interest rates',
      'Describe the usual relationship between gold and the US dollar',
      'Identify the role of central banks and investment demand',
      'Recognise seasonal Indian demand patterns',
    ],
    instructor: APP_NAME,
    status: 'published',
    popular: false,
    featured: false,
    quizId: 'quiz-x09',
    modules: [
      module('mod-x09-1', 'Global drivers', 1, [
        lesson('l-x09-1', 'rates-and-gold', 'Interest rates and gold', 13, 1,
          'Gold pays no interest, so the return available elsewhere matters.',
          [
            'Gold does not pay interest or dividends. When interest rates after inflation, called real rates, are high, holding gold means giving up a meaningful return elsewhere. When real rates fall, that cost of holding gold shrinks.',
            'For this reason, markets watch US Federal Reserve decisions and inflation data closely. Expectations about future rate changes can move gold before any decision is made.',
            'This relationship is a tendency observed over many years, not a fixed rule. There have been periods when gold and real rates rose together.',
          ]),
        lesson('l-x09-2', 'the-dollar-and-central-banks', 'The dollar and central banks', 12, 2,
          'Gold is priced in dollars, and central banks are major buyers.',
          [
            'Because international gold is priced in US dollars, a stronger dollar makes gold more expensive for buyers using other currencies, and gold often falls when the dollar rises. Often, but not always.',
            'Central banks hold gold as part of their reserves. In recent years, several have been significant buyers, which has added to demand. Their purchases are reported with a delay, so the effect is often seen in hindsight.',
            'Investment flows through gold exchange-traded funds and futures can also move prices, especially during periods of economic or political uncertainty.',
          ]),
      ]),
      module('mod-x09-2', 'India and silver', 2, [
        lesson('l-x09-3', 'indian-physical-demand', 'Indian physical demand', 11, 3,
          'Weddings and festivals shape gold buying in India.',
          [
            'India is one of the largest consumers of gold, mostly as jewellery. Demand typically rises around the wedding season and festivals such as Akshaya Tritiya and Dhanteras.',
            'High prices can reduce jewellery buying, while price dips can bring buyers in. Local dealer premiums and discounts, covered in the Bullion Prices in India course, help show this demand.',
            'Indian demand affects the local market more than the global price, which is set by many countries and investors together.',
          ]),
        lesson('l-x09-4', 'silver-drivers', 'Silver’s extra drivers', 11, 4,
          'Silver adds industrial demand to the precious-metal story.',
          [
            'Silver responds to many of the same factors as gold, but a large share of its demand is industrial, including electronics and solar panels. Economic growth and industrial activity therefore matter more for silver.',
            'Silver is a smaller market than gold, which helps explain why its percentage moves are often larger. Larger moves mean larger rupee swings for the same lot.',
            'The gold-to-silver ratio, the price of gold divided by the price of silver, is a common way to compare the two. It describes their relative price. It does not tell you which will rise.',
          ]),
      ]),
    ],
  },

  // ───────────────────────── Risk ─────────────────────────
  {
    id: 'course-x10',
    slug: 'position-sizing',
    title: 'Position Sizing: Planning Rupee Risk',
    subtitle: 'Decide how much you can lose before deciding how much to buy.',
    description:
      'Position sizing links three numbers: the rupee amount you are willing to risk, the distance to the point where your idea is wrong, and the rupee value of each move on the contract. This course shows the calculation step by step with clearly hypothetical numbers.',
    categoryId: 'cat-risk',
    difficulty: 'Beginner',
    durationHours: 1.5,
    objectives: [
      'Define risk per trade as a rupee amount',
      'Calculate position size from risk, stop distance and contract value',
      'Explain why the stop distance should come from the chart, not the account',
      'Recognise the limits of any sizing rule',
    ],
    instructor: APP_NAME,
    status: 'published',
    popular: true,
    featured: false,
    quizId: 'quiz-x10',
    modules: [
      module('mod-x10-1', 'The idea', 1, [
        lesson('l-x10-1', 'risk-first', 'Risk first, size second', 11, 1,
          'Start with the most you are prepared to lose on one idea.',
          [
            'Many new traders choose a quantity first and think about risk later. Position sizing reverses that order: first decide the most you are prepared to lose if this idea is wrong, then work out the size that keeps the loss within that amount.',
            'A common guideline in trading education is to risk a small, fixed percentage of the account on any one idea, often between 0.5% and 2%. The exact number is a personal decision. The habit of deciding it in advance is what matters.',
            'Risk here means the planned loss if the invalidation level is reached. Real losses can be larger because of gaps and slippage, covered in the Gaps, Price Limits and Event Risk course.',
          ]),
        lesson('l-x10-2', 'the-three-numbers', 'The three numbers', 12, 2,
          'Rupee risk, stop distance and value per point give the position size.',
          [
            'Position size = rupee risk ÷ (stop distance × rupee value of a one-point move per lot). Every part comes from somewhere specific: rupee risk from your plan, stop distance from the chart, and value per point from the contract specification.',
            'Hypothetical example: an account of ₹2,00,000 risking 1% gives ₹2,000. On a hypothetical contract where each ₹1 move changes profit or loss by ₹100 per lot, a stop ₹10 away risks ₹1,000 per lot. ₹2,000 ÷ ₹1,000 = 2 lots.',
            'If the calculation gives a fraction of a lot, round down. If even one lot risks more than your plan allows, the trade does not fit your account at that stop distance. That is useful information, not a problem to work around.',
          ]),
      ]),
      module('mod-x10-2', 'Using it well', 2, [
        lesson('l-x10-3', 'stops-come-from-the-chart', 'Stops come from the chart', 11, 3,
          'Do not move the stop to make a bigger position fit.',
          [
            'The stop distance should come from where the idea is proved wrong, such as beyond a support level, not from how many lots you would like to hold. Moving the stop closer to fit more lots usually just makes it more likely to be hit.',
            'Use volatility as a check. If the stop is well inside the normal daily movement measured by ATR, ordinary noise may reach it.',
            'When the right stop is far away, the right size is small. Accepting that is the core skill of position sizing.',
          ]),
        lesson('l-x10-4', 'limits-of-sizing', 'What sizing cannot do', 10, 4,
          'Sizing controls the planned loss. It does not make a poor idea good.',
          [
            'Position sizing limits the damage from any single idea, so that a run of losses does not empty the account. It does not improve the quality of the ideas themselves.',
            'Several open positions in related markets, such as gold and silver, can behave like one larger position. Consider total risk across positions, not just each one alone.',
            'Revisit the numbers whenever the account size or the contract specification changes. A plan written for one situation can quietly become wrong in another.',
          ]),
      ]),
    ],
  },
  {
    id: 'course-x11',
    slug: 'gaps-price-limits-and-event-risk',
    title: 'Gaps, Price Limits and Event Risk',
    subtitle: 'Why the loss can be bigger than the stop.',
    description:
      'Prices do not always move smoothly. This course explains price gaps, daily price limits set by the exchange, slippage on stop orders, and how scheduled and unscheduled events can create moves that a plan must account for.',
    categoryId: 'cat-risk',
    difficulty: 'Advanced',
    durationHours: 2,
    objectives: [
      'Explain why prices gap between sessions',
      'Describe how stop orders can fill beyond the stop price',
      'Explain the purpose of exchange daily price limits',
      'Plan around scheduled events',
    ],
    instructor: APP_NAME,
    status: 'published',
    popular: false,
    featured: false,
    quizId: 'quiz-x11',
    modules: [
      module('mod-x11-1', 'Gaps and slippage', 1, [
        lesson('l-x11-1', 'why-prices-gap', 'Why prices gap', 12, 1,
          'When news arrives while a market is closed, it can open at a very different price.',
          [
            'A gap is a jump between one period’s close and the next period’s open, with no trading in between. Gaps happen when information arrives while the market is closed, such as over a weekend or overnight.',
            'Commodities trade globally, and international markets can react to news while MCX is closed. When MCX reopens, the price can open close to where global markets have moved, skipping the levels in between.',
            'A stop placed in the gap area cannot be filled at its price, because no trades happened there.',
          ]),
        lesson('l-x11-2', 'slippage', 'Slippage on stop orders', 12, 2,
          'A stop-market order becomes a market order and fills at the next available price.',
          [
            'Slippage is the difference between the price you expected and the price you got. With a stop-market order, once the stop price is reached the order becomes a market order and fills at the best available price, which in a fast market can be worse than the stop.',
            'A stop-limit order sets a worst acceptable price, which limits slippage, but it may not fill at all if price moves through the limit. That can leave the position open while the market keeps moving.',
            'Neither order type removes risk. Each trades one risk for another, and the choice should be made in advance.',
          ]),
      ]),
      module('mod-x11-2', 'Limits and events', 2, [
        lesson('l-x11-3', 'daily-price-limits', 'Daily price limits', 12, 3,
          'Exchanges set limits on how far a contract can move in a day, with rules for widening them.',
          [
            'MCX sets a daily price range for its contracts. If price reaches the edge of the range, trading may pause or be restricted, and the exchange can widen the range according to its published rules.',
            'Limits are designed to slow disorderly moves. They do not stop a price from moving further on the next day or after the range is widened, and they can make it harder to exit a position during a sharp move.',
            'The current limits for each contract are listed in its specification and in exchange circulars. Check them rather than assuming a number.',
          ]),
        lesson('l-x11-4', 'planning-around-events', 'Planning around events', 13, 4,
          'Scheduled events can be planned for. Unscheduled ones can only be sized for.',
          [
            'Scheduled events include central bank decisions, inflation data, weekly oil inventory reports, OPEC+ meetings and the Indian Union Budget. Their dates are known in advance, and many traders reduce or close positions before them.',
            'Unscheduled events, such as conflicts or sudden policy changes, cannot be planned for in advance. The only defence is position sizing that assumes a loss can be larger than the planned stop.',
            'Keep an economic calendar in IST and check it before studying any position. Being surprised by a scheduled event is avoidable.',
          ]),
      ]),
    ],
  },

  // ───────────────────────── Psychology ─────────────────────────
  {
    id: 'course-x12',
    slug: 'trading-journal-and-routine',
    title: 'Building a Trading Journal and Routine',
    subtitle: 'Turn experience into evidence you can review.',
    description:
      'A journal turns individual trades into a record you can learn from. This course explains what to record, how to review it honestly, and how a simple daily routine reduces impulsive decisions.',
    categoryId: 'cat-psychology',
    difficulty: 'Advanced',
    durationHours: 1.5,
    objectives: [
      'List the fields a useful trading journal records',
      'Review a journal for patterns in decisions, not just outcomes',
      'Separate good decisions from good outcomes',
      'Build a short pre-session and post-session routine',
    ],
    instructor: APP_NAME,
    status: 'published',
    popular: false,
    featured: false,
    quizId: 'quiz-x12',
    modules: [
      module('mod-x12-1', 'The journal', 1, [
        lesson('l-x12-1', 'what-to-record', 'What to record', 11, 1,
          'Record the plan before the trade and the facts after it.',
          [
            'A useful journal records the date and time, the instrument and contract, the timeframe, the reason for the trade, the planned entry, invalidation level and target, the position size and the planned rupee risk.',
            'After the trade, record the actual entry and exit, the result in rupees, any slippage, and whether you followed the plan. Add a line on how you felt, because emotions often explain departures from the plan.',
            'Write the plan before entering. A plan written afterwards tends to fit the outcome.',
          ]),
        lesson('l-x12-2', 'decisions-versus-outcomes', 'Decisions versus outcomes', 12, 2,
          'A good decision can lose money, and a bad one can make money.',
          [
            'Markets are uncertain, so a well-planned trade can lose and a careless one can win. Judging yourself only by profit or loss teaches the wrong lessons, such as repeating a risky habit because it happened to work.',
            'Grade each trade on whether you followed your plan: sizing, entry rules, exit rules. Over many trades, a process followed consistently tells you far more than any single result.',
            'Separating decisions from outcomes also reduces the urge to “win back” a loss, a common source of large mistakes.',
          ]),
      ]),
      module('mod-x12-2', 'The routine', 2, [
        lesson('l-x12-3', 'before-and-after-the-session', 'Before and after the session', 11, 3,
          'A short checklist before and a short review after.',
          [
            'Before the session: check the economic calendar in IST, note key levels on the instruments you follow, confirm your maximum risk for the day, and decide whether today is a day to trade or only to observe.',
            'After the session: update the journal, note any rule you broke and why, and write one lesson in a single sentence. Keep it short so that you actually do it every day.',
            'Deciding to sit out is a complete and valid outcome for a session.',
          ]),
        lesson('l-x12-4', 'weekly-review', 'The weekly review', 12, 4,
          'Look for patterns across many entries, not in one trade.',
          [
            'Once a week, read back through the journal. Look for patterns: times of day when you break rules, instruments where results differ, or setups you take impulsively.',
            'Count, rather than remember. Memory favours dramatic trades. A simple tally of rule-following versus rule-breaking is more reliable.',
            'Choose one change for the next week, not five. Small, specific adjustments are more likely to last.',
          ]),
      ]),
    ],
  },

  // ───────────────────────── Trading screen ─────────────────────────
  {
    id: 'course-x13',
    slug: 'order-types-and-validity',
    title: 'Order Types and Validity on the Screen',
    subtitle: 'Market, limit, stop-loss and how long an order stays live.',
    description:
      'The order ticket decides how and when an order executes. This course explains market, limit and stop-loss orders, order validity such as day and immediate-or-cancel, and the checks to make before pressing submit.',
    categoryId: 'cat-mt5',
    difficulty: 'Intermediate',
    durationHours: 1.5,
    objectives: [
      'Choose between market and limit orders and explain the trade-off',
      'Describe stop-loss and stop-loss-market orders',
      'Explain order validity types such as day and IOC',
      'Run a pre-submit checklist on the order ticket',
    ],
    instructor: APP_NAME,
    status: 'published',
    popular: false,
    featured: false,
    quizId: 'quiz-x13',
    modules: [
      module('mod-x13-1', 'Order types', 1, [
        lesson('l-x13-1', 'market-and-limit', 'Market and limit orders', 11, 1,
          'Market orders prioritise filling. Limit orders prioritise price.',
          [
            'A market order executes immediately at the best available price. It almost always fills, but in a fast or thin market the price can be worse than the last quote you saw.',
            'A limit order sets the worst price you will accept: the most you will pay when buying, or the least you will accept when selling. It may fill at that price or better, or not fill at all.',
            'The choice is a trade-off between certainty of execution and control of price. Neither is right in every situation.',
          ]),
        lesson('l-x13-2', 'stop-loss-orders', 'Stop-loss orders', 12, 2,
          'A stop-loss order waits until a trigger price is reached.',
          [
            'A stop-loss order has a trigger price. When the market reaches it, the order becomes active. In a stop-loss limit (often shown as SL), it becomes a limit order at the price you set. In a stop-loss market (often shown as SL-M), it becomes a market order.',
            'SL-M orders are more likely to fill but can suffer slippage. SL limit orders control the fill price but can be skipped in a fast move. Brokers and exchanges may also restrict certain order types on certain contracts.',
            'Placing a stop-loss order is the practical way to act on the invalidation level from your plan, rather than relying on watching the screen.',
          ]),
      ]),
      module('mod-x13-2', 'Validity and checks', 2, [
        lesson('l-x13-3', 'order-validity', 'Order validity', 10, 3,
          'Validity decides how long an unfilled order stays in the system.',
          [
            'A day order stays active until the end of the trading session and is cancelled if it has not filled. An immediate-or-cancel (IOC) order fills whatever it can immediately and cancels the rest.',
            'Some broker terminals offer longer validity, such as good-till-cancelled, by re-placing the order each day. Check how your broker handles it, because the exchange rules and the broker’s implementation can differ.',
            'Forgotten orders are a common source of unexpected positions. Review open orders at the end of every session.',
          ]),
        lesson('l-x13-4', 'pre-submit-checklist', 'The pre-submit checklist', 10, 4,
          'Four checks prevent most order-entry mistakes.',
          [
            'Before submitting, check: the contract and expiry month are the ones you intend; buy or sell is correct; the quantity is in lots and matches your position-size calculation; and the order type and price are what you planned.',
            'Many costly mistakes are typing errors, such as an extra zero in the quantity or the wrong expiry month. Slowing down for five seconds at this step is worth it.',
            'After submitting, confirm the order status: placed, partially filled, filled or rejected. Do not assume an order has filled because you clicked the button.',
          ]),
      ]),
    ],
  },

  // ───────────────────────── Participants ─────────────────────────
  {
    id: 'course-x14',
    slug: 'hedging-basics-for-businesses',
    title: 'Hedging Basics for Businesses',
    subtitle: 'How jewellers, importers and producers use futures to manage price risk.',
    description:
      'Hedging uses a futures position to offset a price risk a business already has. This course explains short and long hedges with simple examples, basis risk, and the practical costs that make hedging a risk-management tool rather than a source of profit.',
    categoryId: 'cat-ib',
    difficulty: 'Advanced',
    durationHours: 2,
    objectives: [
      'Explain the difference between hedging and speculation',
      'Describe a long hedge and a short hedge',
      'Explain basis risk',
      'List the practical costs of hedging',
    ],
    instructor: APP_NAME,
    status: 'published',
    popular: false,
    featured: false,
    quizId: 'quiz-x14',
    modules: [
      module('mod-x14-1', 'The idea of a hedge', 1, [
        lesson('l-x14-1', 'hedging-versus-speculation', 'Hedging versus speculation', 12, 1,
          'A hedge offsets a risk you already have. Speculation takes on a new risk.',
          [
            'A business that holds or needs a commodity is already exposed to its price. A jeweller holding gold stock loses if gold falls. A jeweller who has promised a price to a customer for a future delivery loses if gold rises before buying it.',
            'A hedge is a futures position that tends to gain when the business’s physical position loses, and lose when it gains. The aim is to make the business’s result more predictable, not to make extra profit.',
            'Speculation is taking a futures position without an offsetting physical exposure, in order to profit from price changes. Both use the same contracts, but the purpose and the risk are very different.',
          ]),
        lesson('l-x14-2', 'long-and-short-hedges', 'Long hedges and short hedges', 13, 2,
          'Buy futures to protect against rising costs. Sell futures to protect stock against falling prices.',
          [
            'A short hedge protects against falling prices. A jeweller with gold inventory can sell gold futures. If gold falls, the inventory is worth less, but the short futures position gains, offsetting much of the loss.',
            'A long hedge protects against rising prices. An importer who must buy copper in two months can buy copper futures now. If copper rises, the physical purchase costs more, but the futures position gains.',
            'In both cases, the hedge also gives up gains. If prices move in the business’s favour, the futures position loses. That is the cost of predictability.',
          ]),
      ]),
      module('mod-x14-2', 'Imperfect hedges', 2, [
        lesson('l-x14-3', 'basis-risk', 'Basis risk', 12, 3,
          'The futures price and the physical price do not move exactly together.',
          [
            'Basis is the difference between the local physical price a business actually pays or receives and the futures price. It changes over time because of location, quality, timing and local demand.',
            'Because basis changes, a hedge rarely offsets the physical loss exactly. The remaining uncertainty is called basis risk. A hedge replaces outright price risk with a usually smaller basis risk.',
            'Choosing a contract and expiry close to the business’s actual commodity and timing helps reduce basis risk.',
          ]),
        lesson('l-x14-4', 'practical-costs', 'Practical costs of hedging', 12, 4,
          'Margin, mark-to-market cash flows and expiry management all have a cost.',
          [
            'Futures require margin, and positions are marked to market daily. A hedge that is working as intended can still require cash payments when the futures side loses, before the physical side’s gain is realised. Businesses need the cash to support this.',
            'Hedges must be rolled from one expiry to the next if the exposure lasts longer than one contract, and each roll has costs. Brokerage, taxes and fees also add up.',
            'A hedging programme should have a written policy: what exposure is hedged, how much, with which contracts, and who approves changes. Hedging without a policy can drift into speculation.',
          ]),
      ]),
    ],
  },
]
