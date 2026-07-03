"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _tripsservice = require("./trips.service");
describe('TripsService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _tripsservice.TripsService
            ]
        }).compile();
        service = module.get(_tripsservice.TripsService);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
});

//# sourceMappingURL=trips.service.spec.js.map