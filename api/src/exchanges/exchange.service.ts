import { Injectable } from "@nestjs/common";
import {
  EstimateRequest,
  EstimateResponse,
  IExchange,
} from "./exchange.interface";
import { BinanceService } from "./binance/binance.service";

@Injectable()
export class ExchangeFacadeService implements IExchange {
  constructor(private binanceService: BinanceService) {}

  public getAllRates(payload: any) {
    return Promise.all([this.binanceService.estimate(payload)]);
  }

  public async estimate(payload: EstimateRequest): Promise<EstimateResponse> {
    const allExchangesData = await this.getAllRates(payload);

    return allExchangesData[0];
  }
}
