/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MetaOptionsController } from './meta-options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaOption } from './meta-option.entity';
import { MetaOptionsService } from './provider/meta-options.service';

@Module({
  controllers: [MetaOptionsController],
  imports: [
    TypeOrmModule.forFeature([
      MetaOption
    ]),
  ],
  providers: [MetaOptionsService],
})
export class MetaOptionsModule {}