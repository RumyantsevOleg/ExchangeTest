import { Injectable } from "@nestjs/common";
import { EstimateRequestDto, RateResponseDto } from "./app.dto";
import { ExchangeFacadeService } from "./exchanges/exchange.service";
import { EstimateRequest } from "./exchanges/exchange.interface";

@Injectable()
export class AppService {
  constructor(private exchangeFacadeService: ExchangeFacadeService) {}

  public async getRates(payload: EstimateRequest): Promise<RateResponseDto[]> {
    return await this.exchangeFacadeService.getAllRatesSorted(payload);
  }

  public async estimate(payload: EstimateRequestDto): Promise<RateResponseDto> {
    return await this.exchangeFacadeService.estimate(payload);
  }
}
