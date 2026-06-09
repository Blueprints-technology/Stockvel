export interface PaginationQuery {
    page?: number;
    limit?: number;
}
export declare function getPagination(query: PaginationQuery): {
    page: number;
    limit: number;
    skip: number;
};
