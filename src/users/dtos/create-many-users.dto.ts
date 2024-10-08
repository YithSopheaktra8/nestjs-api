/* eslint-disable prettier/prettier */
import { ArrayNotEmpty, IsArray, ValidateNested } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateManyUsersDto {
    @ApiProperty({
        type: 'array',
        required: true,
        items: {
            type: 'User',
        }
    })
    @ArrayNotEmpty()
    @IsArray()
    @ValidateNested({ each: true }) // each: true ensures each item in the array is validated
    @Type(() => CreateUserDto) // This is necessary to ensure each item in the array is transformed to the CreateUserDto class
    users: CreateUserDto[];
}