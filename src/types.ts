export enum MarketState {
  PRE = "PRE",
  REGULAR = "REGULAR",
  AFTER = "AFTER",
  POST = "POST",
  CLOSED = "CLOSED"
}

export interface StockPriceResponse {
  ticker: string;
  last_price: number;
  timestamp: string;
  market_state: MarketState;
  currency: string;
}

export interface YahooFinanceChart {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        currency: string;
        regularMarketTime: number;
        marketState: string;
        symbol: string;
      };
    }>;
    error: null | {
      code: string;
      description: string;
    };
  };
}
