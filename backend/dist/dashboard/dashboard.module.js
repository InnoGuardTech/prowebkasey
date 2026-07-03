"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DashboardModule", {
    enumerable: true,
    get: function() {
        return DashboardModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _invoiceentity = require("../entities/invoice.entity");
const _expenseentity = require("../entities/expense.entity");
const _truckentity = require("../entities/truck.entity");
const _driverentity = require("../entities/driver.entity");
const _dashboardservice = require("./dashboard.service");
const _dashboardcontroller = require("./dashboard.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let DashboardModule = class DashboardModule {
};
DashboardModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _invoiceentity.Invoice,
                _expenseentity.Expense,
                _truckentity.Truck,
                _driverentity.Driver
            ])
        ],
        controllers: [
            _dashboardcontroller.DashboardController
        ],
        providers: [
            _dashboardservice.DashboardService
        ]
    })
], DashboardModule);

//# sourceMappingURL=dashboard.module.js.map