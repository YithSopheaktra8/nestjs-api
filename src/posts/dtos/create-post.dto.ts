/* eslint-disable prettier/prettier */

import { IsArray, IsEnum, IsISO8601, IsJSON, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateNested } from "class-validator";
import { PostType } from "../enums/postType.enum";
import { PostStatus } from "../enums/postStatus.enum";
import { CreatePostMetaOptionsDto } from "../../meta-options/dtos/create-post-metaOptions.dto";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePostDto {
    @IsString()
    @MaxLength(512)
    @MinLength(5)
    @IsNotEmpty()
    @ApiProperty({
        description: 'Title of the post',
        example: 'My first post'
    }) // Swagger API documentation
    title: string;
    
    @IsEnum(PostType)
    @IsNotEmpty()
    @ApiProperty({
        enum: PostType,
        description: "Possible values  'post', 'page', 'story', 'series'"
    })
    postType: PostType;

    @IsString()
    @MaxLength(256)
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 
        'a slug can only contain lowercase alphanumeric characters and hyphens example: my-url'
    })
    @ApiProperty({
        description: 'Slug of the post',
        example: 'my-first-post'
    })
    slug: string;

    @IsEnum(PostStatus)
    @IsNotEmpty()
    @ApiProperty({
        enum: PostStatus,
        description: "Possible values  'draft', 'published', 'scheduled'"
    })
    status: PostStatus;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: 'Content of the post',
        example: 'This is the content of my first post'
    }) // Swagger API documentation
    content?: string;

    @IsOptional()
    @IsJSON()
    @ApiPropertyOptional({
        description: 'Schema of the post',
        example: '{"type": "object"}'
    }) // Swagger API documentation
    schema?: string;

    @IsString()
    @MaxLength(1024)
    @IsOptional()
    @ApiPropertyOptional({
        description: 'Featured image URL',
        example: 'https://www.example.com/featured-image.jpg'
    }) // Swagger API documentation
    featuredImageUrl?: string;

    @IsISO8601() // ISO8601 date format (YYYY-MM-DDTHH:mm:ss.sssZ)
    @IsOptional()
    @ApiPropertyOptional({
        description: 'Date when the post should be published',
        example: '2021-07-01T12:00:00.000Z'
    }) // Swagger API documentation
    publishOn?: Date;

    @IsOptional()
    @IsArray()
    @IsString({each: true}) // each string in the array should be a string
    @MinLength(3, {each: true}) // each string in the array should have a minimum length of 1
    @ApiPropertyOptional({
        type: [String],
        description: 'Tags associated with the post',
        example: ['tag1', 'tag2', 'tag3']
    }) // Swagger API documentation
    tags: string[];

    @ApiPropertyOptional({
        type: 'array',
        required: false,
        items: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
            },
            value: {
              type: 'string',
            },
          },
        },
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CreatePostMetaOptionsDto) // each object in the array should be of type CreatePostMetaOptionsDto 
    metaOptions: CreatePostMetaOptionsDto[];
}