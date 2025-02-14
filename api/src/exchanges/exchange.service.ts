import { Injectable } from "@nestjs/common";
import {
  EstimateRequest,
  EstimateResponse,
  IExchange,
} from "./exchange.interface";
import { BinanceService } from "./binance/binance.service";
import { KucoinService } from "./kucoin/kucoin.service";
import { RaydiumService } from "./raydium/raydium.service";
import { UniswapService } from "./uniswap/uniswap.service";

@Injectable()
export class ExchangeFacadeService implements IExchange {
  constructor(
    private binanceService: BinanceService,
    private kucoinService: KucoinService,
    private uniswapService: UniswapService,
  ) {}

  public async getAllRatesSorted(payload: EstimateRequest) {
    const arr = await Promise.all([
      this.binanceService.estimate(payload),
      this.kucoinService.estimate(payload),
      this.uniswapService.estimate(payload),
    ]);

    return arr.sort((a, b) => a.outputAmount - b.outputAmount);
  }

  public async estimate(payload: EstimateRequest): Promise<EstimateResponse> {
    const allExchangesData = await this.getAllRatesSorted(payload);

    return allExchangesData[0];
  }
}
