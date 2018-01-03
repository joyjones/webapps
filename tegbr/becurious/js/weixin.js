var weixin = {
    debug: false,
    info: {
        title: '《经济学人•全球商业评论》邀你进行商业问答测试，来试试吧！',
        desc: '《经济学人•全球商业评论》邀你进行商业问答测试，来试试吧！',
        imgUrl: 'http://tegbr.sinaapp.com/becurious/img/logo.jpg'
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
                alert('访问微信入口功能失败！');
            },
            success: function(resp){
                wx.ready(function () {
                    weixin.fillShare($.extend({}, weixin.info, {
                        type: 'link',
                        link: window.location.href
                    }));
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
            }
        });

        wx.error(function (res) {
            // alert('微信接口错误:' + res.errMsg);
        });
    }
};