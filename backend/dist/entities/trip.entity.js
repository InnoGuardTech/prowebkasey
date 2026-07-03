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
exports.Trip = void 0;
const typeorm_1 = require("typeorm");
const truck_entity_1 = require("./truck.entity");
const user_entity_1 = require("./user.entity");
const invoice_entity_1 = require("./invoice.entity");
const expense_entity_1 = require("./expense.entity");
let Trip = class Trip {
    id;
    trip_number;
    truck_id;
    truck;
    driver_id;
    driver;
    start_date;
    end_date;
    status;
    route;
    notes;
    created_at;
    updated_at;
    invoices;
    expenses;
};
exports.Trip = Trip;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Trip.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Trip.prototype, "trip_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'truck_id' }),
    __metadata("design:type", String)
], Trip.prototype, "truck_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => truck_entity_1.Truck),
    (0, typeorm_1.JoinColumn)({ name: 'truck_id' }),
    __metadata("design:type", truck_entity_1.Truck)
], Trip.prototype, "truck", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'driver_id', nullable: true }),
    __metadata("design:type", String)
], Trip.prototype, "driver_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", user_entity_1.User)
], Trip.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Trip.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Trip.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: 'active' }),
    __metadata("design:type", String)
], Trip.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Trip.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Trip.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Trip.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Trip.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoice_entity_1.Invoice, invoice => invoice.trip),
    __metadata("design:type", Array)
], Trip.prototype, "invoices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => expense_entity_1.Expense, expense => expense.trip),
    __metadata("design:type", Array)
], Trip.prototype, "expenses", void 0);
exports.Trip = Trip = __decorate([
    (0, typeorm_1.Entity)('trips')
], Trip);
//# sourceMappingURL=trip.entity.js.map