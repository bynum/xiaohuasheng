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
        var forecastHours=[
            { name: "24", value: "024" },
            { name: "27", value: "027" },
            { name: "30", value: "030" },
            { name: "33", value: "033" },
            { name: "36", value: "036" },
            { name: "39", value: "039" },
            { name: "42", value: "042" },
            { name: "45", value: "045" },
            { name: "48", value: "048" },
            { name: "51", value: "051" },
            { name: "54", value: "054" },
            { name: "57", value: "057" },
            { name: "60", value: "060" },
            { name: "63", value: "063" },
            { name: "66", value: "066" },
            { name: "69", value: "069" },
            { name: "72", value: "072" },
            { name: "0", value: "000" },
            { name: "3", value: "003" },
            { name: "6", value: "006" },
            { name: "9", value: "009" },
            { name: "12", value: "012" },
            { name: "15", value: "015" },
            { name: "18", value: "018" },
            { name: "21", value: "021" }
        ];
        var ecProductions=[
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
            getForecastHours: function() {
                return forecastHours;
            },
            /**********Func 2: 获取预报产品数组*********/
            getEcProductions:function() {
                return ecProductions;
            },
            /**********Func 3: 获取预报起始时间的数组*********/
            getStartDates:function() {
                var startDates=[];
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
           var last =startDates.pop();
           startDates.unshift(last);
            return startDates;
            },
            /**********Func 4: 获取根据预报起始时间，预报时效和模式名获取预报图片路径*********/
            getImgUrl:function(forecastData) {
                var startDate=forecastData.selectedStartDate;
                var modal=forecastData.selectedModal;
                var forecastHour=forecastData.selectedForecastHour;
            return baseUrl + startDate.value.substr(0, 4) +
                '/' + startDate.value.substr(0, 6) +
                '/' + startDate.value.substr(0, 8) +
                '/NWP/ECMF_DAM/ECDAM_' + modal.value + '_' + startDate.value + '_' + forecastHour.value + '.png';
        }
        };
    });
