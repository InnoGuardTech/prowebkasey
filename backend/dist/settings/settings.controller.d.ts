import { SettingsService } from './settings.service';
import type { Response } from 'express';
import { DataSource } from 'typeorm';
export declare class SettingsController {
    private readonly settingsService;
    private readonly dataSource;
    constructor(settingsService: SettingsService, dataSource: DataSource);
    findAll(): Promise<{}>;
    update(body: {
        key: string;
        value: string;
    }): Promise<import("../entities/setting.entity").Setting>;
    downloadBackup(res: Response): Promise<void | Response<any, Record<string, any>>>;
}
