

var config = {
    online: [1][0],
    st: '00b4b7',
    login: [][0],
    uid: '',
    pageConfig: [null][0] || {},
    wm: '3333_2001',
    version: '',
    url: location.href.split('#')[0]
};
var $render_data = [{
    "ok": 1,
    "msg": "全景图片信息获取成功",
    "data": {
        "img_url": "img.jpg",
        "ld_url": "http://panoimg.us.sinaimg.cn/000ui7Bijx07dstTj9DN010f01001rRT0k01",
        "hd_url": "http://panoimg.us.sinaimg.cn/002PESK1jx07dstThrS7010f01004v2M0k01"
    },
    "cache": 1
}][0] || {};


var fullwrap = document.getElementById('fullwrap');
var picArr = [];
if ($render_data && $render_data.data && $render_data.data.img_url) {
    var img = new Image();
    // img.src = $render_data.data.img_url;
    var img_url = $render_data.data.img_url;
    img.className = 'hid';
    img.src = img_url;
    fullwrap.appendChild(img);
    if (img.complete) {
        imgLoaded(img_url);
        fullwrap.removeChild(img);
    } else {
        img.addEventListener('load', function() {
            imgLoaded(img_url);
            fullwrap.removeChild(img);
        });
    }
    img.addEventListener('error', function() {
        alert("图片加载失败！");
    });
}

function imgLoaded(url) {
    picArr.push(url);
    if (fullwrap) {
        var t = new Panorama({
            el: fullwrap,
            picArray: picArr,
            canvasW: fullwrap.offsetWidth,
            canvasH: fullwrap.offsetHeight,
            autoRander: false,
            closeDeviceOri: false,
        });
        // pc如果需要兼容屏幕改变事件示例:
        window.addEventListener('resize', function () {
            if (t) {
                t.onResize(fullwrap.offsetWidth, fullwrap.offsetHeight);
            }
        }, false);
        fullwrap.classList = 'wrap';
    }
}
