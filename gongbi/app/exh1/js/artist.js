app.controller('EnvController', ['$rootScope', '$scope', '$http', '$location', 'global', '$timeout', 'weixin',
	function($rootScope, $scope, $http, $location, global, $timeout, weixin) {
		var env = this;

		weixin.setup();

		var id = $location.search().id;
		env.artist = null;
		env.focusTab = 0;
		var funcDelay = null;
		env.init = function(a, ws, as){
			env.artist = a;
			env.artist.workses = ws;
			env.artist.articles = as;
			global.dataReady = true;
			if (global.debugging())
				return;
			if (!weixin.info.ready){
				if (funcDelay)
					return;
				funcDelay = setTimeout(function(){
					funcDelay = null;
					env.init(a, ws, as);
				}, 200);
				return;
			}

			weixin.fillShare({
				title: '中国艺术研究院工笔画精品展 - ' + env.artist.name,
				desc: env.artist.title,
				imgUrl: global.getImgUrl(env.artist.headimgurl, 0.25),
				success: function(){
					_czc.push(['_trackEvent', '艺术家页-'+env.artist.name, '分享', env.artist.id, '1']);
				}
			});
			funcDelay = null;
			_czc.push(['_trackEvent', '艺术家页-'+env.artist.name, '浏览', env.artist.id, '1']);
		};

		if (global.debugging())
			env.init(global.datas.artist1.artist, global.datas.artist1.workses, global.datas.artist1.articles);
		else {
			$http.get('server.php?act=data-artist&id=' + id).error(function(r, s, e){
				console.error(s, e);
			}).success(function(resp){
				env.init(resp.artist, resp.workses, resp.articles);
			});
		}
		var backing = window.localStorage.getItem('exh1-backing');
		if (backing){
			var idx = window.localStorage.getItem('exh1-artist-tab');
			if (idx > 0)
				env.focusTab = Number(idx);
			window.localStorage.removeItem('exh1-backing');
		}

		env.kinds = [
			{type: -1, name: '全部作品'},
			{type: 0, name: '工笔'},
			{type: 99, name: '其他'},
		];
		env.headerHeight = function(){
			return 240 / 640 * global.screen().width;
		};
		env.contentHeight = function(){
			return global.screen().height - env.headerHeight();
		};
		env.getWorksStyle = function(wk){
			if (!wk.resinfo)
				return "{}";
			var info = angular.fromJson(wk.resinfo);
			var maxHeight = global.screen().height * 0.5;
			var maxWidth = global.screen().width * 0.96;
			var r1 = maxWidth / maxHeight;
			var r2 = info.width / info.height;
			var w = maxWidth, h = maxHeight, l = 0;
			if (r1 <= r2)
				h = w / r2;
			else{
				w = h * r2;
				l = (maxWidth - w) * 0.5;
			}
			if (true){
				return angular.toJson({
					'width': maxWidth + 'px'
				});
			}
			return angular.toJson({
				'width': w + 'px',
				'height': h + 'px',
				// 'margin-left': l + 'px'
			});
		};
		env.getWorksSize = function(wk){
			var w = Number(wk.width);
			var h = Number(wk.height);
			if (w <= 0 || h <= 0)
				return '';
			return w + 'x' + h + 'cm';
		};
		env.selectArticle = function(a){
			window.location.href = 'article.html?id=' + a.id;
		};
		env.clickBack = function(){
			window.localStorage.setItem('exh1-backing', 1);
			window.location.href = 'index.html';
		};
		$scope.$watch('env.focusTab', function(idx){
			console.log('new tab:', idx);
			window.localStorage.setItem('exh1-artist-tab', idx);
		});
	}
])
.directive('artistResume', [
	function(){
		return {
			restrict: 'E',
			link: function(scope, elem, attrs){
				console.log('scope:',scope);
				scope.$watch('env.artist', function(a){
					console.log('new art:',a);
					if (!a) return;
					a.resume = a.resume.replace(/font-size:\s*\d+px;/g, "font-size: 14px;");
					elem.html(a.resume);
				});
			}
		}
	}
]);