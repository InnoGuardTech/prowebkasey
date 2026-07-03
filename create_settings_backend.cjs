const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'backend', 'src');

// 1. Create Setting Entity
const entityDir = path.join(srcDir, 'entities');
fs.writeFileSync(path.join(entityDir, 'setting.entity.ts'), `
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryColumn({ length: 100 })
  key: string;

  @Column('text')
  value: string;
}
`);

// 2. Create Settings Module
const settingsDir = path.join(srcDir, 'settings');
if (!fs.existsSync(settingsDir)) fs.mkdirSync(settingsDir);

fs.writeFileSync(path.join(settingsDir, 'settings.service.ts'), `
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) {}

  async findAll() {
    const settings = await this.settingsRepository.find();
    const result = {};
    settings.forEach(s => result[s.key] = s.value);
    return result;
  }

  async update(key: string, value: string) {
    const setting = new Setting();
    setting.key = key;
    setting.value = value;
    await this.settingsRepository.save(setting);
    return setting;
  }
}
`);

fs.writeFileSync(path.join(settingsDir, 'settings.controller.ts'), `
import { Controller, Get, Post, Body, UseGuards, Res } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Response } from 'express';
import * as path from 'path';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('api/v1/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Post()
  @Roles('admin')
  update(@Body() body: { key: string; value: string }) {
    return this.settingsService.update(body.key, body.value);
  }

  @Get('backup')
  @Roles('admin')
  downloadBackup(@Res() res: Response) {
    // The database file is at the root of the backend folder or project root
    // depending on where typeorm runs. Let's assume it's database.sqlite in prokasey root.
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    res.download(dbPath, \`prokasey_backup_\${new Date().toISOString().split('T')[0]}.sqlite\`);
  }
}
`);

fs.writeFileSync(path.join(settingsDir, 'settings.module.ts'), `
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { Setting } from '../entities/setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
`);

console.log('Backend Settings Module Created!');
