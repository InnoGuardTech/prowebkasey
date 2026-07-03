import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(query: string): Promise<{
        trucks: {
            type: string;
            id: string;
            label: string;
            sub: string;
        }[];
        invoices: {
            type: string;
            id: string;
            label: string;
            sub: string;
        }[];
        expenses: {
            type: string;
            id: string;
            label: string;
            sub: string;
        }[];
    }> | {
        trucks: never[];
        invoices: never[];
        expenses: never[];
    };
}
