var app = angular.module('burton', [])
.constant('configs', {
    scrn: { w: 0, h: 0 },
    mode: -1,
    qnurl: 'http://7xj4xe.com1.z0.glb.clouddn.com/',
    datas: [
    	// {id: 8, imgurl: 'o_19luq22tn17t10gb1p0o1v431lrn9.jpg'},
    ],
    post: {size: 0, padding: 0},
})
.run(['$rootScope', '$templateCache', 'configs',
    function($rootScope, $templateCache, configs) {
		configs.scrn.w = window.innerWidth;
		configs.scrn.h = window.innerHeight;
		configs.post.padding = 2;
		configs.post.size = Math.floor(configs.scrn.w * 0.25 - 2 * configs.post.padding);
        $rootScope.configs = configs;
        $templateCache.removeAll();
        weixin.init();
    }
])
.controller('EnvController', ['$scope', '$http', '$window', 'configs',
	function($scope, $http, win, configs) {
		var env = this;
		env.clickTab = function(e){
			if (e.pageX < configs.scrn.w * 0.55)
				env.switch(0);
			else
				env.switch(1);
		};

		env.switch = function(mode){
			if (configs.mode == mode)
				return;
			if (mode == 0)
				env.stats('gallery-clickNew');
			else
				env.stats('gallery-clickHot');
			configs.mode = mode;
			configs.datas.length = 0;
			$http.get('access.php', {params:{
				act: 'login',
				section: mode == 0 ? 3 : 4
			}}).error(function(e){
				alert(JSON.stringify(e));
			}).success(function(resp){
				// console.log(resp);
				if (resp.data)
					configs.datas = resp.data.list;
			});
		};
		env.backHome = function(){
			env.stats('gallery-clickHome');
			setTimeout(function(){
				window.location.href = "index.html";
			}, 200);
		};
		env.enterPost = function(id){
			env.stats('gallery-clickPost');
			setTimeout(function(){
				window.location.href = "post.html?id="+id;
			}, 200);
		};
		env.stats = function(key){
            $http.get('/lib/stats.php', {params:{
                key: 'burtonkids-' + key, addval: 1
			}});
        };
		env.switch(0);
		env.stats('gallery-visits');
	}
])
.directive('fullScreen', [
	function(){
		return {
			restrict: 'EA',
			link: function(scope, elem, attrs){
				elem.css('height', window.innerHeight);
				if (/iPhone/.test(navigator.userAgent))
					elem.css('font-family', 'Heiti SC');
			}
		}
	}
]);