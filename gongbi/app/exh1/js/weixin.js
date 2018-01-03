app.factory('weixin', ['global', '$http', function(global, $http) {
	return {
		info: {
			sharing: {
				type: 'link',
				title: '中国艺术研究院工笔画精品展',
				desc: '中国艺术研究院工笔画精品展',
				imgUrl: global.appUrl + 'img/logo.jpg',
				link: window.location.href,
			},
			ready: false,
			latest: null,
		},
		setup: function(callbk){
			if (global.debugging()){
				callbk && callbk();
				return;
			}
			var me = this;
			$http.get('/dep/wxentry.php').error(function(r, s, e){
				console.log(s, e);
				alert('访问微信入口功能失败！' + JSON.stringify(r) + s + e);
				console.debug(r.responseText?r.responseText:r);
				callbk && callbk();
			}).success(function(resp){
				wx.ready(function() {
					me.info.ready = true;
					me.fillShare({title: document.title});
					callbk && callbk();
				});

				wx.config({
					debug: false,
					appId: resp.appId,
					timestamp: resp.timestamp,
					nonceStr: resp.nonceStr,
					signature: resp.signature,
					jsApiList: [
						'onMenuShareAppMessage',
						'onMenuShareTimeline',
					]
				});
			});

			wx.error(function (res) {
				console.log('微信接口错误:' + res.errMsg);
			});
		},
		isReady: function(){
			return this.info.ready;
		},
		fillShare: function(exinfo) {
			exinfo = angular.extend({}, this.info.sharing, exinfo);
			if (!this.info.ready){
				this.info.latest = exinfo;
			}
			else{
				if (this.info.latest){
					exinfo = angular.extend({}, exinfo, this.info.latest);
					this.info.latest = null;
				}
				wx.onMenuShareAppMessage(exinfo);
				wx.onMenuShareTimeline(exinfo);
			}
		}
	};
}]);
