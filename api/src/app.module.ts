import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ExchangeModule } from "./exchanges/exchange.module";

@Module({
  imports: [ExchangeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
