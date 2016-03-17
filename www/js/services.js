angular.module('starter.services', [])

    .factory('Common', function () {
        return {
            getColorByRain: function (rain) {
                var color = 'rgba(0,200,0,1)';
                if (rain > 0 && rain < 10) {
                } else if (rain >= 10 && rain < 25) {
                    color = 'rgba(0,128,0,1)';
                } else if (rain >= 25 && rain < 50) {
                    color = 'rgba(99,184,249,1)';
                } else if (rain >= 50 && rain < 100) {
                    color = 'rgba(0,0,254,1)';
                } else if (rain >= 100 && rain < 200) {
                    color = 'rgba(243,5,238,1)';
                } else if (rain >= 200 && rain < 9000) {
                    color = 'rgba(129,0,64,1)';
                }
                return color;
            }
        };
    })
    .factory('Forecast', function () {
        var baseUrl = 'http://222.85.131.129:1081/static/ywptPNG/';
        var forecastHours = [
            { id: 0, display: "000" },
            { id: 3, display: "003" },
            { id: 6, display: "006" },
            { id: 9, display: "009" },
            { id: 12, display: "012" },
            { id: 15, display: "015" },
            { id: 18, display: "018" },
            { id: 21, display: "021" },
            { id: 24, display: "024" },
            { id: 27, display: "027" },
            { id: 30, display: "030" },
            { id: 33, display: "033" },
            { id: 36, display: "036" },
            { id: 39, display: "039" },
            { id: 42, display: "042" },
            { id: 45, display: "045" },
            { id: 48, display: "048" },
            { id: 51, display: "051" },
            { id: 54, display: "054" },
            { id: 57, display: "057" },
            { id: 60, display: "060" },
            { id: 63, display: "063" },
            { id: 66, display: "066" },
            { id: 69, display: "069" },
            { id: 72, display: "072" },
            { id: 78, display: "078" },
            { id: 84, display: "084" },
            { id: 90, display: "090" },
            { id: 96, display: "096" },
            { id: 102, display: "102" },
            { id: 108, display: "108" },
            { id: 114, display: "114" },
            { id: 120, display: "120" },
            { id: 126, display: "126" },
            { id: 132, display: "132" },
            { id: 138, display: "138" },
            { id: 144, display: "144" },
            { id: 150, display: "150" },
            { id: 156, display: "156" },
            { id: 162, display: "162" },
            { id: 168, display: "168" },
            { id: 174, display: "174" },
            { id: 180, display: "180" },
            { id: 186, display: "186" },
            { id: 192, display: "192" },
            { id: 198, display: "198" },
            { id: 204, display: "204" },
            { id: 210, display: "210" },
            { id: 216, display: "216" },
            { id: 222, display: "222" },
            { id: 228, display: "228" },
            { id: 234, display: "234" },
            { id: 240, display: "240" }
        ];
        var ecProductions = [
            { value: '200hPa_T-HGT', name: '200形势场' },
            { value: '500hPa_T-HGT', name: '500形势场' },
            { value: '700hPa_T-RH', name: '700形势场' },
            { value: '850hPa_T-RH', name: '850形势场' },
            { value: 'SUR_MSLP', name: '海平面气压' },
            { value: 'SUR_WIND100', name: '100米风场' },
            { value: 'SUR_WIND10', name: '10米风场' },
            { value: 'SUR_TCC', name: '总云覆盖' },
            { value: 'SUR_LCC', name: '低云覆盖' },
            { value: 'SUR_RAIN24', name: '24小时降水量' },
            { value: 'SUR_RAIN12', name: '12小时降水量' },
            { value: 'SUR_RAIN6', name: '6小时降水量' },
            { value: 'SUR_RAIN3', name: '3小时降水量' },
            { value: 'SUR_TP', name: '总降水量' },
            { value: 'SUR_LSP', name: '大尺度降水量' },
            { value: 'SUR_CP', name: '对流降水量' },
            { value: 'SUR_T2', name: '2米温度' },
            { value: 'SUR_TD2', name: '2米露点' },
            { value: 'SUR_MN2T6', name: 'MN2T6' },
            { value: 'SUR_MX2T6', name: 'MX2T6' },
            { value: 'SUR_CAPE', name: '对流有效位能' },
            { value: '700hPa_QFLUX', name: '700水汽通量' },
            { value: '850hPa_QFLUX', name: '850水汽通量' },
            { value: 'SUR_ZDL', name: '0度层高度' }
        ];
        return {
            /**********Func 1: 获取预报时效数组*********/
            getForecastHours: function () {
                return forecastHours;
            },
            /**********Func 2: 获取预报产品数组*********/
            getEcProductions: function () {
                return ecProductions;
            },
            /**********Func 3: 获取预报起始时间的数组*********/
            getStartDates: function () {
                var startDates = [];
                var dateToday = new Date();
                if (dateToday.getHours() >= 15) {
                    dateToday = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate(), 12);
                } else {
                    dateToday = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate(), 0);
                }
                for (var i = 0; i < 10; i++) {
                    dateToday.AddHours(-12);
                    var a = {
                        name: dateToday.Format('ddhh'),
                        value: dateToday.Format('yyyyMMddhh')
                    }
                    startDates.push(a);
                }
                startDates.reverse();//反转数组
                /* 将数组的最后一个元素放到第一个位置*/
                var last = startDates.pop();
                startDates.unshift(last);
                return startDates;
            },
            /**********Func 3.1: 获取预报起始时间的数组{id,display}*********/
            getDates: function () {
                var dates = [];
                var dateToday = new Date();
                if (dateToday.getHours() >= 15) {
                    dateToday = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate(), 12);
                } else {
                    dateToday = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate(), 0);
                }
                for (var i = 0; i < 10; i++) {
                    dateToday.AddHours(-12);
                    var a = {
                        id: 9 - i,
                        display: dateToday.Format('yyyy-MM-dd hh'),
                        value:dateToday.Format('yyyyMMddhh')
                    }
                    dates.push(a);
                }
                dates.reverse();//反转数组
                return dates;
            },
            /**********Func 4: 获取根据预报起始时间，预报时效和模式名获取预报图片路径*********/
            getImgUrl: function (forecastData) {
                var startDate = forecastData.dateSelected;
                var modal = forecastData.selectedModal;
                var forecastHour = forecastData.hourSelected;
                return baseUrl + startDate.value.substr(0, 4) +
                    '/' + startDate.value.substr(0, 6) +
                    '/' + startDate.value.substr(0, 8) +
                    '/NWP/ECMF_DAM/ECDAM_' + modal.value + '_' + startDate.value + '_' + forecastHour.display + '.png';
            }
        };
    });
