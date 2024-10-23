/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { TagsService } from 'src/tags/providers/tags.service';
import { UserService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from '../post.entity';

@Injectable()
export class CreatePostProvider {
    constructor(
        private readonly userService: UserService,

        private readonly tagService: TagsService,

        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ){}
    public async createPost(createPostDto: CreatePostDto, user: ActiveUserData){

        let author = undefined;
        let tags = undefined;

        try {
            author = await this.userService.findOneById(user.sub);
            tags = await this.tagService.findAll(createPostDto.tags);
        } catch (error) {
            throw new ConflictException(error)
        }

        if(createPostDto.tags.length !== tags.length){
            throw new BadRequestException("Some tags do not exist");
        }

        let post = this.postRepository.create({
            ...createPostDto, 
            author : author,
            tags : tags
        });
        
        try {
            return await this.postRepository.save(post); 
        } catch (error) {
            throw new ConflictException(error);
        }       
    }
}
