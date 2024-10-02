/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionsService } from './provider/meta-options.service';
import { CreatePostMetaOptionsDto } from './dtos/create-post-metaOptions.dto';

@Controller('meta-options')
export class MetaOptionsController {
    constructor(
        private readonly metaOptionsService: MetaOptionsService
    ) {}

    @Post()
    public async createMetaOption(@Body() createMetaOptionDto : CreatePostMetaOptionsDto) {
        return await this.metaOptionsService.createMetaOption(createMetaOptionDto);
    }
}
