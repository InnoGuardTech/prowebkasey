"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SearchController", {
    enumerable: true,
    get: function() {
        return SearchController;
    }
});
const _common = require("@nestjs/common");
const _passport = require("@nestjs/passport");
const _searchservice = require("./search.service");
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
let SearchController = class SearchController {
    search(query) {
        if (!query || query.length < 2) return {
            trucks: [],
            invoices: [],
            expenses: []
        };
        return this.searchService.globalSearch(query);
    }
    constructor(searchService){
        this.searchService = searchService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Query)('q')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SearchController.prototype, "search", null);
SearchController = _ts_decorate([
    (0, _common.Controller)('api/v1/search'),
    (0, _common.UseGuards)((0, _passport.AuthGuard)('jwt')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _searchservice.SearchService === "undefined" ? Object : _searchservice.SearchService
    ])
], SearchController);

//# sourceMappingURL=search.controller.js.map