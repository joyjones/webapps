var weixin = {
    debug: false,
    info: null,
    fillShare: function(info) {
        wx.onMenuShareAppMessage(info);
        wx.onMenuShareTimeline(info);
    },
    init: function(info, apis, callbk){
        if (this.debug) return;
        $.ajax({
            url: '/lib/wxentry.php',
            dataType: 'json',
            error: function(r, s, e){
                console.log(s, e);
                // alert('访问微信入口功能失败！');
            },
            success: function(resp){
                wx.ready(function () {
                    this.info = $.extend({}, info, {
                        type: 'link',
                        link: window.location.href
                    });
                    weixin.fillShare(this.info);
                    callbk && callbk();
                });
                
                if (!apis)
                    apis = [];
                apis.push('onMenuShareAppMessage');
                apis.push('onMenuShareTimeline');
                
                wx.config({
                    debug: false,
                    appId: resp.appId,
                    timestamp: resp.timestamp,
                    nonceStr: resp.nonceStr,
                    signature: resp.signature,
                    jsApiList: apis
                });
            }
        });

        wx.error(function (res) {
            // alert('微信接口错误:' + res.errMsg);
        });
    }
};