"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExpenseCategoriesController", {
    enumerable: true,
    get: function() {
        return ExpenseCategoriesController;
    }
});
const _common = require("@nestjs/common");
const _passport = require("@nestjs/passport");
const _expense_categoriesservice = require("./expense_categories.service");
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
let ExpenseCategoriesController = class ExpenseCategoriesController {
    findAll() {
        return this.categoriesService.findAll();
    }
    findOne(id) {
        return this.categoriesService.findOne(id);
    }
    create(categoryData) {
        return this.categoriesService.create(categoryData);
    }
    update(id, categoryData) {
        return this.categoriesService.update(id, categoryData);
    }
    remove(id) {
        return this.categoriesService.update(id, {
            is_active: false
        });
    }
    constructor(categoriesService){
        this.categoriesService = categoriesService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ExpenseCategoriesController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ExpenseCategoriesController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Partial === "undefined" ? Object : Partial
    ]),
    _ts_metadata("design:returntype", void 0)
], ExpenseCategoriesController.prototype, "create", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof Partial === "undefined" ? Object : Partial
    ]),
    _ts_metadata("design:returntype", void 0)
], ExpenseCategoriesController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ExpenseCategoriesController.prototype, "remove", null);
ExpenseCategoriesController = _ts_decorate([
    (0, _common.Controller)('api/v1/expenses/categories'),
    (0, _common.UseGuards)((0, _passport.AuthGuard)('jwt')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _expense_categoriesservice.ExpenseCategoriesService === "undefined" ? Object : _expense_categoriesservice.ExpenseCategoriesService
    ])
], ExpenseCategoriesController);

//# sourceMappingURL=expense_categories.controller.js.map