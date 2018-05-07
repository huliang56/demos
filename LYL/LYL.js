/**
 * 连线题
 *     连线、重置、判断是否正确
 * author: huliang;
 * date: 2017/6/16;
 */
(function() {
    // "连一连"容器
    var LYLcontainer = document.getElementById('LYLcontainer');
    // 划线的SVG对象
    var svgCanvas = document.getElementById('svgCanvas');
    // "连一连"主对象的容器
    var mainPart = document.getElementById('mainPart');
    // "连一连"中对象的组数
    var LYLNum = getLYLNum();
    // 划线开始计数的值
    var lineIndex = 1;
    // 划线状态
    var isDrawing = false;
    // 配置线条的样式
    var svgLine = {
        color: "#333",
        errorColor: "#f00",
        correctColor: "#5a8ccd",
        width: 1.5
    }
    var startPart, startLeft, startTop;

    LYLcontainer.addEventListener('touchstart', function(e) {
        var event = e || window.event;
        var startTarget = event.target;
        var isBox = startTarget.className.indexOf("LYL-box");
        startPart = startTarget.parentNode.getAttribute("data-part");
        // 若开始点不是选项、已连线，则返回
        if (isBox < 0 || startTarget.hasAttribute("data-line")) {
            return false;
        }

        event.preventDefault();

        var touch = event.targetTouches[0];
        startLeft = touch.clientX - LYLcontainer.offsetLeft;
        startTop = touch.clientY - LYLcontainer.offsetTop;

        var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        var lineId = "line_" + lineIndex;
        newLine.setAttribute('id', lineId);
        newLine.setAttribute('x1', startLeft);
        newLine.setAttribute('y1', startTop);
        newLine.setAttribute('x2', startLeft);
        newLine.setAttribute('y2', startTop);
        newLine.setAttribute('stroke', svgLine.color);
        newLine.setAttribute('stroke-width', svgLine.width);
        svgCanvas.appendChild(newLine);

        isDrawing = true;
    }, false);

    LYLcontainer.addEventListener('touchmove', function(e) {
        // 不在连线中，返回
        if (!isDrawing) {
            return false;
        }

        var event = e || window.event;
        var touch = event.targetTouches[0];
        var left = touch.clientX - LYLcontainer.offsetLeft;
        var top = touch.clientY - LYLcontainer.offsetTop;

        event.preventDefault();
        event.stopPropagation();

        updateLine(left, top);
    }, false);

    LYLcontainer.addEventListener('touchend', function(e) {
        // 不在连线中，返回
        if (!isDrawing) {
            isDrawing = false;
            return false;
        }

        var event = e || window.event;
        var startTarget = event.target;
        // 根据结束位置点获取当前元素
        var endTarget = document.elementFromPoint(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
        var isBox = endTarget.className.indexOf("LYL-box");
        // 若结束点不是选项，则取消划线
        if (isBox < 0) {
            cancelLine();
            return false;
        }

        var endPart = endTarget.parentNode.getAttribute("data-part");
        // 若结束点是同侧的、已连线，则取消划线
        if (startPart === endPart || endTarget.hasAttribute("data-line")) {
            cancelLine();
            return false;
        }

        // 连线成功
        var lineId = "line_" + lineIndex;
        startTarget.setAttribute("data-line", lineId);
        endTarget.setAttribute("data-line", lineId);

        isDrawing = false;
        // 所有选项已连完，判断是否正确
        if (lineIndex === LYLNum) {
            checkLYLAnswer();
        }

        lineIndex++;
    }, false);

    // 实时划线
    function updateLine(nowLeft, nowTop) {
        var lineId = "line_" + lineIndex;
        var nowLine = document.getElementById(lineId);
        nowLine.setAttribute('x2', nowLeft);
        nowLine.setAttribute('y2', nowTop);
    }

    // 取消划线
    function cancelLine() {
        var lineId = "line_" + lineIndex;
        var nowLine = document.getElementById(lineId);
        nowLine && nowLine.remove();
        isDrawing = false;
    }

    // 重置连一连面板
    var LYLReset = document.getElementById("LYLReset");
    LYLReset.onclick = function () {
        // 去除所有的线
        var lines = svgCanvas.childNodes;
        while (lines[0]) {
            svgCanvas.removeChild(lines[0]);
        }
        // 去除已连线的标记
        var LYLBox = document.querySelectorAll(".LYL-box");
        for (var j = 0, len = LYLBox.length; j < len; j++) {
            LYLBox[j].removeAttribute("data-line");
        }
        lineIndex = 1;
    }

    // 获取连一连的选项数量（仅一侧）
    function getLYLNum() {
        return mainPart.children.length;
    }

    // 判断连线是否正确
    function checkLYLAnswer() {
        var mainChilds = mainPart.children;
        for (var i = 0, len = mainChilds.length; i < len; i++) {
            var lineId = mainChilds[i].getAttribute("data-line"),
                matchId = mainChilds[i].getAttribute("data-match"),
                boxId = document.getElementById(matchId),
                matchLine = boxId.getAttribute("data-line"),
                line = document.getElementById(lineId);
            // 根据该对象预设的元素所连接的线ID和该对象实际连接的线是否相等，判断是否正确
            if (matchLine === lineId) {
                line.setAttribute('stroke', svgLine.correctColor);
            } else {
                line.setAttribute('stroke', svgLine.errorColor);
            }
        }
    }
}());
