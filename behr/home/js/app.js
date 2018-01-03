
var configs = {
	activated: true,
	shareInfo: {
		title: 'BEHR百色熊斑斓色彩定制家',
		desc: '挚爱配色PK对决，发现你房间的色彩小秘密！',
		link: window.location.href,
		imgUrl: getLocalUrl() + 'images/logo.jpg',
		type: 'link',
		success: function () {
		},
		cancel: function () {
		}
	},
};

var app = (function(){
	return {
		init: function(){
			if (!configs.activated){
				alert('页面已停用。');
				return false;
			}
			$.ajax({
	      		url: '../lib/wxentry.php',
				dataType: 'json',
				error: function(r, s, e){
					// alert(errorstr('wxinit', r, s, e));
					console.log(s, e);
				},
				success: function(resp){
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
					wx.ready(function () {
						app.setShareInfo();
					});
				}
			});
			wx.error(function (res) {
				alert('wxerror: ' + res.errMsg);
			});
			return true;
		},
		setShareInfo: function(title, desc, url, logo) {
			title && (configs.shareInfo.title = title);
			desc && (configs.shareInfo.description = desc);
			url && (configs.shareInfo.link = url);
			logo && (configs.shareInfo.imgUrl = logo);
			wx.onMenuShareAppMessage(configs.shareInfo);
			wx.onMenuShareTimeline(configs.shareInfo);
		},
	}
})();
