/**
 * 图片懒加载
 *     基于函数节流方法
 */
$(function() {
    var $img = $("#lazyload").find("img"),
        imgNum = $img.length,
        index = 0;

    // 页面加载完成,默认执行一次
    lazyload();

    // 显示真实图片
    function lazyload() {
        for (var i = index, $thisImg = $img.eq(i); i < imgNum; i++) {
            if ($thisImg.offset().top - $(window).height() - $(window).scrollTop() < 300) {
                if ($thisImg.attr("src") === "img/default.png") {
                    $thisImg.attr("src", $thisImg.attr("data-src"));
                    index = i + 1;
                }
            }
        }
    }

    // 图片加载失败
    $img.error(function() {
        $(this).prop("src", "img/error.png");
    });

    /**
     * 节流函数
     * @param  {[Function]} fun           [要执行的函数]
     * @param  {[Number]}   delay         [延迟时间，单位毫秒]
     * @param  {[Number]}   mustRunDelay  [最大延迟时间，单位毫秒]
     */
    function throttle(fun, delay, mustRunDelay) {
        var timeout,
            startTime = new Date();

        return function() {
            var context = this,
                args = arguments,
                curTime = new Date();

            clearTimeout(timeout);
            if (curTime - startTime >= mustRunDelay) {
                fun.apply(context, args);
                startTime = curTime;
            } else {
                timeout = setTimeout(fun, delay);
            }
        };
    };
    window.addEventListener('scroll', throttle(lazyload, 100, 500));
});
