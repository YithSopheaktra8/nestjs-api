import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUserParamDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiPropertyOptional({
    description: 'User ID to get user details',
    example: 1234,
  })
  id: number;
}
