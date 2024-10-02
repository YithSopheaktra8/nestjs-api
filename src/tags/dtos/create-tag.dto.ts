/* eslint-disable prettier/prettier */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from "class-validator";

export class CreateTagDto {
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(256)
    name: string;

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

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsJSON()
    schema?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    @MaxLength(1024)
    featuredImageUrl?: string;

}