"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _config = require("@nestjs/config");
const _throttler = require("@nestjs/throttler");
const _auditinterceptor = require("./audit/audit.interceptor");
const _typeorm = require("@nestjs/typeorm");
const _appcontroller = require("./app.controller");
const _appservice = require("./app.service");
const _seedservice = require("./seed.service");
const _authmodule = require("./auth/auth.module");
const _userentity = require("./entities/user.entity");
const _truckentity = require("./entities/truck.entity");
const _driverentity = require("./entities/driver.entity");
const _contractorentity = require("./entities/contractor.entity");
const _invoiceentity = require("./entities/invoice.entity");
const _expenseentity = require("./entities/expense.entity");
const _settingentity = require("./entities/setting.entity");
const _expense_categoryentity = require("./entities/expense_category.entity");
const _tripentity = require("./entities/trip.entity");
const _trucksmodule = require("./trucks/trucks.module");
const _driversmodule = require("./drivers/drivers.module");
const _contractorsmodule = require("./contractors/contractors.module");
const _expense_categoriesmodule = require("./expense-categories/expense_categories.module");
const _invoicesmodule = require("./invoices/invoices.module");
const _expensesmodule = require("./expenses/expenses.module");
const _dashboardmodule = require("./dashboard/dashboard.module");
const _auditmodule = require("./audit/audit.module");
const _audit_logentity = require("./entities/audit_log.entity");
const _searchmodule = require("./search/search.module");
const _usersmodule = require("./users/users.module");
const _tripsmodule = require("./trips/trips.module");
const _settingsmodule = require("./settings/settings.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot({
                isGlobal: true
            }),
            _throttler.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10
                }
            ]),
            _typeorm.TypeOrmModule.forRootAsync({
                imports: [
                    _config.ConfigModule
                ],
                useFactory: (configService)=>{
                    const type = configService.get('DB_TYPE', 'sqlite');
                    if (type === 'postgres') {
                        return {
                            type: 'postgres',
                            url: configService.get('DB_URL'),
                            host: configService.get('DB_HOST', 'localhost'),
                            port: configService.get('DB_PORT', 5432),
                            username: configService.get('DB_USERNAME', 'postgres'),
                            password: configService.get('DB_PASSWORD', 'root'),
                            database: configService.get('DB_DATABASE', 'prokasey_db'),
                            ssl: configService.get('DB_URL') ? {
                                rejectUnauthorized: false
                            } : false,
                            entities: [
                                _userentity.User,
                                _truckentity.Truck,
                                _driverentity.Driver,
                                _contractorentity.Contractor,
                                _invoiceentity.Invoice,
                                _expenseentity.Expense,
                                _expense_categoryentity.ExpenseCategory,
                                _audit_logentity.AuditLog,
                                _tripentity.Trip,
                                _settingentity.Setting
                            ],
                            synchronize: true
                        };
                    } else if (type === 'mysql') {
                        return {
                            type: 'mysql',
                            host: configService.get('DB_HOST', 'localhost'),
                            port: configService.get('DB_PORT', 3306),
                            username: configService.get('DB_USERNAME', 'root'),
                            password: configService.get('DB_PASSWORD', ''),
                            database: configService.get('DB_DATABASE', 'prokasey_db'),
                            entities: [
                                _userentity.User,
                                _truckentity.Truck,
                                _driverentity.Driver,
                                _contractorentity.Contractor,
                                _invoiceentity.Invoice,
                                _expenseentity.Expense,
                                _expense_categoryentity.ExpenseCategory,
                                _audit_logentity.AuditLog,
                                _tripentity.Trip,
                                _settingentity.Setting
                            ],
                            synchronize: true
                        };
                    }
                    // Fallback to SQLite
                    return {
                        type: 'better-sqlite3',
                        database: 'database.sqlite',
                        entities: [
                            _userentity.User,
                            _truckentity.Truck,
                            _driverentity.Driver,
                            _contractorentity.Contractor,
                            _invoiceentity.Invoice,
                            _expenseentity.Expense,
                            _expense_categoryentity.ExpenseCategory,
                            _audit_logentity.AuditLog,
                            _tripentity.Trip,
                            _settingentity.Setting
                        ],
                        synchronize: true
                    };
                },
                inject: [
                    _config.ConfigService
                ]
            }),
            _typeorm.TypeOrmModule.forFeature([
                _userentity.User
            ]),
            _authmodule.AuthModule,
            _trucksmodule.TrucksModule,
            _driversmodule.DriversModule,
            _contractorsmodule.ContractorsModule,
            _expense_categoriesmodule.ExpenseCategoriesModule,
            _invoicesmodule.InvoicesModule,
            _expensesmodule.ExpensesModule,
            _dashboardmodule.DashboardModule,
            _auditmodule.AuditModule,
            _searchmodule.SearchModule,
            _usersmodule.UsersModule,
            _tripsmodule.TripsModule,
            _settingsmodule.SettingsModule
        ],
        controllers: [
            _appcontroller.AppController
        ],
        providers: [
            _appservice.AppService,
            _seedservice.SeedService,
            {
                provide: _core.APP_INTERCEPTOR,
                useClass: _auditinterceptor.AuditInterceptor
            },
            {
                provide: _core.APP_GUARD,
                useClass: _throttler.ThrottlerGuard
            }
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map