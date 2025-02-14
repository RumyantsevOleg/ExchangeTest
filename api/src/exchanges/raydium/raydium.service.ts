import { Injectable, OnModuleInit } from "@nestjs/common";
import { CurrencyNames, ExchangeNames } from "../../common/constants";
import Client from "@triton-one/yellowstone-grpc";
import * as process from "node:process";
import Decimal from "decimal.js";
import { BaseExchange } from "../exchange.interface";

const SHYFT_TOKEN = process.env.SHYFT_TOKEN;
const client = new Client("https://rpc.shyft.to", SHYFT_TOKEN, undefined);

@Injectable()
export class RaydiumService extends BaseExchange implements OnModuleInit {
  private priceData: { [symbol: string]: number } = {};

  async onModuleInit() {
    await this.subscribeToPriceUpdates();
  }

  private async subscribeToPriceUpdates() {
    try {
      const stream = await client.subscribe();
      stream.on("data", (data) => {
        console.log("data");
        console.log(data);
        if (data.symbol) {
          this.priceData[data.symbol] = data.price;
        }
      });
    } catch (error) {
      console.error("Radium error:", error);
    }
  }

  async getBestPrice(payload: {
    inputCurrency: CurrencyNames;
    outputCurrency: CurrencyNames;
  }): Promise<{ exchange: ExchangeNames; price: Decimal }> {
    try {
      const symbol = `${payload.inputCurrency}-${payload.outputCurrency}`;
      const price = this.priceData[symbol];
      if (price !== undefined) {
        return {
          price: new Decimal(price),
          exchange: ExchangeNames.Raydium,
        };
      } else {
        throw new Error("Radium error getBestPrice called");
      }
    } catch (err) {
      throw new Error(`Raydium error: ${err.message}`);
    }
  }
}
