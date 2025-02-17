import { Injectable } from "@nestjs/common";
import { Web3 } from "web3";
import Decimal from "decimal.js";
import * as process from "node:process";
import {
  BaseExchange,
  IBestPricePayload,
  IBestPriceResult,
} from "../exchange.interface";
import { ExchangeNames } from "../../common/constants";

const tokenAddresses = {
  BTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  ETH: "0xEeeeeEeeeEeEeeEeEeEeeEeEeEeeEeEeEeEeE",
  SOL: "0xde9b56f3bb816f37b4f1b5081058465ed57826a3",
};

// Address
const uniswapV4RouterAddress = "0x66a9893cc07d91d95644aedd05d03f95e1dba8af";

// ABI
const uniswapV4RouterABI = [
  {
    constant: true,
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
    ],
    name: "getAmountOut",
    outputs: [{ name: "amountOut", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

@Injectable()
export class UniswapService extends BaseExchange {
  private web3: Web3;

  constructor() {
    super();

    const INFURA_TOKEN = process.env.INFURA_TOKEN;
    const infuraUrl = `wss://mainnet.infura.io/ws/v3/${INFURA_TOKEN}`;
    this.web3 = new Web3(
      new Web3.providers.WebsocketProvider(infuraUrl, {
        clientConfig: {
          keepalive: true,
          keepaliveInterval: 60000,
        },
        reconnect: {
          auto: true,
          delay: 5000,
          maxAttempts: 5,
          onTimeout: false,
        },
      } as any),
    );
  }

  private async getAmountOut(
    tokenA: string,
    tokenB: string,
    inputAmount: number,
  ): Promise<Decimal> {
    const uniswapV4Router = new this.web3.eth.Contract(
      uniswapV4RouterABI,
      uniswapV4RouterAddress,
    );
    const amountOut = await uniswapV4Router.methods
      .getAmountOut(tokenAddresses.BTC, tokenAddresses.USDT, 1)
      .call();

    return new Decimal(amountOut as any);
  }

  protected async getBestPrice({
    inputCurrency,
    outputCurrency,
    inputAmount = 1,
  }: IBestPricePayload): Promise<IBestPriceResult> {
    try {
      const tokenA = tokenAddresses[inputCurrency];
      const tokenB = tokenAddresses[outputCurrency];
      if (!tokenA || !tokenB) {
        throw new Error("Unknown token");
      }

      const price = await this.getAmountOut(tokenA, tokenB, inputAmount);

      return {
        price,
        exchange: ExchangeNames.Uniswap,
      };
    } catch (err) {
      console.error("Error fetching data from Uniswap:", err);
      throw new Error("Error fetching data from Uniswap");
    }
  }
}
