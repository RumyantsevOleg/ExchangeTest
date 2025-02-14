import { Injectable } from "@nestjs/common";
import { BaseExchange } from "../exchange.interface";
import { Web3 } from "web3";
import Decimal from "decimal.js";
import { CurrencyNames, ExchangeNames } from "../../common/constants";

const tokenAddresses = {
  BTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  ETH: "0xc02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2",
  SOL: "0xde9b56f3bb816f37b4f1b5081058465ed57826a3",
};

@Injectable()
export class UniswapService extends BaseExchange {
  private web3: Web3;
  private uniswapV2FactoryAddress =
    "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  private uniswapV2FactoryABI = [
    {
      constant: true,
      inputs: [
        { name: "", type: "address" },
        { name: "", type: "address" },
      ],
      name: "getPair",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];

  constructor() {
    super();
    const infuraUrl = "wss://mainnet.infura.io/ws/v3/YOUR_INFURA_PROJECT_ID";
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

  private async getPairAddress(
    tokenA: string,
    tokenB: string,
  ): Promise<string> {
    const uniswapV2Factory = new this.web3.eth.Contract(
      this.uniswapV2FactoryABI,
      this.uniswapV2FactoryAddress,
    );
    return uniswapV2Factory.methods.getPair(tokenA, tokenB).call();
  }

  private async getReserves(pairAddress: string): Promise<[string, string]> {
    const pairABI = [
      {
        constant: true,
        inputs: [],
        name: "getReserves",
        outputs: [
          { name: "reserve0", type: "uint112" },
          { name: "reserve1", type: "uint112" },
          { name: "blockTimestampLast", type: "uint32" },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ];
    const pairContract = new this.web3.eth.Contract(pairABI, pairAddress);
    const reserves = await pairContract.methods.getReserves().call();
    return [reserves["reserve0"], reserves["reserve1"]];
  }

  private async getTokenDecimals(tokenAddress: string): Promise<number> {
    const tokenABI = [
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ];
    const tokenContract = new this.web3.eth.Contract(tokenABI, tokenAddress);
    const decimals = await tokenContract.methods.decimals().call();
    return decimals as any;
  }

  private async getTokenPrice(
    tokenA: string,
    tokenB: string,
  ): Promise<Decimal> {
    const pairAddress = await this.getPairAddress(tokenA, tokenB);
    if (pairAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Pair does not exist");
    }
    const [reserveA, reserveB] = await this.getReserves(pairAddress);
    const decimalsA = await this.getTokenDecimals(tokenA);
    const decimalsB = await this.getTokenDecimals(tokenB);
    const price = new Decimal(reserveB)
      .div(new Decimal(reserveA))
      .mul(new Decimal(10).pow(decimalsA - decimalsB));
    return price;
  }

  protected async getBestPrice(payload: {
    inputCurrency: CurrencyNames;
    outputCurrency: CurrencyNames;
  }): Promise<{
    exchange: ExchangeNames;
    price: Decimal;
  }> {
    try {
      const tokenA = tokenAddresses[payload.inputCurrency];
      const tokenB = tokenAddresses[payload.outputCurrency];
      const price = await this.getTokenPrice(tokenA, tokenB);
      console.log("price");
      console.log(price);
      return {
        exchange: ExchangeNames.Uniswap,
        price,
      };
    } catch (err) {
      console.log("err");
      console.log(err);
      throw new Error("Error fetching data from Uniswap");
    }
  }
}
