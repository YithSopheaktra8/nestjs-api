/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface Paginated<T> {
    data : T[];
    meta : {
        itemsPerPage: number;
        totalItems: number;
        currentPage: number;
        totalPages: number;
    },
    links : {
        first: string;
        last: string;
        current: string;
        previous: string;
        next: string;
    },
}