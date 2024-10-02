/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PatchPostDto extends PartialType(CreatePostDto) {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
        description: 'ID of the post to update',
        example: 1234
    })
    id : number;
}
