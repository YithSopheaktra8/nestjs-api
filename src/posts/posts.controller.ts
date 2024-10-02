/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
    constructor(private readonly postService : PostService) {}

    @Get('/:userId?')
    public getPosts(@Param('userId') userId : string){
        console.log("userID", userId);
        return this.postService.findAll(userId);
    }

    @ApiResponse({
        status: 201,
        description: 'The post has been successfully created',
    })
    @ApiOperation({
        summary: 'Create a new post',
    })
    @Post()
    public createPost(@Body() createPostDto : CreatePostDto){
        return createPostDto;
    }

    @ApiOperation({
        summary: 'Update a post',
    })
    @ApiResponse({
        status: 200,
        description: 'The post has been successfully updated',
    })
    @Patch()
    public updatePost(@Body() patchPostDto : PatchPostDto){
        return patchPostDto;
    }
}
