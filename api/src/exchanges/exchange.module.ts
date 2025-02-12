import { Module } from "@nestjs/common";
import { BinanceModule } from "./binance/binance.module";
import { ExchangeFacadeService } from "./exchange.service";

@Module({
  imports: [BinanceModule],
  providers: [ExchangeFacadeService],
  exports: [ExchangeFacadeService],
})
export class ExchangeModule {}
