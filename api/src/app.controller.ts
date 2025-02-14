import { Controller } from "@nestjs/common";
import { TypedBody, TypedQuery, TypedRoute } from "@nestia/core";
import { ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import {
  EstimateRequestDto,
  GetRatesRequestDto,
  RateResponseDto,
} from "./app.dto";

@ApiTags("/")
@Controller("/")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @TypedRoute.Post("/estimate")
  public estimate(
    @TypedBody() estimateDto: EstimateRequestDto,
  ): Promise<RateResponseDto> {
    return this.appService.estimate(estimateDto);
  }

  @TypedRoute.Get("/rates")
  public getRatesDto(
    @TypedQuery() getRatesDto: GetRatesRequestDto,
  ): Promise<RateResponseDto[]> {
    return this.appService.getRates({
      inputAmount: 1,
      inputCurrency: getRatesDto.baseCurrency,
      outputCurrency: getRatesDto.quoteCurrency,
    });
  }
}
