"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmStatsComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts/highcharts");
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/no-data-to-display')(Highcharts);
var CrmStatsComponent = /** @class */ (function () {
    function CrmStatsComponent(_authService, _crmService) {
        var _this = this;
        this._crmService = _crmService;
        this.subscriptions = [];
        this.loadingStats = false;
        this.render = false;
        //Browsers
        this.browsers = [
            { key: 'chrome-colored' },
            { key: 'uc-colored' },
            { key: 'firefox-colored' },
            { key: 'maxthon-colored' },
            { key: 'explorer-colored' },
            { key: 'opera-colored' },
            { key: 'safari-colored' },
            { key: 'edge-colored' },
            { key: 'browser-colored' }
        ];
        this.browser_data = [];
        //Devices
        this.devices = [
            { key: 'windows-colored' },
            { key: 'apple-colored' },
            { key: 'android-colored' }
        ];
        this.device_data = [];
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
        this.subscriptions.push(_crmService.loadingStats.subscribe(function (data) {
            _this.loadingStats = data;
        }));
        this.subscriptions.push(_crmService.customerStats.subscribe(function (data) {
            _this.customerStats = data;
            if (Object.keys(_this.customerStats).length) {
                _this.browser_data = [];
                _this.device_data = [];
                _this.customerStats.browsers.forEach(function (element) {
                    if (_this.browser_data.filter(function (b) { return b.key.toLowerCase().includes(element.name.toLowerCase()) || element.name.toLowerCase().includes(b.key.toLowerCase()); }).length && _this.browser_data.length) {
                        _this.browser_data.filter(function (b) { return b.key.toLowerCase().includes(element.name.toLowerCase()) || element.name.toLowerCase().includes(b.key.toLowerCase()); })[0].count += element.count;
                    }
                    else {
                        _this.browser_data.push({
                            'key': (_this.browsers.filter(function (b) { return b.key.toLowerCase().includes(element.name.toLowerCase()); }).length) ? _this.browsers.filter(function (b) { return b.key.toLowerCase().includes(element.name.toLowerCase()); })[0].key : 'other',
                            'count': element.count
                        });
                    }
                });
                _this.customerStats.os.forEach(function (element) {
                    if (_this.device_data.filter(function (b) { return b.key.toLowerCase().includes(element.name.toLowerCase()) || element.name.toLowerCase().includes(b.key.toLowerCase()); }).length && _this.browser_data.length) {
                        _this.device_data.filter(function (b) { return b.key.toLowerCase().includes(element.name.toLowerCase()) || element.name.toLowerCase().includes(b.key.toLowerCase()); })[0].count += element.count;
                    }
                    else {
                        _this.device_data.push({
                            'key': (_this.devices.filter(function (b) { return b.key.toLowerCase().includes(element.name.toLowerCase()); }).length) ? _this.devices.filter(function (b) { return b.key.toLowerCase().includes(element.name.toLowerCase()); })[0].key : 'other',
                            'count': element.count
                        });
                    }
                });
            }
        }));
        this.subscriptions.push(_crmService.selectedCustomer.subscribe(function (data) {
            if (data)
                _this.selectedCustomer = data;
        }));
    }
    CrmStatsComponent.prototype.ngOnInit = function () {
        // this._crmService.GetCustomerStatistics(this.agent.csid, this.selectedCustomer.deviceID).subscribe(response => {
        // 	if(response.status == 200){
        // 		this.customerStats = response.json();
        // 		console.log(this.customerStats);
        // 	}
        // });
    };
    //helpers
    CrmStatsComponent.prototype.time_convert = function (num) {
        num = Math.round(num);
        var hours = Math.floor(num / 60);
        var minutes = num % 60;
        var str = (hours) ? hours + " hrs " : '';
        (minutes) ? str += minutes + ' mins' : '';
        return (str) ? str : 'No sessions';
    };
    CrmStatsComponent.prototype.FormatURL = function (url) {
        try {
            // console.log(url);
            return (new URL(url).protocol + '//' + new URL(url).hostname);
        }
        catch (e) {
            return url;
        }
    };
    CrmStatsComponent = __decorate([
        core_1.Component({
            selector: 'app-crm-stats',
            templateUrl: './crm-stats.component.html',
            styleUrls: ['./crm-stats.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], CrmStatsComponent);
    return CrmStatsComponent;
}());
exports.CrmStatsComponent = CrmStatsComponent;
//# sourceMappingURL=crm-stats.component.js.map