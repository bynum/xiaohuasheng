angular.module('starter.controllers', ['leaflet-directive'])

    .controller('AppCtrl', function ($scope, $rootScope) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        var change = function () {
            return localStorage.getItem('user');
        }
        $scope.$watch(change, function () {
            //console.log('changed');
            $scope.user = localStorage.getItem('user');
        })
    })

    .controller('LoginpageCtrl', function ($scope, $timeout, $state) {
        $scope.$on('$ionicView.loaded', function () {
            if (localStorage.getItem('user')) {
                $state.go('app.mainpage');
            }
        })
        // Form data for the login modal
        $scope.loginData = {};
        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            if ($scope.loginData.username == 'sail' && $scope.loginData.password == '17c01') {
                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                $timeout(function () {
                    $scope.err = '';
                    localStorage.setItem('user', $scope.loginData.username);
                    $state.go('app.mainpage');
                }, 1000);
            } else {
                $scope.err = '用户名或密码错误！';
            }
        };
    })

    .controller('MainpageCtrl', function ($scope, $state) {
        $scope.username = localStorage.getItem('user');
        //console.log($scope.username);
        $scope.logout = function () {
            localStorage.removeItem('user');
            $state.go('app.loginpage');
        }
    })
    .controller('ForecastCtrl', function ($scope) {
    })
    .controller('DsljCtrl',
        [
            '$scope',
            '$ionicPopup',
            '$http',
            'leafletData',
            '$stateParams',
            '$ionicModal',
            '$ionicLoading',
            '$timeout',
            '$ionicSlideBoxDelegate',
            '$ionicScrollDelegate',
            'Common',
            function (
                $scope,
                $ionicPopup,
                $http,
                leafletData,
                $stateParams,
                $ionicModal,
                $ionicLoading,
                $timeout,
                $ionicSlideBoxDelegate,
                $ionicScrollDelegate,
                Common) {
                /*******雷达选择页面 返回页面顶部业务********* */
                $scope.sttButton = false;
                $scope.scrollToTop = function () { //ng-click for back to top button
                    $ionicScrollDelegate.$getByHandle('radarScroll').scrollTop();
                    $scope.sttButton = false;  //hide the button when reached top
                };
                $scope.getScrollPosition = function () {
                    //monitor the scroll
                    var moveData = $ionicScrollDelegate.$getByHandle('radarScroll').getScrollPosition().top;
                    $scope.$apply(function () {
                        if (moveData > 150) {
                            $scope.sttButton = true;
                        } else {
                            $scope.sttButton = false;
                        }
                    }); //apply 
                };
                /*******雷达选择页面 返回页面顶部业务********* */

                var currentRadarModel = "";
                var radarLayer = null;
                $scope.physicsTitle = "国家站";
                $scope.slideChanged = function () {
                    $scope.currSlide = $ionicSlideBoxDelegate.currentIndex();
                    switch ($scope.currSlide) {
                        case 0:
                            $scope.sttButton = false;
                            $scope.physicsTitle = "国家站";
                            break;
                        case 1:
                            $scope.sttButton = false;
                            $scope.physicsTitle = "区域站";
                            break;
                        case 2:
                            $scope.physicsTitle = "雷达";
                            var moveData = $ionicScrollDelegate.$getByHandle('radarScroll').getScrollPosition().top;
                            if (moveData > 150) {
                                $scope.sttButton = true;
                            } else {
                                $scope.sttButton = false;
                            }
                            break;
                    }
                };
                $scope.$on('$ionicView.afterEnter', function () {
                    document.getElementById('btnTimePicker').nextSibling.style.display = 'none';
                    leafletData.getMap('mymap').then(function (map) {
                        map._onResize();
                    });
                    //document.getElementById('btnTimePicker').parentNode.removeChild(document.getElementById('btnTimePicker').nextSibling);
                });
                $scope.datetime = {};//纪录当前时间 date：yyyyMMdd 和hour：hh
                $scope.radarList = [];//纪录雷达的列表
                /////////////////////////////////
                $scope.physicsData = {
                    hourData7: {
                        tem: true,
                        rh: false,
                        wind: true,
                        point: true,
                        id: false,
                        name: false,
                        prs: false,
                        dpt: false,
                        pre1h: false,
                        gst: false,
                        vis: false,
                        prs24h: false,
                        prs3h: false,
                        tem24h: false,
                        temmax24h: false,
                        temmin24h: false,
                        pre24h: false
                    },
                    hourData2: {
                        r1h: true,
                        id2: false,
                        name2: false
                    },
                    radarData: {
                        radarShown: true,
                        radarModel: ""
                    }
                };
   
                // Create the physics modal that we will use later
                $ionicModal.fromTemplateUrl('templates/physics.html', {
                    scope: $scope,
                }).then(function (modal) {
                    $scope.modal = modal;
                });

                // Triggered in the physics modal to close it
                $scope.closePhysics = function () {
                    $scope.modal.hide();
                };

                // Open the physics modal
                $scope.physics = function (event) {
                    $scope.modal.show();
                    event.stopPropagation();//阻止事件冒泡
                };
                var isRadarShown = true;
                // Perform the physics action when the user submits the physics form
                $scope.doPhysics = function () {
                    for (var i = 0; i < hourData7Markers.length; i++) {
                        hourData7Markers[i].options.icon.changeHourData7DisplayStatus($scope.physicsData.hourData7);
                    }
                    leafletData.getMap('mymap').then(function (map) {
                        if ($scope.physicsData.radarData.radarShown) {
                            if (!isRadarShown) {
                                radarLayer = addRadarImg(map, $scope.physicsData.radarData.radarModel);
                            }
                            else {
                                if ($scope.physicsData.radarData.radarModel != currentRadarModel) {
                                    map.removeLayer(radarLayer);
                                    radarLayer = addRadarImg(map, $scope.physicsData.radarData.radarModel);
                                }
                            }
                        }
                        else {
                            if (isRadarShown) {
                                map.removeLayer(radarLayer);
                            }
                        }
                        isRadarShown = $scope.physicsData.radarData.radarShown;
                        drawHourData2(map, $scope.hourData2Obj);
                    })
                };
                function addRadarImg(leafletMap, radarModel) {
                    var imageUrl = "http://222.85.131.129:1081/static/ywptPNG/" + radarModel.substring(0, 4) + "/" + radarModel.substring(0, 6) + "/" + radarModel.substring(0, 8) + "/radar/CR/" + radarModel + ".gif";
                    var imageBounds = [[22.09, 102.22], [31.09, 111.22]];
                    currentRadarModel = radarModel;
                    return L.imageOverlay(imageUrl, imageBounds).addTo(leafletMap);
                }
                /////////////////////////////////
                var disabledDates = [
                    new Date(1437719836326),
                    new Date(2015, 7, 10), //months are 0-based, this is August, 10th!
                    new Date('Wednesday, August 12, 2015'), //Works with any valid Date formats like long format
                    new Date("08-14-2015"), //Short format
                    new Date(1439676000000) //UNIX format
                ];
                var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
                $scope.datepickerObject = {};
                $scope.datepickerObject.inputDate = new Date();

                $scope.datepickerObjectPopup = {
                    titleLabel: '日期选择', //Optional
                    todayLabel: '今天', //Optional
                    closeLabel: '关闭', //Optional
                    setLabel: '确定', //Optional
                    errorMsgLabel: '请选择日前.', //Optional
                    setButtonType: 'button-assertive', //Optional
                    modalHeaderColor: 'bar-positive', //Optional
                    modalFooterColor: 'bar-positive', //Optional
                    templateType: 'modal', //Optional
                    inputDate: $scope.datepickerObject.inputDate, //Optional
                    mondayFirst: true, //Optional
                    disabledDates: disabledDates, //Optional
                    monthList: monthList, //Optional
                    from: new Date(2012, 5, 1), //Optional
                    to: new Date(2020, 7, 1), //Optional
                    callback: function (val) { //Optional
                        datePickerCallbackPopup(val);
                    }
                };
                var datePickerCallbackPopup = function (val) {
                    if (typeof (val) === 'undefined') {
                    } else {
                        $scope.datepickerObjectPopup.inputDate = val;
                        var dateStr = val.Format("yyyyMMdd");
                        if (dateStr != $scope.datetime.date/*localStorage.getItem('date')*/) {
                            $scope.datetime.date = dateStr;
                            //localStorage.setItem('date', dateStr);
                            var timeStr = dateStr + $scope.datetime.hour/*localStorage.getItem('hour')*/;
                            OperateHourData(timeStr);
                        }
                    }
                };
                function OperateHourData(timeStr) {
                    $ionicLoading.show({
                        template: '加载中。。。',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    leafletData.getMap('mymap').then(function (map) {
                        for (var n = 0; n < hourData7Markers.length; n++) {
                            map.removeLayer(hourData7Markers[n]);
                        };
                        hourData7Markers = [];
                        $http.get("http://222.85.131.129:1081/zdz", {
                            params: {
                                time: timeStr,
                                datasource: "sql",
                                datatype: "hourdata7"
                            }
                        })
                            .success(function (data) {
                                for (var i = 0; i < data.DS.length; i++) {
                                    var icon = new L.TextIcon(
                                        {
                                            tem: data.DS[i].TEM,
                                            id: data.DS[i].Station_ID_C,
                                            name: data.DS[i].Station_Name,
                                            prs: data.DS[i].PRS,
                                            dpt: data.DS[i].DPT,
                                            rH: data.DS[i].RHU,
                                            pre1h: data.DS[i].PRE_1h,
                                            gst: data.DS[i].GST,
                                            vis: data.DS[i].VIS,
                                            prs24h: data.DS[i].PRS_Change_24h,
                                            prs3h: data.DS[i].PRS_Change_3h,
                                            tem24h: data.DS[i].TEM_ChANGE_24h,
                                            temmax24h: data.DS[i].TEM_Max_24h,
                                            temmin24h: data.DS[i].TEM_Min_24h,
                                            pre24h: data.DS[i].PRE_24h,
                                            windNum: parseInt((data.DS[i].WIN_S_Avg_2mi - 0.01) / 2),
                                            windDirection: data.DS[i].WIN_D_Avg_2mi,
                                            hourData7: $scope.physicsData.hourData7
                                        }
                                        );
                                    var marker = L.marker([data.DS[i].Lat, data.DS[i].Lon], { icon: icon });
                                    hourData7Markers.push(marker);
                                    map.addLayer(marker);
                                }
                            }).error(function (err) { });
                        $http.get("http://222.85.131.129:1081/zdz", {
                            params: {
                                time: timeStr,
                                datasource: "sql",
                                datatype: "hourrain"
                            }
                        })
                            .success(function (data) {
                                $scope.hourData2Obj = data;
                                drawHourData2(map, data);
                                $ionicLoading.hide();
                            }).error(function (err) {
                                $ionicLoading.hide();
                            });
                    });
                }
                function drawHourData2(mapid, data) {
                    if (hourData2Layer != null) {
                        mapid.removeLayer(hourData2Layer);
                    }
                    if ($scope.physicsData.hourData2.r1h == false && $scope.physicsData.hourData2.name2 == false && $scope.physicsData.hourData2.id2 == false) {
                        $ionicLoading.hide();
                        return;
                    }
                    hourData2Layer = L.canvasOverlay()
                        .drawing(function (canvasOverlay, params) {
                            var ctx = params.canvas.getContext('2d');
                            ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);
                            for (var i = 0; i < data.DS.length; i++) {
                                if (data.DS[i].PRE_1h == null || data.DS[i].PRE_1h == "" || parseFloat(data.DS[i].PRE_1h) <= 0) {
                                    continue;
                                }
                                var pre1h = parseFloat(data.DS[i].PRE_1h);
                                var lon = parseFloat(data.DS[i].Lon);
                                var lat = parseFloat(data.DS[i].Lat)
                                if (params.bounds.contains([lat, lon])) {
                                    var dot = canvasOverlay._map.latLngToContainerPoint([lat, lon]);
                                    ctx.font = "12px Arial";
                                    if ($scope.physicsData.hourData2.r1h) {
                                        ctx.fillStyle = Common.getColorByRain(pre1h);
                                        ctx.fillText(data.DS[i].PRE_1h, dot.x, dot.y);
                                    }
                                    if ($scope.physicsData.hourData2.name2) {
                                        ctx.fillStyle = 'black';
                                        ctx.fillText(data.DS[i].Station_Name, dot.x, dot.y - 15);
                                    }
                                    if ($scope.physicsData.hourData2.id2) {
                                        ctx.fillStyle = 'black';
                                        ctx.fillText(data.DS[i].Station_ID_C, dot.x, dot.y + 15);
                                    }
                                }
                            }
                        })
                        .addTo(mapid);
                }
                $scope.timePickerObject24Hour = {
                    inputEpochTime: ((new Date()).getHours() * 60 * 60 + (new Date()).getMinutes() * 60),  //Optional
                    step: 10,  //Optional
                    format: 24,  //Optional
                    titleLabel: '时间选择',  //Optional
                    closeLabel: '取消',  //Optional
                    setLabel: '确定',  //Optional
                    setButtonType: 'button-balanced',  //Optional
                    closeButtonType: 'button-positive',  //Optional
                    callback: function (val) {    //Mandatory
                        timePicker24Callback(val);
                    }
                };
                function timePicker24Callback(val) {
                    if (typeof (val) === 'undefined') {
                    } else {
                        $scope.timePickerObject24Hour.inputEpochTime = val;
                        var selectedTime = new Date(val * 1000);
                        var hour = selectedTime.getUTCHours();
                        var hourStr = hour.toString();
                        if (hour < 10) {
                            hourStr = '0' + hour.toString();
                        }
                        if (hourStr != $scope.datetime.hour/*localStorage.getItem('hour')*/) {
                            $scope.datetime.hour = hourStr;
                            //localStorage.setItem('hour', hourStr);
                            var timeStr = /*localStorage.getItem('date')*/$scope.datetime.date + hourStr;
                            OperateHourData(timeStr);
                        }
                    }
                };
                var hourData7Markers = [];
                var hourData2Layer = null;
                $http.get("json/cities.json").success(function (data, status) {
                    angular.extend($scope.layers.overlays, {
                        cities: {
                            name: '地州边界',
                            type: 'geoJSONShape',
                            data: data,
                            visible: true,
                            layerOptions: {
                                style: {
                                    color: '#000',
                                    fillColor: '＃ddd',
                                    weight: 2.0,
                                    opacity: 0.6,
                                    fillOpacity: 0.0
                                }
                            }
                        }
                    });
                });
                $http.get("json/counties.json").success(function (data, status) {
                    angular.extend($scope.layers.overlays, {
                        counties: {
                            name: '县边界',
                            type: 'geoJSONShape',
                            data: data,
                            visible: false,
                            layerOptions: {
                                style: {
                                    color: '#00d',
                                    fillColor: '＃fff',
                                    weight: 1.0,
                                    opacity: 0.6,
                                    dashArray: 3,
                                    fillOpacity: 0.0
                                }
                            }
                        }
                    });
                });
                $scope.doRefreshRadarList = function () {
                    $http.get("http://222.85.131.129:1081/radar", {
                        params: {
                            radarlist: 'true'
                        }
                    })
                        .success(function (data) {
                            $scope.physicsData.radarData.radarModel = data.radarlist[0];//纪录当前选中的雷达图片的时间
                            currentRadarModel = $scope.physicsData.radarData.radarModel;
                            $scope.radarList = data.radarlist.slice(0,100);
                        })
                        .error(function (err) { })
                        .finally(function () {
                            // Stop the ion-refresher from spinning
                            $scope.$broadcast('scroll.refreshComplete');
                        });
                }
                $scope.centerMap = function () {//地图居中
                    leafletData.getMap().then(function (map) {
                        map.setView([27, 106.71], 7);
                    });
                };
                $scope.doRefresh = function () {//请求最新时次数据
                    var datetimeNow = new Date();
                    $scope.datepickerObjectPopup.inputDate = datetimeNow;
                    var dateStr = datetimeNow.Format('yyyyMMdd');
                    var hour = datetimeNow.getHours();
                    var hourStr = hour.toString();
                    if (hour < 10) {
                        hourStr = '0' + hour.toString();
                    }
                    $scope.timePickerObject24Hour.inputEpochTime = datetimeNow.getHours() * 60 * 60 + datetimeNow.getMinutes() * 60;
                    if ($scope.datetime.date != dateStr || $scope.datetime.hour != hourStr) {
                        OperateHourData(dateStr + hourStr);
                        $scope.datetime = {
                            date: dateStr,
                            hour: hourStr
                        }
                    }
                }
                $scope.doHourChange = function (hourDelta) {
                    var year = parseInt($scope.datetime.date.substr(0, 4));
                    var month = parseInt($scope.datetime.date.substr(4, 2));
                    var day = parseInt($scope.datetime.date.substr(6, 2));
                    var hour = parseInt($scope.datetime.hour);
                    var dateNew = new Date(year, month - 1, day, hour);
                    dateNew.AddHours(hourDelta);
                    $scope.datepickerObjectPopup.inputDate = dateNew;
                    $scope.timePickerObject24Hour.inputEpochTime = dateNew.getHours() * 3600 + new Date().getMinutes() * 60;
                    $scope.datetime.date = dateNew.Format('yyyyMMdd');
                    var hourNew = dateNew.getHours();
                    var hourStrNew = hourNew.toString();
                    if (hourNew < 10) {
                        hourStrNew = '0' + hourNew.toString();
                    }
                    $scope.datetime.hour = hourStrNew;
                    OperateHourData($scope.datetime.date + $scope.datetime.hour);
                }
                angular.extend($scope, {
                    defaults: {
                        minZoom: 6,
                        maxZoom: 12
                    },
                    guizhou: {
                        lat: 27,
                        lng: 106.71,
                        zoom: 7,
                        minZoom: 6
                    },
                    layers: {
                        overlays: {}
                    },
                });

                function getCurrentTime() {
                    var date = new Date();
                    date.AddHours(-8);
                    return date.Format("yyyyMMddhh") + "0000";
                }
                function getCurrentTimeShort() {
                    var date = new Date();
                    return date.Format("yyyyMMddhh");
                }
                leafletData.getMap('mymap').then(function (map) {
                    $ionicLoading.show({
                        template: '加载中。。。',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    document.getElementById('btnTimePicker').nextSibling.style.display = 'none';
                    $http.get("http://222.85.131.129:1081/zdz", {
                        params: {
                            time: getCurrentTimeShort(),
                            datasource: "sql",
                            datatype: "hourdata7"
                        }
                    })
                        .success(function (data) {
                            var date = new Date();
                            var dateStr = date.Format('yyyyMMdd');
                            var hourStr = date.Format('hh');
                            $scope.datetime.date = dateStr;
                            $scope.datetime.hour = hourStr;
                            for (var i = 0; i < data.DS.length; i++) {
                                var icon = new L.TextIcon(
                                    {
                                        tem: data.DS[i].TEM,
                                        id: data.DS[i].Station_ID_C,
                                        name: data.DS[i].Station_Name,
                                        prs: data.DS[i].PRS,
                                        dpt: data.DS[i].DPT,
                                        rH: data.DS[i].RHU,
                                        pre1h: data.DS[i].PRE_1h,
                                        gst: data.DS[i].GST,
                                        vis: data.DS[i].VIS,
                                        prs24h: data.DS[i].PRS_Change_24h,
                                        prs3h: data.DS[i].PRS_Change_3h,
                                        tem24h: data.DS[i].TEM_ChANGE_24h,
                                        temmax24h: data.DS[i].TEM_Max_24h,
                                        temmin24h: data.DS[i].TEM_Min_24h,
                                        pre24h: data.DS[i].PRE_24h,
                                        windNum: parseInt((data.DS[i].WIN_S_Avg_2mi - 0.01) / 2),
                                        windDirection: data.DS[i].WIN_D_Avg_2mi,
                                        hourData7: $scope.physicsData.hourData7
                                    }
                                    );
                                var marker = L.marker([data.DS[i].Lat, data.DS[i].Lon], { icon: icon });
                                hourData7Markers.push(marker);
                                map.addLayer(marker);
                            }
                        }).error(function (err) { });
                    $http.get("http://222.85.131.129:1081/radar", {
                        params: {
                            radarlist: 'true'
                        }
                    })
                        .success(function (data) {
                            $scope.physicsData.radarData.radarModel = data.radarlist[0];//纪录当前选中的雷达图片的时间
                            $scope.radarList = data.radarlist.slice(0,100);
                            radarLayer = addRadarImg(map, $scope.physicsData.radarData.radarModel);

                        }).error(function (err) { });
                    $http.get("http://222.85.131.129:1081/zdz", {
                        params: {
                            time: getCurrentTimeShort(),
                            datasource: "sql",
                            datatype: "hourrain"
                        }
                    })
                        .success(function (data) {
                            $scope.hourData2Obj = data;

                            hourData2Layer = L.canvasOverlay()
                                .drawing(function (canvasOverlay, params) {
                                    var ctx = params.canvas.getContext('2d');
                                    ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);
                                    for (var i = 0; i < data.DS.length; i++) {
                                        if (data.DS[i].PRE_1h == null || data.DS[i].PRE_1h == "" || parseFloat(data.DS[i].PRE_1h) <= 0) {
                                            continue;
                                        }
                                        var pre1h = parseFloat(data.DS[i].PRE_1h);
                                        var lon = parseFloat(data.DS[i].Lon);
                                        var lat = parseFloat(data.DS[i].Lat)
                                        if (params.bounds.contains([lat, lon])) {
                                            var dot = canvasOverlay._map.latLngToContainerPoint([lat, lon]);
                                            ctx.fillStyle = Common.getColorByRain(pre1h);
                                            ctx.font = "12pt Arial";
                                            ctx.fillText(data.DS[i].PRE_1h, dot.x, dot.y);
                                        }
                                    }
                                })
                                .addTo(map);
                            $ionicLoading.hide();
                        }).error(function (err) {
                            $ionicLoading.hide();
                        });
                });
            }]);
