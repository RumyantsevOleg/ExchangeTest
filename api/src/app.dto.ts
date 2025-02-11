export class EstimateRequestDto {
  inputAmount: number;
  inputCurrency: string; // TODO should be enum?;
  outputCurrency: string; // TODO should be enum?;
}

export class GetRatesRequestDto {
  baseCurrency: string;
  quoteCurrency: string;
}

export class RateResponseDto {
  exchangeName: string;
  outputAmount: string;
}
