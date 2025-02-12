import { Injectable } from "@nestjs/common";
import {
  EstimateRequest,
  EstimateResponse,
  IExchange,
} from "../exchange.interface";
import { ExchangeNames } from "../../common/constants";
import Decimal from "decimal.js";

@Injectable()
export class BinanceService implements IExchange {
  private async getLastTrade(symbol: string): Promise<Decimal> {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=1`,
      );
      if (!response.ok) {
        throw new Error("Error fetching data from Binance");
      }

      const data = await response.json();
      const price = new Decimal(data?.[0]?.price);
      if (!price) {
        throw new Error("Error fetching data from Binance");
      }

      return price;
    } catch (err) {
      throw new Error("Error fetching data from Binance");
    }
  }

  public async estimate({
    inputAmount = 1,
    inputCurrency,
    outputCurrency,
  }: EstimateRequest): Promise<EstimateResponse> {
    // TODO: Consider using Mark Price (price may vary based on trade volume).
    const symbol = `${inputCurrency}${outputCurrency}`;

    const inputAmountDecimal = new Decimal(inputAmount);
    const priceDecimal = await this.getLastTrade(symbol);

    return {
      exchangeName: ExchangeNames.Binance,
      outputAmount: inputAmountDecimal.mul(priceDecimal).toNumber(),
    };
  }
}
