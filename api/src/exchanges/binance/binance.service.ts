import { Injectable } from '@nestjs/common';
import { CreateBinanceDto } from './dto/create-binance.dto';
import { UpdateBinanceDto } from './dto/update-binance.dto';
import {IExchange} from "../exchange.interface";

@Injectable()
export class BinanceService implements IExchange{
  public async getRate() {
    return 'This action adds a new binance';
  }
}
