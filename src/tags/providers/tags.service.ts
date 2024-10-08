/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag.enity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {

    constructor(
        @InjectRepository(Tag)
        private readonly tagsRepository: Repository<Tag>
    ) {}
    
    public async createTag(createTagDto : CreateTagDto) {
        const tag = this.tagsRepository.create(createTagDto);
        return await this.tagsRepository.save(tag);
    }

    public async findAll(tagsId : number[]){
        const tags = await this.tagsRepository.find({
            where: {
                id: In(tagsId)
            }
        })
        return tags;
    }

    public async delete(id: number){
        return await this.tagsRepository.delete(id);
    }

    public async softDelete(id: number){
        return await this.tagsRepository.softDelete(id);
    }
}
