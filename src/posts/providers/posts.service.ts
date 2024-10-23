/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, RequestTimeoutException } from "@nestjs/common";
import { UserService } from "src/users/providers/users.service";
import { In, Repository } from "typeorm";
import { Post } from "../post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "src/meta-options/meta-option.entity";
import { CreatePostDto } from "../dtos/create-post.dto";
import { Tag } from "src/tags/tag.enity";
import { TagsService } from "src/tags/providers/tags.service";
import { PatchPostDto } from "../dtos/patch-post.dto";
import { GetPostsDto } from "../dtos/get-post.dto";
import { PaginationProvider } from "src/common/pagination/providers/pagination.provider";
import { Paginated } from "src/common/pagination/interfaces/paginated.interface";
import { CreatePostProvider } from "./create-post.provider";
import { ActiveUserData } from "src/auth/interfaces/active-user-data.interface";

@Injectable()
export class PostService {

    constructor(
        private readonly userService: UserService,

        private readonly tagService: TagsService,

        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        @InjectRepository(MetaOption)
        private readonly metaOptionRepository: Repository<MetaOption>,

        private readonly paginationProvider: PaginationProvider,

        private readonly createPostProvider: CreatePostProvider
    ) {}

    /**
     *  createPost method
     */
    public async createPost(createPostDto: CreatePostDto, user: ActiveUserData){
        return this.createPostProvider.createPost(createPostDto, user);
    }

    public async findAll(userId : string, postQuery: GetPostsDto) : Promise<Paginated<Post>>{

        let posts = await this.paginationProvider.paginated(
            {
                limit : postQuery.limit,
                page : postQuery.page
            }, 
            this.postRepository
        );
        return posts;
    }

    public async update(patchPostDto: PatchPostDto){

        let tags = undefined;
        let post = undefined;

        try {
            tags = await this.tagService.findAll(patchPostDto.tags);
        } catch (error) {
            throw new RequestTimeoutException("Unable to process the request for the moment!",{
                description: "Unable to process the request for the moment!"
            });
        }

        try {
            post = await this.postRepository.findOneBy({
                id: patchPostDto.id
            });
        } catch (error) {
            throw new RequestTimeoutException("Unable to process the request for the moment!",{
                description: "Unable to process the request for the moment!"
            })
        }

        // Update post related properties
        post.title = patchPostDto.title ?? post.title;
        post.content = patchPostDto.content ?? post.content;
        post.status = patchPostDto.status ?? post.status;
        post.postType = patchPostDto.postType ?? post.postType;
        post.slug = patchPostDto.slug ?? post.slug;
        post.featuredImageUrl =
        patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
        post.publishOn = patchPostDto.publishOn ?? post.publishOn;

        // Update the tags
        post.tags = tags;

        try {
            return await this.postRepository.save(post);
        } catch (error) {
            throw new RequestTimeoutException("Unable to process the request for the moment!",{
                description: "Unable to process the request for the moment!"
            })
        }
    }

    public deletePost(postId : number){
        this.postRepository.delete(postId);
        return {message: "Post deleted successfully"};
    }
}