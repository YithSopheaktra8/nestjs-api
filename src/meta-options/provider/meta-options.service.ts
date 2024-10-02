/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-metaOptions.dto';

@Injectable()
export class MetaOptionsService {

    constructor(
        @InjectRepository(MetaOption)
        private readonly metaOptionRepository: Repository<MetaOption>
    ) {}

    public async createMetaOption(createMetaOptionDto : CreatePostMetaOptionsDto) {
        const metaOption = this.metaOptionRepository.create(createMetaOptionDto);
        return await this.metaOptionRepository.save(metaOption);
    }
}
