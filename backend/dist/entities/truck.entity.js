"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Truck = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const invoice_entity_1 = require("./invoice.entity");
const expense_entity_1 = require("./expense.entity");
let Truck = class Truck {
    id;
    truck_number;
    driver_id;
    driver;
    status;
    operation_date;
    notes;
    is_deleted;
    registration_expiry;
    insurance_expiry;
    inspection_expiry;
    created_at;
    updated_at;
    invoices;
    expenses;
};
exports.Truck = Truck;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Truck.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, unique: true }),
    __metadata("design:type", String)
], Truck.prototype, "truck_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'driver_id', nullable: true }),
    __metadata("design:type", String)
], Truck.prototype, "driver_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.trucks, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", user_entity_1.User)
], Truck.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'inactive' }),
    __metadata("design:type", String)
], Truck.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Truck.prototype, "operation_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Truck.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Truck.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Truck.prototype, "registration_expiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Truck.prototype, "insurance_expiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Truck.prototype, "inspection_expiry", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Truck.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Truck.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoice_entity_1.Invoice, invoice => invoice.truck),
    __metadata("design:type", Array)
], Truck.prototype, "invoices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => expense_entity_1.Expense, expense => expense.truck),
    __metadata("design:type", Array)
], Truck.prototype, "expenses", void 0);
exports.Truck = Truck = __decorate([
    (0, typeorm_1.Entity)('trucks')
], Truck);
//# sourceMappingURL=truck.entity.js.map