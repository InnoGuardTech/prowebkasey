"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _tripscontroller = require("./trips.controller");
describe('TripsController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _tripscontroller.TripsController
            ]
        }).compile();
        controller = module.get(_tripscontroller.TripsController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=trips.controller.spec.js.map