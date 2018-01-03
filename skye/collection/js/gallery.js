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
		configs.scrn.w = $(window).width();
		configs.scrn.h = $(window).height();
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
			configs.mode = mode;
			configs.datas.length = 0;
			$http.get('access.php', {params:{
				act: 'login',
				section: mode == 0 ? 3 : 4
			}}).error(function(e){
				alert(JSON.stringify(e));
			}).success(function(resp){
				// console.log(resp);
				configs.datas = resp.data.list;
			});
		};
		env.backHome = function(){
			window.location.href = "index.html";
		};
		env.enterPost = function(id){
			window.location.href = "post.html?id="+id;
		};
		env.switch(0);
	}
]);
