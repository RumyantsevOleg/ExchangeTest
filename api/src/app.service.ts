import { Injectable } from "@nestjs/common";
import { RateResponseDto } from "./app.dto";

@Injectable()
export class AppService {
  public async getRates(): Promise<RateResponseDto[]> {
    return [
      {
        outputAmount: "23",
        exchangeName: "Binance",
      },
    ];
  }

  public async estimate(): Promise<RateResponseDto> {
    const rates = await this.getRates();

    return rates[0];
  }
}
