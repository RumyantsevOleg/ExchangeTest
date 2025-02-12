import { Injectable } from "@nestjs/common";
import { EstimateRequestDto, RateResponseDto } from "./app.dto";
import { BinanceService } from "./exchanges/binance/binance.service";
import { CurrencyNames, ExchangeNames } from "./common/constants";
import { ExchangeFacadeService } from "./exchanges/exchange.service";

@Injectable()
export class AppService {
  constructor(private exchangeFacadeService: ExchangeFacadeService) {}

  public async getRates(): Promise<RateResponseDto[]> {
    return [
      {
        outputAmount: 23,
        exchangeName: ExchangeNames.Binance,
      },
    ];
  }

  public async estimate(payload: EstimateRequestDto): Promise<RateResponseDto> {
    return await this.exchangeFacadeService.estimate(payload);
  }
}
