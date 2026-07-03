"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExpenseCategory", {
    enumerable: true,
    get: function() {
        return ExpenseCategory;
    }
});
const _typeorm = require("typeorm");
const _expenseentity = require("./expense.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ExpenseCategory = class ExpenseCategory {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], ExpenseCategory.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 100
    }),
    _ts_metadata("design:type", String)
], ExpenseCategory.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ExpenseCategory.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 7,
        default: '#999999'
    }),
    _ts_metadata("design:type", String)
], ExpenseCategory.prototype, "color", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'int',
        default: 0
    }),
    _ts_metadata("design:type", Number)
], ExpenseCategory.prototype, "sort_order", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], ExpenseCategory.prototype, "is_active", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ExpenseCategory.prototype, "created_at", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_expenseentity.Expense, (expense)=>expense.category),
    _ts_metadata("design:type", Array)
], ExpenseCategory.prototype, "expenses", void 0);
ExpenseCategory = _ts_decorate([
    (0, _typeorm.Entity)('expense_categories')
], ExpenseCategory);

//# sourceMappingURL=expense_category.entity.js.map