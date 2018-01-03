var app = angular.module('helloworld', [])
.constant('configs', {
    serverUrl: 'access.php',
    appUser: null,
    appPost: null,
	activated: true,
    debug: {
        open: false,
    	user: {id: 'abcdefgh', miles: 1234, continents: 3, countries: 15},
    	post: {id: 1, user_id: 'abcdefgh', status: 2, words: 'NAME'},
    	wxresp: null
    },
    scrn: {
        size: {
            w: 0,
            h: 0
        },
        aspect: 1,
        scale: 1,
        resize: function() {
            this.size.w = $(window).width();
            this.size.h = $(window).height();
            this.aspect = this.size.w / this.size.h;
            this.scale = this.size.w / 640;
        }
    },
    map: {x1: -180, x2: 180, y1: -68, y2: 140, srcH: 409},
	info: {
		title: '我对世界Say Hello',
		desc: '《经济学人•全球商业评论》邀您点亮人脉地图，开启问候世界的旅途',
		imgUrl: 'http://skyemedia.sinaapp.com/hello/img/logo.jpg?v=2'
	},
	setShareInfo: function(info) {
		wx.onMenuShareAppMessage(info);
		wx.onMenuShareTimeline(info);
	},
	getPureUrl: function(){
		return window.location.href.split('#')[0].split('?')[0];
	}
})
.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }
])
.run(['$rootScope', '$templateCache', 'configs',
    function($rootScope, $templateCache, configs) {
        if (configs.debug.open) {
        	// configs.appUser = configs.debug.user;
        	// configs.appPost = configs.debug.post;
        	// configs.serverUrl = 'http://skyemedia.sinaapp.com/hello/' + configs.serverUrl;
        }
        configs.scrn.resize();
        $rootScope.configs = configs;
        $templateCache.removeAll();
    }
])
.directive('resizement', ['$window', 'configs',
    function($window, configs) {
        return {
            restrict: 'EA',
            link: function(scope, elem, attrs) {
                angular.element($window).bind('resize', function() {
                    configs.scrn.resize();
                    console.log('link scrn:', configs.scrn);
                    scope.$digest();
                });
            }
        }
    }
])
.controller('EnvController', ['$scope', '$http', '$log', '$window', 'configs', '$location',
	function($scope, $http, $log, win, configs, loc) {
		var env = this;
		env.accessable = false;
		env.sharetipVisible = false;
		env.postId = loc.search().id;
		env.getSpotStyle = function(spot){
			var cm = configs.map;
			var rx = cm.x2 - cm.x1;
			var ry = cm.y2 - cm.y1;
			var x = spot.lng - cm.x1;
			var y = spot.lat - cm.y1;
			while (x < 0) x += rx;
			return {
				left: (x / rx * configs.scrn.size.w - 6) + 'px',
				top: ((1 - y / ry) * configs.scrn.scale * cm.srcH - 6) + 'px'
			}
		};
		env.spots = [];

		env.loadingT = 0;
		env.loadingFunc = setInterval(function(){
			if (++env.loadingT >= 3)
				env.loadingT = 0;
            $scope.$digest();
		}, 600);
		env.isLoading = true;

		env.updateWordsShareInfo = function(){
			if (!configs.appPost.words)
				configs.appPost.words = '';
			else
				configs.appPost.words = configs.appPost.words.replace(/(^\s*)|(\s*$)/g, '');
			var title = '我对世界Say Hello';
			if (configs.appPost.words.length > 0)
				title = '【我对世界Say Hello】Hello 世界！Hello ' + configs.appPost.words + '！';
			configs.setShareInfo($.extend({}, configs.info, {
				type: 'link',
				title: title,
				link: configs.getPureUrl() + '?id=' + configs.appPost.id,
				success: function () {
					env.sendHello();
					alert('分享成功！');
				},
			}));
		};
		env.changeStatus = function(status){
			configs.appPost && (configs.appPost.status = status);
			if (status == 1){
				configs.appPost && env.isMyPost() && env.updateWordsShareInfo();
			}else if (status == 2){
				env.updateWordsShareInfo();
				// detecting new friends on the map
				env.detectingFunc = setInterval(function(){
					$http.get(configs.serverUrl, { params: {
						act: 'detect',
						id: configs.appPost.id
					}}).error(function(resp){
						// alert('状态检测错误：' + resp);
					}).success(function(resp){
						if (resp.success){
							configs.appUser = resp.data.user;
							configs.appPost = resp.data.post;
							env.spots.length = 0;
							var mine = {lng: configs.appPost.longitude, lat: configs.appPost.latitude};
							if (!(!mine.lng && !mine.lat))
								env.spots.push(mine);
							for (var i = 0; i < resp.data.friends.length; i++) {
								var f = resp.data.friends[i];
								if (!(!f.lng && !f.lat))
									env.spots.push(f);
							};
							$scope.$digest();
						}else{
							alert('状态检测失败：' + resp.message);
						}
					});
				}, 2000);
			}
			env.tipShare(false);
		};
		env.enableAccess = function(){
			env.loadingFunc && clearInterval(env.loadingFunc);
			env.loadingFunc = null;
			env.accessable = true;
			env.isLoading = false;
			var stat = 0;
			if (configs.appPost){
				if (env.isMyPost())
					stat = configs.appPost.status;
				else
					stat = 1;
			}
			env.changeStatus(stat);
            $scope.$digest();
		};
		env.openHello = function(){
			$http.get(configs.serverUrl + '?act=open').error(function(){
				alert('同步开启状态失败！');
			}).success(function(resp){
				if (resp.success){
					configs.appPost = resp.data;
					env.changeStatus(1);
					env.requireLocation();
					// $scope.$digest();
				}
			});
		};
		env.setHello = function(imm){
			env.updateWordsShareInfo();
			env.wordssyncFunc && clearTimeout(env.wordssyncFunc);
			env.wordssyncFunc = setTimeout(function(){
				$http.get(configs.serverUrl, {
					params: {
						act: 'hello',
						id: configs.appPost.id,
						words: configs.appPost.words
					}
				})
				.error(function(){
					env.setHello(true);
					// alert('同步文字信息失败！');
				})
				.success(function(resp){
					env.wordssyncFunc = null;
				});
			}, imm ? 50 : 1500);
		};
		env.replay = function(){
			window.location.href = configs.getPureUrl();
		};
		env.trySendHello = function(){
			if (!configs.appPost.words || configs.appPost.words.length == 0){
				alert('还没有填写朋友的名字哦~');
				return;
			}
			env.sharetipVisible = true;
			configs.debug.open && env.sendHello();
		};
		env.sendHello = function(){
			$http.get(configs.serverUrl, {params: {
				act: 'send',
				id: configs.appPost.id,
			}}).error(function(){
				alert('同步分享状态失败！');
			}).success(function(resp){
				env.changeStatus(2);
			});
		};
		env.getMiles = function(){
			if (!configs.appPost || !configs.appUser)
				return 0;
			var m = Number(configs.appUser.miles);
			if (m < 0.1)
				m *= 1000;
			if (m == Math.floor(m))
				return m;
			return m.toFixed(1);
		};
		env.getMilesUnit = function(){
			var unit = '公里';
			if (configs.appUser && configs.appPost && Number(configs.appUser.miles) < 0.1)
				unit = '米';
			return unit;
		};
		env.isMyPost = function(){
			if (!configs.appPost)
				return true;
			return configs.appPost.user_id == configs.appUser.id;
		};
		env.tipShare = function(pop){
			env.sharetipVisible = pop;
			pop && setTimeout(function(){
				env.sharetipVisible = false;
				$scope.$digest();
			}, 2000);
		};
		env.initWeixin = function(callbk){
			if (configs.debug.open){
				callbk && callbk();
				return;
			}
			var inMap = env.isMyPost() && configs.appPost && configs.appPost.status == 2;
			inMap && callbk && callbk();

			$http.get('../lib/wxentry.php').error(function(r, s, e){
				console.log(s, e);
				alert('访问微信入口功能失败！');
			})
			.success(function(resp){
				configs.debug.wxresp = resp;
				wx.config({
					debug: false,
					appId: resp.appId,
					timestamp: resp.timestamp,
					nonceStr: resp.nonceStr,
					signature: resp.signature,
					jsApiList: [
						'onMenuShareAppMessage',
						'onMenuShareTimeline',
						'getLocation'
					]
				});
				wx.ready(function () {
					if (inMap){
						env.updateWordsShareInfo();
					}else{
						configs.setShareInfo($.extend({}, configs.info, {
							type: 'link',
							link: window.location.href
						}));
						callbk && callbk();
					}
				});
			});

			wx.error(function (res) {
				alert('微信接口错误:' + res.errMsg);
				var r = !configs.debug.wxresp ? 'null' : JSON.stringify(configs.debug.wxresp);
				alert('resp=' + r);
			});
		};
		env.reportLocation = function(lng, lat, ccode){
			$http.get(configs.serverUrl + '?act=locate', {
				params: {
					id: configs.appPost.id,
					lng: lng,
					lat: lat,
					ccode: ccode
				}
			})
			.error(function(){
				alert('保存定位信息失败！');
			})
			.success(function(resp){
				env.enableAccess();
			});
		};
		env.processLocation = function(res){
			if (env.isMyPost()){
				// step4: report location to server when user is host
	    		env.reportLocation(res.longitude, res.latitude, null);
	    	}else{
				// step4: require country info when user is guest
				$http.get('http://api.geonames.org/countryCode', {
					params: {
						username: 'shanshuirunhe',
						lng: res.longitude,
						lat: res.latitude
					}
				})
				.error(function(){
					alert('获取国家地理信息失败！');
				})
				.success(function(resp){
					// step5: report location to server at last
	    			env.reportLocation(res.longitude, res.latitude, resp);
				});
	    	}
		};
		env.requireLocation = function(){
			if (configs.debug.open)
		    	env.processLocation({longitude: 116, latitude: 40});
			else{
				// step3: require user location
				wx.getLocation({
				    success: function (res) {
				    	env.processLocation(res);
				    }
				});
			}
		};

		// step1: login or view
		var url = configs.serverUrl + '?act=login';
		env.postId && (url += '&id=' + env.postId);

		$http.get(url).error(function(){
			alert('访问服务器出现错误！');
		})
		.success(function(resp){
			console.log(resp);
			if (!resp.success){
				// alert('访问服务器失败！(1st step)' + resp.message);
				return;
			}
			configs.appUser = resp.data.user;
			configs.appPost = resp.data.post;
			if (env.postId && !configs.appPost){
				window.location.href = configs.getPureUrl();
			}

			// step2: initialize weixin js-sdk
			env.initWeixin(function(){
				if (!configs.appPost)
					env.enableAccess();
				else if (env.isMyPost() && configs.appPost.status == 2)
					env.enableAccess();
				else// if (configs.appPost.status == 1)
					env.requireLocation();
			});
		});
		$('section').css({opacity: 1});
		$('.sharetip').css({opacity: 1});
	}
]);
