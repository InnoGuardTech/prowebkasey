"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Expense", {
    enumerable: true,
    get: function() {
        return Expense;
    }
});
const _typeorm = require("typeorm");
const _truckentity = require("./truck.entity");
const _expense_categoryentity = require("./expense_category.entity");
const _userentity = require("./user.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Expense = class Expense {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], Expense.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'truck_id',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Expense.prototype, "truck_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_truckentity.Truck, (truck)=>truck.expenses, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'truck_id'
    }),
    _ts_metadata("design:type", typeof _truckentity.Truck === "undefined" ? Object : _truckentity.Truck)
], Expense.prototype, "truck", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'trip_id',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Expense.prototype, "trip_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)('Trip', 'expenses', {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'trip_id'
    }),
    _ts_metadata("design:type", Object)
], Expense.prototype, "trip", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'category_id',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Expense.prototype, "category_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_expense_categoryentity.ExpenseCategory, (category)=>category.expenses, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'category_id'
    }),
    _ts_metadata("design:type", typeof _expense_categoryentity.ExpenseCategory === "undefined" ? Object : _expense_categoryentity.ExpenseCategory)
], Expense.prototype, "category", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'decimal',
        precision: 12,
        scale: 2
    }),
    _ts_metadata("design:type", Number)
], Expense.prototype, "amount", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'date'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Expense.prototype, "expense_date", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Expense.prototype, "notes", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 1000,
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Expense.prototype, "attachment_url", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], Expense.prototype, "is_approved", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, (user)=>user.approved_expenses, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'approved_by'
    }),
    _ts_metadata("design:type", typeof _userentity.User === "undefined" ? Object : _userentity.User)
], Expense.prototype, "approver", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'datetime',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Expense.prototype, "approved_at", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Expense.prototype, "rejection_reason", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, (user)=>user.created_expenses, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'created_by'
    }),
    _ts_metadata("design:type", typeof _userentity.User === "undefined" ? Object : _userentity.User)
], Expense.prototype, "creator", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], Expense.prototype, "is_deleted", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'datetime',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Expense.prototype, "deleted_at", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Expense.prototype, "created_at", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Expense.prototype, "updated_at", void 0);
Expense = _ts_decorate([
    (0, _typeorm.Entity)('expenses')
], Expense);

//# sourceMappingURL=expense.entity.js.map