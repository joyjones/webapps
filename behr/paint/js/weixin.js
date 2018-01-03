var weixin = {
    debug: false,
    info: {
        title: '百色熊墙面光泽大作战',
        desc: '涂料分光泽，墙面有光彩，挑战游戏，赢取百色熊好礼！',
        imgUrl: 'http://behr.sinaapp.com/paint/images/logo.jpg'
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
                        link: window.location.href,
                        success: function() {
                            // $.ajax({
                            //     url: getLocalUrl() + 'signup.php?act=record&field=shared_count',
                            // });
                        }
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