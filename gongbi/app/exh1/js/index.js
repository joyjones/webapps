app.controller('EnvController', ['$rootScope', '$scope', '$http', '$location', 'global', '$timeout', 'weixin',
	function($rootScope, $scope, $http, $location, global, $timeout, weixin) {
		var env = this;

		weixin.setup(function(){
			weixin.fillShare({
				title: '中国艺术研究院工笔画精品展',
				desc: '中国艺术研究院工笔画精品展',
				imgUrl: global.appUrl + 'img/logo.jpg',
				success: function(){
					_czc.push(['_trackEvent', '首页', '分享', '', '1']);
				}
			});
		});

		env.welcomeVisible = true;
		env.data = null;
		env.tabIndex = 0;

		var backing = window.localStorage.getItem('exh1-backing');
		if (backing){
			env.welcomeVisible = false;
			env.tabIndex = 1;
			window.localStorage.removeItem('exh1-backing');
			_czc.push(['_trackEvent', '首页', '浏览', '', '1']);
		}else{
			_czc.push(['_trackEvent', '欢迎页', '浏览', '', '1']);
		}

		env.setupData = function(data){
			env.data = data;
			console.log(env.data);
			global.dataReady = true;
		};
		env.selectArtist = function(a){
			window.location.href = 'artist.html?id=' + a.id;
		};
		env.curArticleBarCaption = function(){
			if (!env.focus.article || !env.focus.artist)
				return '';
			var cap = env.focus.artist.name;
			if (env.focus.article.type == 0)
				cap += '文章';
			else
				cap += '评论';
			return cap;
		};
		env.getArtistListHeight = function(){
			var headerH = 118/640*global.screen().width;
			return global.screen().height - 40 - headerH - 5;
		};
		env.clickEnter = function(){
			env.welcomeVisible = false;
			_czc.push(['_trackEvent', '进入观展', '点击按钮', '', '1']);
			_czc.push(['_trackEvent', '首页', '浏览', '', '1']);
		};
		env.getSplittedTitles = function(tt){
			return tt.split(' ');
		};

		if (global.debugging())
			env.setupData(global.datas.initial);
		else {
			$http.get('server.php?act=data-init').error(function(r, s, e){
				console.error(s, e);
			}).success(function(resp){
				env.setupData(resp);
			});
		}
	}
])
.directive('prefix', [
	function(){
		return {
			restrict: 'E',
			templateUrl: 'partial-prefix.html'
		}
	}
]);