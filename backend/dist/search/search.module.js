"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SearchModule", {
    enumerable: true,
    get: function() {
        return SearchModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _invoiceentity = require("../entities/invoice.entity");
const _expenseentity = require("../entities/expense.entity");
const _truckentity = require("../entities/truck.entity");
const _searchservice = require("./search.service");
const _searchcontroller = require("./search.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let SearchModule = class SearchModule {
};
SearchModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _invoiceentity.Invoice,
                _expenseentity.Expense,
                _truckentity.Truck
            ])
        ],
        controllers: [
            _searchcontroller.SearchController
        ],
        providers: [
            _searchservice.SearchService
        ]
    })
], SearchModule);

//# sourceMappingURL=search.module.js.map