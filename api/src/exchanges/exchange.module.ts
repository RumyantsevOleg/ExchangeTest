import { Module } from "@nestjs/common";
import { BinanceModule } from "./binance/binance.module";
import { ExchangeFacadeService } from "./exchange.service";
import { KucoinModule } from "./kucoin/kucoin.module";
import { UniswapModule } from "./uniswap/uniswap.module";

@Module({
  imports: [BinanceModule, KucoinModule, UniswapModule],
  providers: [ExchangeFacadeService],
  exports: [ExchangeFacadeService],
})
export class ExchangeModule {}
