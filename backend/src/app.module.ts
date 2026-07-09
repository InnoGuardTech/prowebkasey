import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuditInterceptor } from './audit/audit.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeedService } from './seed.service';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Truck } from './entities/truck.entity';
import { Driver } from './entities/driver.entity';
import { Contractor } from './entities/contractor.entity';
import { Invoice } from './entities/invoice.entity';
import { AuditLog } from './entities/audit_log.entity';
import { Setting } from './entities/setting.entity';
import { Expense } from './entities/expense.entity';
import { ExpenseCategory } from './entities/expense_category.entity';
import { Trip } from './entities/trip.entity';
import { Company } from './entities/company.entity';
import { TrucksModule } from './trucks/trucks.module';
import { DriversModule } from './drivers/drivers.module';
import { ContractorsModule } from './contractors/contractors.module';
import { ExpenseCategoriesModule } from './expense-categories/expense_categories.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ExpensesModule } from './expenses/expenses.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuditModule } from './audit/audit.module';
import { SearchModule } from './search/search.module';
import { UsersModule } from './users/users.module';
import { TripsModule } from './trips/trips.module';
import { SettingsModule } from './settings/settings.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100, // Increased from 10 to 100 to support rapid frontend refreshes
    }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const type = configService.get<string>('DB_TYPE', 'sqlite');
        const dbUrl = configService.get<string>('DB_URL');
        if (type === 'postgres') {
          // Render internal DBs (hostname contains 'dpg-') don't need SSL
          // External DBs (Supabase, Neon, etc.) do need SSL
          const isRenderInternal = dbUrl && dbUrl.includes('dpg-');
          return {
            type: 'postgres',
            ...(dbUrl ? { url: dbUrl } : {
              host: configService.get<string>('DB_HOST', 'localhost'),
              port: configService.get<number>('DB_PORT', 5432),
              username: configService.get<string>('DB_USERNAME', 'postgres'),
              password: configService.get<string>('DB_PASSWORD', 'root'),
              database: configService.get<string>('DB_DATABASE', 'qiyada_db'),
            }),
            ssl: isRenderInternal ? false : (dbUrl ? { rejectUnauthorized: false } : false),
            entities: [User, Company, Truck, Driver, Contractor, Invoice, Expense, ExpenseCategory, AuditLog, Trip, Setting],
            synchronize: true, // Auto-create tables
          };
        } else if (type === 'mysql') {
          return {
            type: 'mysql',
            host: configService.get<string>('DB_HOST', 'localhost'),
            port: configService.get<number>('DB_PORT', 3306),
            username: configService.get<string>('DB_USERNAME', 'root'),
            password: configService.get<string>('DB_PASSWORD', ''),
            database: configService.get<string>('DB_DATABASE', 'qiyada_db'),
            entities: [User, Company, Truck, Driver, Contractor, Invoice, Expense, ExpenseCategory, AuditLog, Trip, Setting],
            synchronize: true, // Auto-create tables (dev only)
          };
        }
        
        // Fallback to SQLite
        return {
          type: 'better-sqlite3' as any,
          database: 'database.sqlite',
          entities: [User, Company, Truck, Driver, Contractor, Invoice, Expense, ExpenseCategory, AuditLog, Trip, Setting],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    TrucksModule,
    DriversModule,
    ContractorsModule,
    ExpenseCategoriesModule,
    InvoicesModule,
    ExpensesModule,
    DashboardModule,
    AuditModule,
    SearchModule,
    UsersModule,
    TripsModule,
    SettingsModule,
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeedService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
