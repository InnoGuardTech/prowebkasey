"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const audit_interceptor_1 = require("./audit/audit.interceptor");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const seed_service_1 = require("./seed.service");
const auth_module_1 = require("./auth/auth.module");
const user_entity_1 = require("./entities/user.entity");
const truck_entity_1 = require("./entities/truck.entity");
const driver_entity_1 = require("./entities/driver.entity");
const contractor_entity_1 = require("./entities/contractor.entity");
const invoice_entity_1 = require("./entities/invoice.entity");
const audit_log_entity_1 = require("./entities/audit_log.entity");
const setting_entity_1 = require("./entities/setting.entity");
const expense_entity_1 = require("./entities/expense.entity");
const expense_category_entity_1 = require("./entities/expense_category.entity");
const trip_entity_1 = require("./entities/trip.entity");
const company_entity_1 = require("./entities/company.entity");
const trucks_module_1 = require("./trucks/trucks.module");
const drivers_module_1 = require("./drivers/drivers.module");
const contractors_module_1 = require("./contractors/contractors.module");
const expense_categories_module_1 = require("./expense-categories/expense_categories.module");
const invoices_module_1 = require("./invoices/invoices.module");
const expenses_module_1 = require("./expenses/expenses.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const audit_module_1 = require("./audit/audit.module");
const search_module_1 = require("./search/search.module");
const users_module_1 = require("./users/users.module");
const trips_module_1 = require("./trips/trips.module");
const settings_module_1 = require("./settings/settings.module");
const companies_module_1 = require("./companies/companies.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const type = configService.get('DB_TYPE', 'sqlite');
                    const dbUrl = configService.get('DB_URL');
                    if (type === 'postgres') {
                        const isRenderInternal = dbUrl && dbUrl.includes('dpg-');
                        return {
                            type: 'postgres',
                            ...(dbUrl ? { url: dbUrl } : {
                                host: configService.get('DB_HOST', 'localhost'),
                                port: configService.get('DB_PORT', 5432),
                                username: configService.get('DB_USERNAME', 'postgres'),
                                password: configService.get('DB_PASSWORD', 'root'),
                                database: configService.get('DB_DATABASE', 'qiyada_db'),
                            }),
                            ssl: isRenderInternal ? false : (dbUrl ? { rejectUnauthorized: false } : false),
                            entities: [user_entity_1.User, company_entity_1.Company, truck_entity_1.Truck, driver_entity_1.Driver, contractor_entity_1.Contractor, invoice_entity_1.Invoice, expense_entity_1.Expense, expense_category_entity_1.ExpenseCategory, audit_log_entity_1.AuditLog, trip_entity_1.Trip, setting_entity_1.Setting],
                            synchronize: true,
                        };
                    }
                    else if (type === 'mysql') {
                        return {
                            type: 'mysql',
                            host: configService.get('DB_HOST', 'localhost'),
                            port: configService.get('DB_PORT', 3306),
                            username: configService.get('DB_USERNAME', 'root'),
                            password: configService.get('DB_PASSWORD', ''),
                            database: configService.get('DB_DATABASE', 'qiyada_db'),
                            entities: [user_entity_1.User, company_entity_1.Company, truck_entity_1.Truck, driver_entity_1.Driver, contractor_entity_1.Contractor, invoice_entity_1.Invoice, expense_entity_1.Expense, expense_category_entity_1.ExpenseCategory, audit_log_entity_1.AuditLog, trip_entity_1.Trip, setting_entity_1.Setting],
                            synchronize: true,
                        };
                    }
                    return {
                        type: 'better-sqlite3',
                        database: 'database.sqlite',
                        entities: [user_entity_1.User, company_entity_1.Company, truck_entity_1.Truck, driver_entity_1.Driver, contractor_entity_1.Contractor, invoice_entity_1.Invoice, expense_entity_1.Expense, expense_category_entity_1.ExpenseCategory, audit_log_entity_1.AuditLog, trip_entity_1.Trip, setting_entity_1.Setting],
                        synchronize: true,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            auth_module_1.AuthModule,
            trucks_module_1.TrucksModule,
            drivers_module_1.DriversModule,
            contractors_module_1.ContractorsModule,
            expense_categories_module_1.ExpenseCategoriesModule,
            invoices_module_1.InvoicesModule,
            expenses_module_1.ExpensesModule,
            dashboard_module_1.DashboardModule,
            audit_module_1.AuditModule,
            search_module_1.SearchModule,
            users_module_1.UsersModule,
            trips_module_1.TripsModule,
            settings_module_1.SettingsModule,
            companies_module_1.CompaniesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            seed_service_1.SeedService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_interceptor_1.AuditInterceptor,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            }
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map