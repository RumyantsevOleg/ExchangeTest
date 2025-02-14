import { Injectable } from "@nestjs/common";
import { BaseExchange } from "../exchange.interface";
import { CurrencyNames, ExchangeNames } from "../../common/constants";
import Decimal from "decimal.js";

@Injectable()
export class BinanceService extends BaseExchange {
  protected async getBestPrice({
    inputCurrency,
    outputCurrency,
  }: {
    inputCurrency: CurrencyNames;
    outputCurrency: CurrencyNames;
  }): Promise<{
    price: Decimal;
    exchange: ExchangeNames;
  }> {
    try {
      const symbol = `${inputCurrency}${outputCurrency}`;

      // Todo reverse request for symbol
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

      return {
        price,
        exchange: ExchangeNames.Binance,
      };
    } catch (err) {
      throw new Error("Error fetching data from Binance");
    }
  }
}
