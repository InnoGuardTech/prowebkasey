"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Setting", {
    enumerable: true,
    get: function() {
        return Setting;
    }
});
const _typeorm = require("typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Setting = class Setting {
};
_ts_decorate([
    (0, _typeorm.PrimaryColumn)({
        length: 100
    }),
    _ts_metadata("design:type", String)
], Setting.prototype, "key", void 0);
_ts_decorate([
    (0, _typeorm.Column)('text'),
    _ts_metadata("design:type", String)
], Setting.prototype, "value", void 0);
Setting = _ts_decorate([
    (0, _typeorm.Entity)('settings')
], Setting);

//# sourceMappingURL=setting.entity.js.map