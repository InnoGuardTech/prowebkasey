import { AppService } from './app.service';
import { DataSource } from 'typeorm';
export declare class AppController {
    private readonly appService;
    private readonly dataSource;
    constructor(appService: AppService, dataSource: DataSource);
    getHello(): Promise<{
        status: string;
        message: string;
    }>;
}
