/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PostService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-post.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
    constructor(private readonly postService : PostService) {}

    @Get('/:userId?')
    public getPosts(@Param('userId') userId : string, @Query() postQuery: GetPostsDto){
        console.log("userID", userId);
        console.log("postQuery", postQuery);
        return this.postService.findAll(userId, postQuery);
    }

    @ApiResponse({
        status: 201,
        description: 'The post has been successfully created',
    })
    @ApiOperation({
        summary: 'Create a new post',
    })
    @Post()
    public createPost(@Body() createPostDto : CreatePostDto, @ActiveUser() user : ActiveUserData){
        return this.postService.createPost(createPostDto, user);
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
        return this.postService.update(patchPostDto);
    }

    @ApiOperation({
        summary: 'Delete a post',
    })
    @ApiResponse({
        status: 200,
        description: 'The post has been successfully deleted',
    })
    @Delete()
    public deletePost(@Query("id", ParseIntPipe) id : number){
        return this.postService.deletePost(id);
    }
}
