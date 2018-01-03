app.controller('EnvController', ['$rootScope', '$scope', '$http', '$location', 'global', '$timeout', 'weixin',
	function($rootScope, $scope, $http, $location, global, $timeout, weixin) {
		var env = this;

		weixin.setup();

		var id = $location.search().id;
		env.article = null;
		env.artist = null;
		var funcDelay = null;
		env.init = function(atc, ats){
			env.article = atc;
			env.artist = ats;
			global.dataReady = true;
			if (global.debugging())
				return;
			if (!weixin.info.ready){
				if (funcDelay)
					return;
				funcDelay = setTimeout(function(){
					funcDelay = null;
					env.init(atc, ats);
				}, 200);
				return;
			}
			weixin.fillShare({
				title: env.article.title,
				desc: '中国艺术研究院工笔画精品展 ' + env.curArticleBarCaption(),
				imgUrl: global.getImgUrl(env.artist.headimgurl, 0.25),
				success: function(){
					_czc.push(['_trackEvent', '文章页-'+env.artist.name, '分享', env.artist.id, '1']);
					_czc.push(['_trackEvent', '文章页-'+env.artist.name+'-'+env.article.id, '分享', env.article.id, '1']);
				}
			});
			funcDelay = null;
			_czc.push(['_trackEvent', '文章页-'+env.artist.name, '浏览', env.artist.id, '1']);
			_czc.push(['_trackEvent', '文章页-'+env.artist.name+'-'+env.article.id, '浏览', env.article.id, '1']);
		};

		if (global.debugging())
			env.init(global.datas.artist1.articles[0], global.datas.artist1.artist);
		else {
			$http.get('server.php?act=data-article&id=' + id).error(function(r, s, e){
				console.error(s, e);
			}).success(function(resp){
				env.init(resp.article, resp.artist);
			});
		}

		env.clickBack = function(a){
			window.localStorage.setItem('exh1-backing', 1);
			window.location.href = 'artist.html?id=' + env.article.artist_id;
		};
		env.curArticleBarCaption = function(){
			if (!env.article || !env.artist)
				return '';
			var cap = env.artist.name;
			if (env.article.type == 0)
				cap += '文章';
			else
				cap += '评论';
			return cap;
		};
	}
])
.directive('artistArticle', [
	function(){
		return {
			restrict: 'E',
			link: function(scope, elem, attrs){
				console.log('scope:',scope);
				scope.$watch('env.article', function(a){
					console.log('new article:',a);
					if (!a) return;
					elem.html(a.content);
				});
			}
		}
	}
]);