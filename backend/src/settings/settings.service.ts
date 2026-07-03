
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
