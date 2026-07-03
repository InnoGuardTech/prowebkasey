import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource
  ) {}

  @Get()
  async getHello() {
    try {
      // Query the database to keep it awake
      await this.dataSource.query('SELECT 1');
      return { status: 'awake', message: 'Backend and Database are fully awake and active!' };
    } catch (e) {
      return { status: 'error', message: 'Database is sleeping or unavailable.' };
    }
  }
}
