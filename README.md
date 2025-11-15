# Stock Price MCP Server

MCP (Model Context Protocol) server that provides real-time stock price information using Yahoo Finance API.

## Features

- 📈 Real-time stock price data
- 🕐 Price update timestamps
- 🏦 Market state information (PRE, REGULAR, AFTER, POST, CLOSED)
- 💱 Multi-currency support
- 🌍 Global market coverage
- 🆓 Completely free with no rate limits

## Installation

```bash
npm install
npm run build
```

## Usage

### As an MCP Server

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "stock-price": {
      "command": "node",
      "args": ["/path/to/stock-price-mcp/dist/index.js"]
    }
  }
}
```

### Available Tools

#### `get_stock_price`

Get real-time stock price information for a ticker symbol.

**Input:**
```json
{
  "ticker": "AAPL"
}
```

**Output:**
```json
{
  "ticker": "AAPL",
  "last_price": 150.25,
  "timestamp": "2024-01-15T16:00:00.000Z",
  "market_state": "CLOSED",
  "currency": "USD"
}
```

### Market States

- `PRE` - Pre-market trading
- `REGULAR` - Regular trading hours
- `AFTER` - After-hours trading
- `POST` - Post-market trading
- `CLOSED` - Market closed

## Supported Markets

- US Stocks: `AAPL`, `TSLA`, `MSFT`
- Korean Stocks: `005930.KS` (Samsung)
- European Stocks: `BMW.DE`
- And many more global exchanges

## Development

```bash
npm run dev
```

## License

MIT
