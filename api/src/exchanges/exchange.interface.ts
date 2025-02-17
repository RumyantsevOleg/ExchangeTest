import { CurrencyNames, ExchangeNames } from "../common/constants";
import Decimal from "decimal.js";

export interface EstimateRequest {
  inputAmount: number;
  inputCurrency: CurrencyNames;
  outputCurrency: CurrencyNames;
}

export interface EstimateResponse {
  exchangeName: ExchangeNames;
  outputAmount: number;
}

export interface IBestPriceResult {
  price: Decimal;
  exchange: ExchangeNames;
}

export interface IBestPricePayload {
  inputCurrency: CurrencyNames;
  outputCurrency: CurrencyNames;
  inputAmount?: number;
}

export interface IExchange {
  estimate(payload: EstimateRequest): Promise<EstimateResponse>;
}

export class BaseExchange implements IExchange {
  // We are using polymorphism here
  protected async getBestPrice(
    payload: IBestPricePayload,
  ): Promise<IBestPriceResult> {
    throw new Error("Method getBestPrice not implemented.");
  }

  public async estimate({
    inputCurrency,
    outputCurrency,
    inputAmount = 1,
  }: EstimateRequest): Promise<EstimateResponse> {
    // TODO: Consider using Mark Price (price may vary based on trade volume).

    const inputAmountDecimal = new Decimal(inputAmount);
    const { exchange, price } = await this.getBestPrice({
      inputCurrency,
      outputCurrency,
    });

    return {
      exchangeName: exchange,
      outputAmount: inputAmountDecimal.mul(price).toNumber(),
    };
  }
}
