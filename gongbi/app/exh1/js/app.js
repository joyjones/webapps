var app = angular.module('exhapp', [])
.value('global', angular.extend({
    user: null,
    dataReady: false,
	appUrl: 'http://gongbi.sinaapp.com/app/exh1/',
	resUrl: 'http://7xp4ff.com1.z0.glb.clouddn.com/',
    debugging: function(){
        return this.debugLv > 0;
    },
    screen: function(){
        return {width: window.innerWidth, height: window.innerHeight};
    },
    getImgUrl: function(url, ratew, rateh){
        url = this.resUrl + url;
        if (ratew){
            var w = Math.floor(window.innerWidth * ratew);
            url += '?imageView2/';
            if (!rateh)
                url += '2/w/' + w;
            else
                url += '1/w/' + w + '/h/' + Math.floor(window.innerWidth * rateh);
        }
        return url;
    }
}, (typeof(configs_local) !== 'undefined') ? configs_local : {}))
.config(['$locationProvider', '$sceDelegateProvider',
    function($locationProvider, $sceDelegateProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',// Allow same origin resource loads.
            'http://7xp4ff.com1.z0.glb.clouddn.com/**'
        ]);
    }
])
.run(['$rootScope', '$templateCache', 'global', '$http', 'loginHelper',
    function($rootScope, $templateCache, global, $http, loginHelper) {
        // global.scrn.resize();
        $rootScope.global = global;
        $templateCache.removeAll();
        // loginHelper.tryLogin();
    }
])
.factory('loginHelper', ['global', '$http',
    function(global, $http){
        var userKey = 'scenic-user';
        return {
            tryLogin: function(){
                if (!global.debugging() && !/MicroMessenger/.test(navigator.userAgent)){
                    window.location.href = '/error.html?code=0';
                    return;
                }
                var data = window.localStorage.getItem(userKey);
                if (!data){
                    if (global.debugging())
                        this.login(1);
                    else
                        this.login();
                }else{
                    var json = angular.fromJson(data);
                    var info = angular.toJson({id: json.id, token: json.access_token});
                    this.login(info, json.id);
                }
            },
            beginAuth: function(lk){
                setTimeout(function(){
                    window.location.href = global.appUrl + 'server.php?act=auth';
                }, 200);
            },
            login: function(cacheId){
                var me = this;
                $http.get('server.php?act=login').error(function(r, s, e){
                    alert(alert('auth fail'));
                    me.beginAuth();
                }).success(function(resp){
                    if (!resp.success)
                        me.beginAuth();
                    else{
                        global.user = resp.user;
                        if (!window.localStorage.getItem(userKey)){
                            window.localStorage.setItem(userKey, angular.toJson(resp.user));
                        }
                    }
                });
            }
        }
    }
])
.directive('displayRoot', [
    function(){
        return {
            restrict: "EA",
            link: function(scope, element, attrs) {
                scope.$watch('global.dataReady', function(ready){
                    if (ready){
                        element.css('display', 'block');
                    }
                });
            }
        };
    }
]);