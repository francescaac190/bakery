export function parsePagination(pageInput, pageSizeInput, maxPageSize = 100) {
    const rawPage = Number(pageInput ?? "1");
    const rawPageSize = Number(pageSizeInput ?? "20");
    const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
    const pageSize = Number.isFinite(rawPageSize) && rawPageSize > 0
        ? Math.min(Math.floor(rawPageSize), maxPageSize)
        : 20;
    return {
        page,
        pageSize,
        skip: (page - 1) * pageSize,
        take: pageSize,
    };
}
//# sourceMappingURL=pagination.js.map