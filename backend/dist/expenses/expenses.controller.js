"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExpensesController", {
    enumerable: true,
    get: function() {
        return ExpensesController;
    }
});
const _common = require("@nestjs/common");
const _expensesservice = require("./expenses.service");
const _passport = require("@nestjs/passport");
const _rolesguard = require("../auth/roles.guard");
const _rolesdecorator = require("../auth/roles.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ExpensesController = class ExpensesController {
    findAll(req, page = '1', limit = '20') {
        return this.expensesService.findAll(req.user?.role, req.user?.userId, Number(page), Number(limit));
    }
    findOne(id) {
        return this.expensesService.findOne(id);
    }
    create(createExpenseDto, req) {
        return this.expensesService.create(createExpenseDto, req.user?.userId);
    }
    update(id, updateExpenseDto) {
        return this.expensesService.update(id, updateExpenseDto);
    }
    approve(id, req) {
        return this.expensesService.approve(id, req.user.id);
    }
    reject(id, reason) {
        return this.expensesService.reject(id, reason);
    }
    remove(id) {
        return this.expensesService.remove(id);
    }
    constructor(expensesService){
        this.expensesService = expensesService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Query)('page')),
    _ts_param(2, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ExpensesController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ExpensesController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Partial === "undefined" ? Object : Partial,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], ExpensesController.prototype, "create", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    (0, _rolesdecorator.Roles)('admin', 'accountant'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof Partial === "undefined" ? Object : Partial
    ]),
    _ts_metadata("design:returntype", void 0)
], ExpensesController.prototype, "update", null);
_ts_decorate([
    (0, _common.Post)(':id/approve'),
    (0, _rolesdecorator.Roles)('admin', 'accountant', 'manager'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], ExpensesController.prototype, "approve", null);
_ts_decorate([
    (0, _common.Post)(':id/reject'),
    (0, _rolesdecorator.Roles)('admin', 'accountant', 'manager'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)('reason')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ExpensesController.prototype, "reject", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _rolesdecorator.Roles)('admin'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ExpensesController.prototype, "remove", null);
ExpensesController = _ts_decorate([
    (0, _common.UseGuards)((0, _passport.AuthGuard)('jwt'), _rolesguard.RolesGuard),
    (0, _common.Controller)('api/v1/expenses'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _expensesservice.ExpensesService === "undefined" ? Object : _expensesservice.ExpensesService
    ])
], ExpensesController);

//# sourceMappingURL=expenses.controller.js.map