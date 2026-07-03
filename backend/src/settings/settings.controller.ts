
import { Controller, Get, Post, Body, UseGuards, Res } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { DataSource } from 'typeorm';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('api/v1/settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly dataSource: DataSource
  ) {}

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Post()
  @Roles('admin', 'manager', 'owner')
  update(@Body() body: { key: string; value: string }) {
    return this.settingsService.update(body.key, body.value);
  }

  @Get('backup')
  @Roles('admin', 'manager', 'owner')
  async downloadBackup(@Res() res: Response) {
    try {
      const entities = this.dataSource.entityMetadatas;
      const backupData: Record<string, any[]> = {};
      
      for (const entity of entities) {
        const repo = this.dataSource.getRepository(entity.name);
        const data = await repo.find();
        backupData[entity.tableName] = data;
      }
      
      const fileName = `prokasey_backup_${new Date().toISOString().split('T')[0]}.json`;
      const filePath = path.join(process.cwd(), fileName);
      fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
      
      return res.download(filePath, fileName, (err) => {
        if (!err) fs.unlinkSync(filePath);
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'فشل في إنشاء النسخة الاحتياطية' });
    }
  }
}
