/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { UserService } from "src/users/providers/users.service";
import { Repository } from "typeorm";
import { Post } from "../post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "src/meta-options/meta-option.entity";
import { CreatePostDto } from "../dtos/create-post.dto";

@Injectable()
export class PostService {

    constructor(
        private readonly userService: UserService,

        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        @InjectRepository(MetaOption)
        private readonly metaOptionRepository: Repository<MetaOption>
    ) {}


    /**
     *  createPost method
     */
    public async createPost(createPostDto: CreatePostDto){
        const post = this.postRepository.create(createPostDto);
        
        return await this.postRepository.save(post);        
    }

    public async findAll(userId : string){

        const user = this.userService.findOneById(userId);

        const posts = await this.postRepository.find();

        return posts;
    }

    public deletePost(postId : number){
        this.postRepository.delete(postId);
        return {message: "Post deleted successfully"};
    }
}