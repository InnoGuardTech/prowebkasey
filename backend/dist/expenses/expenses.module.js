"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExpensesModule", {
    enumerable: true,
    get: function() {
        return ExpensesModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _expenseentity = require("../entities/expense.entity");
const _expensesservice = require("./expenses.service");
const _expensescontroller = require("./expenses.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ExpensesModule = class ExpensesModule {
};
ExpensesModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _expenseentity.Expense
            ])
        ],
        controllers: [
            _expensescontroller.ExpensesController
        ],
        providers: [
            _expensesservice.ExpensesService
        ],
        exports: [
            _expensesservice.ExpensesService
        ]
    })
], ExpensesModule);

//# sourceMappingURL=expenses.module.js.map