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
    });
