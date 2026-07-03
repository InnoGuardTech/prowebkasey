"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExpenseCategoriesModule", {
    enumerable: true,
    get: function() {
        return ExpenseCategoriesModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _expense_categoryentity = require("../entities/expense_category.entity");
const _expense_categoriesservice = require("./expense_categories.service");
const _expense_categoriescontroller = require("./expense_categories.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ExpenseCategoriesModule = class ExpenseCategoriesModule {
};
ExpenseCategoriesModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _expense_categoryentity.ExpenseCategory
            ])
        ],
        controllers: [
            _expense_categoriescontroller.ExpenseCategoriesController
        ],
        providers: [
            _expense_categoriesservice.ExpenseCategoriesService
        ],
        exports: [
            _expense_categoriesservice.ExpenseCategoriesService
        ]
    })
], ExpenseCategoriesModule);

//# sourceMappingURL=expense_categories.module.js.map