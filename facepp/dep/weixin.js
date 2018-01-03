var weixin = {
    debug: false,
    info: null,
    ready: false,
    fillShare: function(exinfo) {
        exinfo = $.extend({}, this.info, exinfo);
        if (!this.ready){
            this.latestInfo = exinfo;
        }
        else{
            if (this.latestInfo){
                exinfo = $.extend({}, exinfo, this.latestInfo);
                this.latestInfo = null;
            }
            wx.onMenuShareAppMessage(exinfo);
            wx.onMenuShareTimeline(exinfo);
        }
    },
    isInWeixin: function(){
        return /MicroMessenger/.test(navigator.userAgent);
    },
    init: function(info, apis, callbk){
        if (this.debug) return;
        var me = this;
        $.ajax({
            url: '/fungames/dep/wxSign.php',
            dataType: 'json',
            error: function(r, s, e){
                console.log(s, e);
            },
            success: function(resp){
                wx.ready(function () {
                    me.info = $.extend({}, info, {
                        type: 'link',
                        link: window.location.href
                    });
                    me.ready = true;
                    weixin.fillShare(me.info);
                    callbk && callbk();
                });

                !apis && (apis = []);
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
    },
    chooseImage: function(count, callbk){
        if (!count || count < 0)
            count = 1;
        else if (!count || count > 9)
            count = 9;
        wx.chooseImage({
            count: count, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                console.log('localIds:', localIds);
                callbk && callbk(true, localIds);
            }
        });
    },
    previewImage: function(url, urls){
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        });
    },
    uploadImage: function(url, callbk){
        wx.uploadImage({
            localId: url, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                callbk && callbk(true, res);
            },
            fail: function(res){
                callbk && callbk(false, res);
            }
        });
    }
};