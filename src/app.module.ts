import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import winstonConfig from './core/winston-config';

@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
