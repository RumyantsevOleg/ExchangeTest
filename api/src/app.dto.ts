import { CurrencyNames, ExchangeNames } from "./common/constants";

export class EstimateRequestDto {
  inputCurrency: CurrencyNames;
  outputCurrency: CurrencyNames;
  inputAmount: number;
}

export class GetRatesRequestDto {
  baseCurrency: CurrencyNames;
  quoteCurrency: CurrencyNames;
}

export class RateResponseDto {
  exchangeName: ExchangeNames;
  outputAmount: number;
}
