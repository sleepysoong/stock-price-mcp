#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { StockAPIClient } from './stock-api.js';
import { MarketState } from './types.js';

const server = new Server(
  {
    name: 'stock-price-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const stockClient = new StockAPIClient();

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_stock_price',
        description: 'Get real-time stock price information for a given ticker symbol. Returns last price, timestamp, market state (PRE/REGULAR/AFTER/POST/CLOSED), and currency.',
        inputSchema: {
          type: 'object',
          properties: {
            ticker: {
              type: 'string',
              description: 'Stock ticker symbol (e.g., AAPL, TSLA, 005930.KS)',
            },
          },
          required: ['ticker'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== 'get_stock_price') {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const ticker = request.params.arguments?.ticker;
  if (!ticker || typeof ticker !== 'string') {
    throw new Error('Ticker parameter is required and must be a string');
  }

  try {
    const stockData = await stockClient.getStockPrice(ticker);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(stockData, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: errorMessage,
            ticker: ticker,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Stock Price MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
