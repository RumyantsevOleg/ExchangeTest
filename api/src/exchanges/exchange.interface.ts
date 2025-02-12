import { CurrencyNames, ExchangeNames } from "../common/constants";

export interface EstimateRequest {
  inputAmount: number;
  inputCurrency: CurrencyNames;
  outputCurrency: string;
}

export interface EstimateResponse {
  exchangeName: ExchangeNames;
  outputAmount: number;
}

export interface IExchange {
  estimate(payload: EstimateRequest): Promise<EstimateResponse>;
}
