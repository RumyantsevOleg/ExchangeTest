import { Module } from "@nestjs/common";
import { BinanceModule } from "./binance/binance.module";
import { ExchangeFacadeService } from "./exchange.service";
import { KucoinModule } from "./kucoin/kucoin.module";
import { RaydiumModule } from "./raydium/raydium.module";

@Module({
  imports: [BinanceModule, KucoinModule, RaydiumModule],
  providers: [ExchangeFacadeService],
  exports: [ExchangeFacadeService],
})
export class ExchangeModule {}
