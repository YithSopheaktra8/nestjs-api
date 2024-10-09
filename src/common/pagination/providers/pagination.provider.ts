/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {

    constructor(
        @Inject(REQUEST)
        private readonly request : Request
    ) {}
    
    public async paginated<T extends ObjectLiteral> (
        paginatedQuery : PaginationQueryDto,
        repository : Repository<T>
    ) : Promise<Paginated<T>> {
        const result = await repository.find({
            take: paginatedQuery.limit, // limit the number of posts returned or take the number of posts from database
            skip: paginatedQuery.limit * (paginatedQuery.page - 1), // skip the number of posts from the database for example if limit is 10 and page is 2, it will skip 10 posts
        });

        const baseUrl = `${this.request.protocol}://${this.request.get('host')}${this.request.baseUrl}/`;
        const newUrl = new URL(this.request.url, baseUrl);
        
        const totalItems = await repository.count();
        const totalPages = Math.ceil(totalItems / paginatedQuery.limit);
        const nextPage = paginatedQuery.page === totalPages ? paginatedQuery.page : paginatedQuery.page + 1;
        const previousPage = paginatedQuery.page === 1 ? paginatedQuery.page : paginatedQuery.page - 1;

        const finalResult : Paginated<T> = {
            data: result,
            meta: {
                currentPage: paginatedQuery.page,
                itemsPerPage: paginatedQuery.limit,
                totalItems: totalItems,
                totalPages: totalPages,
            },
            links: {
                first: `${newUrl.origin}${newUrl.pathname}?page=1&limit=${paginatedQuery.limit}`,
                last: `${newUrl.origin}${newUrl.pathname}?page=${totalPages}&limit=${paginatedQuery.limit}`,
                current: `${newUrl.origin}${newUrl.pathname}?page=${paginatedQuery.page}&limit=${paginatedQuery.limit}`,
                next: `${newUrl.origin}${newUrl.pathname}?page=${nextPage}&limit=${paginatedQuery.limit}`,
                previous: `${newUrl.origin}${newUrl.pathname}?page=${previousPage}&limit=${paginatedQuery.limit}`,
            }
        }

        return finalResult;
    }
}
