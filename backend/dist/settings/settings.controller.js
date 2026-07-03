"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SettingsController", {
    enumerable: true,
    get: function() {
        return SettingsController;
    }
});
const _common = require("@nestjs/common");
const _settingsservice = require("./settings.service");
const _passport = require("@nestjs/passport");
const _rolesguard = require("../auth/roles.guard");
const _rolesdecorator = require("../auth/roles.decorator");
const _path = /*#__PURE__*/ _interop_require_wildcard(require("path"));
const _fs = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
const _typeorm = require("typeorm");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
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
let SettingsController = class SettingsController {
    findAll() {
        return this.settingsService.findAll();
    }
    update(body) {
        return this.settingsService.update(body.key, body.value);
    }
    async downloadBackup(res) {
        try {
            const entities = this.dataSource.entityMetadatas;
            const backupData = {};
            for (const entity of entities){
                const repo = this.dataSource.getRepository(entity.name);
                const data = await repo.find();
                backupData[entity.tableName] = data;
            }
            const fileName = `prokasey_backup_${new Date().toISOString().split('T')[0]}.json`;
            const filePath = _path.join(process.cwd(), fileName);
            _fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
            return res.download(filePath, fileName, (err)=>{
                if (!err) _fs.unlinkSync(filePath);
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                message: 'فشل في إنشاء النسخة الاحتياطية'
            });
        }
    }
    constructor(settingsService, dataSource){
        this.settingsService = settingsService;
        this.dataSource = dataSource;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], SettingsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _rolesdecorator.Roles)('admin', 'manager', 'owner'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], SettingsController.prototype, "update", null);
_ts_decorate([
    (0, _common.Get)('backup'),
    (0, _rolesdecorator.Roles)('admin', 'manager', 'owner'),
    _ts_param(0, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Response === "undefined" ? Object : Response
    ]),
    _ts_metadata("design:returntype", Promise)
], SettingsController.prototype, "downloadBackup", null);
SettingsController = _ts_decorate([
    (0, _common.UseGuards)((0, _passport.AuthGuard)('jwt'), _rolesguard.RolesGuard),
    (0, _common.Controller)('api/v1/settings'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _settingsservice.SettingsService === "undefined" ? Object : _settingsservice.SettingsService,
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource
    ])
], SettingsController);

//# sourceMappingURL=settings.controller.js.map