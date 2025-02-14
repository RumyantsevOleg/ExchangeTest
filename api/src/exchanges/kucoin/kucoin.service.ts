import { Injectable } from "@nestjs/common";
import { BaseExchange } from "../exchange.interface";
import Decimal from "decimal.js";
import { CurrencyNames, ExchangeNames } from "../../common/constants";

@Injectable()
export class KucoinService extends BaseExchange {
  protected async getBestPrice(payload: {
    inputCurrency: CurrencyNames;
    outputCurrency: CurrencyNames;
  }): Promise<{
    exchange: ExchangeNames;
    price: Decimal;
  }> {
    try {
      const symbol = `${payload.inputCurrency}-${payload.outputCurrency}`;

      const response = await fetch(
        `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${symbol}`,
      );
      if (response?.status !== 200) {
        throw new Error("Error fetching data from Kucoin");
      }

      const { data } = await response.json();
      const price = new Decimal(data.price);
      if (!price) {
        throw new Error("Error fetching data from Kucoin");
      }

      return {
        price,
        exchange: ExchangeNames.KuCoin,
      };
    } catch (err) {
      // Todo we can add logger
      throw new Error("Error fetching data from Kucoin");
    }
  }
}
