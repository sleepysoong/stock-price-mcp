import { MarketState, StockPriceResponse, YahooFinanceChart } from './types.js';

export class StockAPIClient {
  private readonly baseUrl = 'https://query2.finance.yahoo.com/v8/finance/chart';
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  async getStockPrice(ticker: string): Promise<StockPriceResponse> {
    if (!ticker || ticker.trim() === '') {
      throw new Error('Ticker symbol is required');
    }

    const normalizedTicker = ticker.trim().toUpperCase();
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const url = `${this.baseUrl}/${normalizedTicker}`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as YahooFinanceChart;

        if (data.chart.error) {
          throw new Error(`Yahoo Finance API error: ${data.chart.error.description}`);
        }

        if (!data.chart.result || data.chart.result.length === 0) {
          throw new Error(`Invalid ticker symbol: ${normalizedTicker}`);
        }

        const result = data.chart.result[0];
        const meta = result.meta;

        return {
          ticker: meta.symbol,
          last_price: meta.regularMarketPrice,
          timestamp: new Date(meta.regularMarketTime * 1000).toISOString(),
          market_state: this.normalizeMarketState(meta.marketState),
          currency: meta.currency
        };

      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.maxRetries) {
          await this.sleep(this.retryDelay * attempt);
          continue;
        }
      }
    }

    throw new Error(`Failed to fetch stock price after ${this.maxRetries} attempts: ${lastError?.message}`);
  }

  private normalizeMarketState(state: string): MarketState {
    const normalized = state.toUpperCase();
    
    switch (normalized) {
      case 'PRE':
      case 'PREPRE':
        return MarketState.PRE;
      case 'REGULAR':
        return MarketState.REGULAR;
      case 'POST':
      case 'POSTPOST':
        return MarketState.POST;
      case 'AFTER':
        return MarketState.AFTER;
      case 'CLOSED':
      default:
        return MarketState.CLOSED;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
