/* eslint-disable prettier/prettier */

import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
    @IsOptional()
    @IsPositive()
    limit: number = 10; // default value

    @IsOptional()
    @IsPositive()
    page: number = 1; // default value
}   