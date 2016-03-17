
angular.module('starter', ['ionic', 'starter.controllers','starter.services', 'ionic-datepicker', 'ionic-timepicker','ionic-sidetabs','ionic-pullup','aCarousel'])

    .run(function ($ionicPlatform,$ionicHistory) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
        $ionicPlatform.registerBackButtonAction(function () {
            if($ionicHistory.currentStateName()=='app.loginpage'||$ionicHistory.currentStateName()=='app.mainpage'){
                ionic.Platform.exitApp();
            }else{
                $ionicHistory.goBack();
            }
        },101)
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('app.dslj', {
                url: '/dslj',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dslj.html',
                        controller: 'DsljCtrl'
                    }
                }
            })

            .state('app.forecast', {
                url: '/forecast',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/forecast.html',
                        controller: 'ForecastCtrl'
                    }
                }
            })
            .state('app.mainpage', {
                url: '/mainpage',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/mainpage.html',
                        controller: 'MainpageCtrl'
                    }
                }
            })
            .state('app.about', {
                url: '/about',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/about.html'
                    }
                }
            })
            .state('app.loginpage', {
                url: '/loginpage',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/loginpage.html',
                        controller: 'LoginpageCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/loginpage');
    })
    .directive('standardTimeMeridian', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                etime: '=etime'
            },
            template: "<strong>{{stime}}</strong>",
            link: function (scope, elem, attrs) {

                scope.stime = epochParser(scope.etime, 'time');

                function prependZero(param) {
                    if (String(param).length < 2) {
                        return "0" + String(param);
                    }
                    return param;
                }

                function epochParser(val, opType) {
                    if (val === null) {
                        return "00:00";
                    } else {
                        var meridian = ['AM', 'PM'];

                        if (opType === 'time') {
                            var hours = parseInt(val / 3600);
                            var minutes = (val / 60) % 60;
                            var hoursRes = hours > 12 ? (hours - 12) : hours;

                            var currentMeridian = meridian[parseInt(hours / 12)];

                            return (prependZero(hoursRes) + ":" + prependZero(minutes) + " " + currentMeridian);
                        }
                    }
                }

                scope.$watch('etime', function (newValue, oldValue) {
                    scope.stime = epochParser(scope.etime, 'time');
                });

            }
        };
    })

    .directive('standardTimeNoMeridian', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                etime: '=etime'
            },
            template: "<strong>{{stime}}</strong>",
            link: function (scope, elem, attrs) {

                scope.stime = epochParser(scope.etime, 'time');

                function prependZero(param) {
                    if (String(param).length < 2) {
                        return "0" + String(param);
                    }
                    return param;
                }

                function epochParser(val, opType) {
                    if (val === null) {
                        return "00:00";
                    } else {
                        if (opType === 'time') {
                            var hours = parseInt(val / 3600);
                            var minutes = (val / 60) % 60;

                            return (prependZero(hours) + ":" + prependZero(minutes));
                        }
                    }
                }

                scope.$watch('etime', function (newValue, oldValue) {
                    scope.stime = epochParser(scope.etime, 'time');
                });

            }
        };
    })
    .directive('imageonload', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    //call the function that was passed
                    scope.$apply(attrs.imageonload);
                });
            }
        };
    }).directive('imageonerror', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    //call the function that was passed
                    scope.$apply(attrs.imageonerror);
                });
            }
        };
    });
