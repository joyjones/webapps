var weixin = {
    debug: false,
    info: {
        title: '《经济学人·全球商业评论》 顶尖商业报告免费相送',
        desc: '下载《商论》App, 就会获得《商论》主编撰写的精彩商业报告。《经济学人·全球商业评论》，助你成为下一代全球商业领导者。',
        imgUrl: 'http://skyemedia.sinaapp.com/leader/images/logo.png'
    },
    fillShare: function(info) {
        wx.onMenuShareAppMessage(info);
        wx.onMenuShareTimeline(info);
    },
    init: function(callbk){
        if (this.debug) return;
        $.ajax({
            url: '../lib/wxentry.php',
            dataType: 'json',
            error: function(r, s, e){
                console.log(s, e);
                // alert('访问微信入口功能失败！');
                callbk && callbk(false);
            },
            success: function(resp){
                wx.ready(function () {
                    weixin.fillShare($.extend({}, weixin.info, {
                        type: 'link',
                        // link: window.location.href,
                        link: 'http://skyemedia.sinaapp.com/leader/',
                    }));
                    callbk && callbk(true);
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
            }
        });

        wx.error(function (res) {
            // alert('微信接口错误:' + res.errMsg);
        });
    }
};