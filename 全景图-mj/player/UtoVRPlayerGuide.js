/**
 * Created with IntelliJ IDEA.
 * User: moo
 * Date: 14-11-18
 * Time: 下午4:06
 * 全景视频播放器入口文件
 */
/*json Event*/
"object" !== typeof JSON && (JSON = {});
(function () {
    function m(a) {
        return 10 > a ? "0" + a : a
    }

    function r() {
        return this.valueOf()
    }

    function t(a) {
        u.lastIndex = 0;
        return u.test(a) ? '"' + a.replace(u, function (a) {
            var c = w[a];
            return "string" === typeof c ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + a + '"'
    }

    function p(a, l) {
        var c, d, h, q, g = e, f, b = l[a];
        b && "object" === typeof b && "function" === typeof b.toJSON && (b = b.toJSON(a));
        "function" === typeof k && (b = k.call(l, a, b));
        switch (typeof b) {
            case "string":
                return t(b);
            case "number":
                return isFinite(b) ? String(b) :
                    "null";
            case "boolean":
            case "null":
                return String(b);
            case "object":
                if (!b)return "null";
                e += n;
                f = [];
                if ("[object Array]" === Object.prototype.toString.apply(b)) {
                    q = b.length;
                    for (c = 0; c < q; c += 1)f[c] = p(c, b) || "null";
                    h = 0 === f.length ? "[]" : e ? "[\n" + e + f.join(",\n" + e) + "\n" + g + "]" : "[" + f.join(",") + "]";
                    e = g;
                    return h
                }
                if (k && "object" === typeof k)for (q = k.length, c = 0; c < q; c += 1)"string" === typeof k[c] && (d = k[c], (h = p(d, b)) && f.push(t(d) + (e ? ": " : ":") + h)); else for (d in b)Object.prototype.hasOwnProperty.call(b, d) && (h = p(d, b)) && f.push(t(d) + (e ?
                        ": " : ":") + h);
                h = 0 === f.length ? "{}" : e ? "{\n" + e + f.join(",\n" + e) + "\n" + g + "}" : "{" + f.join(",") + "}";
                e = g;
                return h
        }
    }

    var x = /^[\],:{}\s]*$/, y = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, z = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, A = /(?:^|:|,)(?:\s*\[)+/g, u = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, v = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    "function" !== typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + m(this.getUTCMonth() + 1) + "-" + m(this.getUTCDate()) + "T" + m(this.getUTCHours()) + ":" + m(this.getUTCMinutes()) + ":" + m(this.getUTCSeconds()) + "Z" : null
    }, Boolean.prototype.toJSON = r, Number.prototype.toJSON = r, String.prototype.toJSON = r);
    var e, n, w, k;
    "function" !== typeof JSON.stringify && (w = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    }, JSON.stringify =
        function (a, l, c) {
            var d;
            n = e = "";
            if ("number" === typeof c)for (d = 0; d < c; d += 1)n += " "; else"string" === typeof c && (n = c);
            if ((k = l) && "function" !== typeof l && ("object" !== typeof l || "number" !== typeof l.length))throw Error("JSON.stringify");
            return p("", {"": a})
        });
    "function" !== typeof JSON.parse && (JSON.parse = function (a, e) {
        function c(a, d) {
            var g, f, b = a[d];
            if (b && "object" === typeof b)for (g in b)Object.prototype.hasOwnProperty.call(b, g) && (f = c(b, g), void 0 !== f ? b[g] = f : delete b[g]);
            return e.call(a, d, b)
        }

        var d;
        a = String(a);
        v.lastIndex =
            0;
        v.test(a) && (a = a.replace(v, function (a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (x.test(a.replace(y, "@").replace(z, "]").replace(A, "")))return d = eval("(" + a + ")"), "function" === typeof e ? c({"": d}, "") : d;
        throw new SyntaxError("JSON.parse");
    })
})();
(function () {
    var getBasePath = function () {
        var stack;
        try {
            a.b.c(); //强制报错,以便捕获e.stack
        } catch (e) { //safari的错误对象只有line,sourceId,sourceURL
            stack = e.stack;
            if (!stack && window.opera) {
                //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
                stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
            }
        }
        if (stack) {
            stack = stack.split(/[@ ]/g).pop(); //取得最后一行,最后一个空格或@之后的部分
            stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, ""); //去掉换行符
            stack = stack.replace(/(:\d+)?:\d+$/i, ""); //去掉行号与或许存在的出错字符起始位置
        }
        if (!stack) {//IE与chrome4- opera10+
            var scripts = document.getElementsByTagName("script");
            var reg = /UtoVRPlayerGuide.js/i, src;
            for (var i = 0, el; el = scripts[i++];) {
                src = !!document.querySelector ? el.src : el.getAttribute("src", 4);
                if (src && reg.test(src)) {
                    stack = src;
                    break;
                }
            }
        }
        return stack.substr(0, stack.lastIndexOf('/'));
    };
    /*获取后缀*/
    var getFileExt = function (str) {
        var d = /\.[^\.]+$/.exec(str);
        return (d ? d[0] : null);
    };
    /*获取url的参数*/
    var getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]);
        return null;
    };
    var jsRootPath = getBasePath();
    //播放器绝对路径调试参数配置  路径不带最后的"/"
    var UtoVR_Player_Lib = jsRootPath + "/UtoVRPlayer.js",
        UtoVR_Player_SWF = jsRootPath + "/UtoVRPlayer.swf",
        videoBarCss = jsRootPath + "/plugin/videoToolBar/style/videobar.css",
        videoBarLib = jsRootPath + "/plugin/videoToolBar/js/video_toolbar.js",
        iPhoneInlineVideoLib = jsRootPath + "/plugin/inlineVideo/inlineVideo.js",
        gyroLib = jsRootPath + "/plugin/gyro/gyro.js",
        hlsLib = jsRootPath + "/plugin/hls/hls.js",
        video2DLib = jsRootPath + "/plugin/3DVideo/3DVideo.js",
        bgPanoImg = jsRootPath + "/panoBG/image3D.jpg";
    //剧场模式的pt值
    var PTArr = [146, 25, 212, 25, 212, -10, 146, -10];
    var initFov = 100;
    var initPan = 0;
    //创建dom
    var createDom = function (tagName) {
        return document.createElement(tagName);
    };
    //浏览器插件支持检测 支持 flash pdf java
    var support_Flash = function () {
        var pluginFlashSupported = false;
        var flashVer = [];
        var pluginList = {
            flash: {
                activex: "ShockwaveFlash.ShockwaveFlash",
                plugin: /flash/gim
            }
        };
        if (window.ActiveXObject) {
            try {
                var AXObj = new ActiveXObject(pluginList.flash.activex);
                pluginFlashSupported = true;
                flashVer = AXObj.GetVariable("$version").split(" ")[1].split(",");
            } catch (e) {
                pluginFlashSupported = false;
            }
        }
        else {
            for (var i = 0; i < navigator.plugins.length; i++) {
                var pluginsObj = navigator.plugins[i];
                if (pluginsObj.name.match(pluginList.flash.plugin)) {
                    pluginFlashSupported = true;
                    flashVer = pluginsObj.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split(".");
                    break;
                }
            }
        }
        var flashInfo = {
            support: pluginFlashSupported,
            maxVersion: flashVer[0] * 1,
            minVersion: flashVer[1] * 1,
            allVersion: flashVer.toString()
        };
        if (flashInfo.support && flashInfo.maxVersion >= 11) {
            return true;
        } else {
            return false
        }
    };
    /*判断是否支持webGL*/
    var support_WebGL = function () {
        if (!!window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas"),
                names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                gl = false;
            for (var i in names) {
                try {
                    gl = canvas.getContext(names[i]);
                    if (gl && typeof gl.getParameter == "function") {
                        return true;
                    }
                } catch (e) {
                }
            }
            return false;
        }
        return false;
    };
    //加载script
    var includeJS = function (arr, callback) {
        var length = arr.length;
        var loadNum = 0;
        for (var i = 0; i < length; i++) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = arr[i] + "?t=20170221"/*;// */;// + "?" + new Date().getTime();
            script.charset = "utf-8";
            script.onload = function () {
                if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                    ++loadNum;
                    if (loadNum === length) {
                        callback && callback();
                    }
                }
            };
            script.onerror = function () {
                ++loadNum;
                if (loadNum === length) {
                    callback && callback();
                }

            };
            document.getElementsByTagName("head")[0].appendChild(script)
        }

    };
    //加载css
    var includeCss = function (arr, callback) {
        var length = arr.length;
        var loadNum = 0;
        for (var i = 0; i < length; i++) {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.charset = "utf-8";
            link.href = arr[i] +  "?t=20170221"/*;// */;//+   "?" + new Date().getTime();
            link.onload = function () {
                if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                    ++loadNum;
                    if (loadNum === length) {
                        callback && callback();
                    }
                }
            };
            document.getElementsByTagName("head")[0].appendChild(link)
        }
    };
    //三种播放器模式的初始值
    var flash_Play = support_Flash(),
        webGL_Play = support_WebGL();
    //获取顶部域名
    var getTopDomain = function () {
        var domain = "";
        try {
            if (window.top == window) {
                domain = "";
            } else {
                domain = window.top.location.href;
            }
        } catch (e) {
            domain = ""
        }
        return domain;
    };
    //实例化flash播放器
    var initFlashPlayer = function (PConfig,TConfig,vcode,isShare) {
        /*flash参数特殊处理*/
        var container = PConfig["container"];
        delete  PConfig["container"];
        var sceneArr = PConfig["scenesArr"];
        delete PConfig["scenesArr"];
        var bgPano = [
            {
                bgId: "bgpano1",
                bgName: "剧场环境",
                path: sceneArr[0]["sceneBGPath"] || bgPanoImg
            }
        ];
        //添加embed变量值
        var addVars = "";
        var scenePath = sceneArr[0]["sceneFilePath"];
        var ipan = (sceneArr[0]["initPan"] || initPan) + 180;
        var ifov = (sceneArr[0]["initFov"] || initFov);
        var videoType = sceneArr[0]["videoType"];
        sceneArr[0]["initPan"] = ipan;
        sceneArr[0]["initFov"] = ifov;
        sceneArr[0]["videoPT"] = PTArr;
        sceneArr[0]["bgPano"] = bgPano;
        sceneArr[0]["videoType"] = videoType;
        PConfig["base"] = location.href;
        var topDomain = getTopDomain();
        if (topDomain) PConfig["topBase"] = topDomain;
        PConfig["scenesArr"] = sceneArr;
        addVars = JSON.stringify(PConfig);
        addVars = addVars.replace(/\"/g, "'");
        addVars = encodeURIComponent(addVars);
        addVars = 'params=' + addVars;
        var swfObject = createDom("embed");
        //todo:flash默认使用direct
        var wmodeSTR = getQueryString("wmode") || "opaque"; //direct  默认情况下不启用硬件加速
        ///////////////////
        var swfPath = UtoVR_Player_SWF+"?t=1";
        if(vcode)swfPath += "&vcode=" + vcode;
        if(isShare)swfPath +="&isShare=true";
        var addParams = {
            type: "application/x-shockwave-flash",
            src: swfPath,
            width: "100%",
            height: "100%",
            id: "sotester",
            name: "sotester",
            bgcolor: "#FFFFFF",
            quality: "high",
            allownetworking: "all",
            allowscriptaccess: "always",
            allowfullscreen: "true",
            scale: "noscale",
            wmode: wmodeSTR
        };
        for (var key in addParams) {
            swfObject.setAttribute(key, addParams[key]);
        }
        //添加embed样式值
        var addStyles = {
            position: "absolute",
            width: "100%",
            height: "100%",
            left: "0px",
            top: "0px"
        };
        for (var key in addStyles) {
            swfObject.style[key] = addStyles[key]
        }
        swfObject.setAttribute('flashvars', addVars);
        container = container ? container : document.body;
        container.appendChild(swfObject);
    };
    var UTPlayerObj, UTToolBarObj;
    /*判断是否支持hls*/
    var isHLSSupported = function () {
        return (window.MediaSource && window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"'));
    };
    //实例化html5播放器
    var initHTML5Player = function (PConfig, TConfig,vcode,isShare) {
        //包含视频的css
        includeCss([videoBarCss]);
        var sceneArr = PConfig["scenesArr"];
        delete  PConfig["scenesArr"];
        //todo:SDK包含默认lib
        var loadArr = [UtoVR_Player_Lib, videoBarLib];
        //todo：如果移动端添加陀螺仪lib
        ("ontouchstart" in window) && loadArr.push(gyroLib);
        //todo:ios的行内播放支持
        var isWhitelisted = /iPhone|iPod/i.test(navigator.userAgent) && !matchMedia('(-webkit-video-playable-inline)').matches;
        isWhitelisted&&loadArr.push(iPhoneInlineVideoLib);
        //todo:如果是视频剧场模式添加lib
        if (sceneArr[0]["sceneMode"] == "2DVideo")loadArr.push(video2DLib);
        //todo:fsCallBack只有在浏览器不支持全屏api的情况下才会调用该函数
        var fsCallBack = PConfig["fsCallBack"];
        //todo:pc上面添加lib
        isHLSSupported() && (getFileExt(sceneArr[0]["sceneFilePath"]) === ".m3u8") && !("ontouchstart" in window) && loadArr.push(hlsLib);
        includeJS(loadArr, function () {
            //todo：根据插件动态配置
            //播放器配置的参数
            //todo:添加剧场模式的配置
            if (sceneArr[0]["sceneMode"] == "2DVideo") {
                //剧场模式下禁用右击
                PConfig["isRightClick"] = false;
                var sceneJSON = {
                    sceneId: "2DVideoID",
                    sceneFilePath: sceneArr[0]["sceneBGPath"] || bgPanoImg,
                    sceneType: "Sphere",
                    initFov: sceneArr[0]["initFov"] || initFov
                };
                PConfig["scenesArr"] = [sceneJSON];
            }
            else {
                PConfig["scenesArr"] = sceneArr;
            }
            var UTConfig = {
                container: PConfig["container"] || document.body,
                name: PConfig["name"] || "UToVRDesk",
                dragDirectionMode: PConfig["dragDirectionMode"],
                dragMode: PConfig["dragMode"] || false,
                isAutoRotate: PConfig["isAutoRotate"] || false,
                isMouseWheel: PConfig["isMouseWheel"],
                isDBClick: PConfig["isDBClick"],
                isDBViewPort: PConfig["isDBViewPort"] || false,
                DBViewIPD: PConfig["DBViewIPD"],
                isGyro: PConfig["isGyro"] || false,
                isDragAble: PConfig["isDragAble"],
                isLive:PConfig["isLive"],
                fullScreenDom:PConfig["fullScreenDom"],
                isMoveVideoFrame:PConfig["isMoveVideoFrame"],
                scenesArr: PConfig["scenesArr"],
                initOverCallBack: function () {
                    var type = this.api_getCurSceneType();
                    //if(type === "Video"){
                        //todo:实例化默认的工具栏
                        UTToolBarObj = new TWToolbarClass({container: this.target}, this, fsCallBack,TConfig);
                        UTToolBarObj && UTToolBarObj.setDefault();
                    //}
                    typeof PConfig.initOverCallBack === "function" && PConfig.initOverCallBack.call(this, UTToolBarObj);
                },
                sceneResizeCallBack: function () {
                    UTToolBarObj && UTToolBarObj.resize();
                    typeof PConfig.sceneResizeCallBack === "function" && PConfig.sceneResizeCallBack.call(this, UTToolBarObj);
                },
                fullScreenChangeCallBack: function () {
                    if(UTToolBarObj){
                        UTToolBarObj.resize();
                        UTToolBarObj.setFullScreenStatus();
                    }
                    typeof PConfig.fullScreenChangeCallBack === "function" && PConfig.fullScreenChangeCallBack.call(this, UTToolBarObj);
                },
                videoLoadProgressCallBack: function () {
                    UTToolBarObj && UTToolBarObj.getUpdateBuffered();
                    typeof PConfig.videoLoadProgressCallBack === "function" && PConfig.videoLoadProgressCallBack.call(this, UTToolBarObj);
                },
                videoTogglePlayCallBack:function(){
                    //如果有进度条则实时更新
                    UTToolBarObj && UTToolBarObj.setPlayStatus();
                    typeof PConfig.videoTogglePlayCallBack === "function" && PConfig.videoTogglePlayCallBack.call(this, UTToolBarObj);
                },
                videoUpdateCallBack: function () {
                    //document.getElementsByTagName("title")[0].innerHTML = "upadte";
                    //如果有进度条则实时更新
                    UTToolBarObj && UTToolBarObj.updateProperties();

                    typeof PConfig.videoUpdateCallBack === "function" && PConfig.videoUpdateCallBack.call(this, UTToolBarObj);
                },
                videoLoadMetaDataCallBack: function () {
                    //todo:更新默认的工具栏
                    UTToolBarObj && UTToolBarObj.updateProperties();
                    typeof PConfig.videoLoadMetaDataCallBack === "function" && PConfig.videoLoadMetaDataCallBack.call(this, UTToolBarObj);
                },
                errorCallBack:function(e){
                    UTToolBarObj && UTToolBarObj.deleteBeginLayer();
                    typeof PConfig.errorCallBack === "function" && PConfig.errorCallBack(e);
                }
            };
            typeof PConfig.videoCanPlayerCallBack === "function" && (UTConfig.videoCanPlayerCallBack = PConfig.videoCanPlayerCallBack);
            typeof PConfig.loadedCallBack === "function" && (UTConfig.loadedCallBack = PConfig.loadedCallBack);
            typeof PConfig.drawWebGLCallBack === "function" && (UTConfig.drawWebGLCallBack = PConfig.drawWebGLCallBack);
            typeof PConfig.videoPlayerCallBack === "function" && (UTConfig.videoPlayerCallBack = PConfig.videoPlayerCallBack);
            typeof PConfig.scenePanTiltFovChangerCallBack === "function" && (UTConfig.scenePanTiltFovChangerCallBack = PConfig.scenePanTiltFovChangerCallBack);
            typeof PConfig.sceneEventMoveCallBack === "function" && (UTConfig.sceneEventMoveCallBack = PConfig.sceneEventMoveCallBack);
            typeof PConfig.sceneEventUpCallBack === "function" && (UTConfig.sceneEventUpCallBack = PConfig.sceneEventUpCallBack);
            typeof PConfig.sceneEventClickCallBack === "function" && (UTConfig.sceneEventClickCallBack = PConfig.sceneEventClickCallBack);
            typeof PConfig.sceneEventDownCallBack === "function" && (UTConfig.sceneEventDownCallBack = PConfig.sceneEventDownCallBack);
            typeof PConfig.videoLoadStartCallBack === "function" && (UTConfig.videoLoadStartCallBack = PConfig.videoLoadStartCallBack);
            typeof PConfig.videoPlayEndCallBack === "function" && (UTConfig.videoPlayEndCallBack = PConfig.videoPlayEndCallBack);
            typeof PConfig.setVideoCurTimeCallBack === "function" && (UTConfig.setVideoCurTimeCallBack = PConfig.setVideoCurTimeCallBack);
            typeof PConfig.changeSucessCallBack === "function" && (UTConfig.changeSucessCallBack = PConfig.changeSucessCallBack);
            typeof PConfig.changeErrorCallBack === "function" && (UTConfig.changeErrorCallBack = PConfig.changeErrorCallBack);
            UTPlayerObj = new JTPlay(UTConfig);
        });
    };
    //自动匹配播放模式
    var initAutoPlayer = function (PConfig, TConfig,vcode,isShare) {
        var mode = "html5";
        if (webGL_Play) {
            initHTML5Player(PConfig, TConfig,vcode,isShare);
        } else if (flash_Play) {
            initFlashPlayer(PConfig,TConfig,vcode,isShare);
            mode = "flash";
        } else {
            initHTML5Player(PConfig, TConfig,vcode,isShare);
        }
        return mode;

    };
    /*获取是否是Debug链接*/
    var checkPlayMode = function () {
        var search = window.location.search;
        if (search.indexOf("playMode=html5") > 0) {
            return "html5";
        } else if (search.indexOf("playMode=flash") > 0) {
            return "flash";
        } else {
            return "auto";
        }
    };

    window.initLoad = function (PConfig, callback, TConfig,vcode,isShare) {
        if (!PConfig)return;
        var playMode = checkPlayMode();
        var ua = navigator.userAgent.toLowerCase();//"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/31.0.2623.75 Safari/537.36".toLocaleLowerCase();//
        //todo:如果是直播流 默认使用flash
        /*if (PConfig["isLive"] === true) {
         playMode = "flash"
         }*/
        if (PConfig.scenesArr[0]["sceneFilePath"].indexOf("rtmp://") == 0) {
            playMode = "flash";
        }
        //"Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.2; Shuame; rv:11.0) like Gecko"
        //todo:如果是本地模式切换成flash 播放
        !ua.match(/firefox/) && (window.location.protocol == "file:") && (playMode = "flash");
        //todo: IE内核切换到flash 模式（不能读取跨域纹理）
        (ua.match(/msie|trident/)) && (playMode = "flash");
        //(ua.match(/msie|trident/)) && (ua.match(/rv:11/)) && (playMode = "html5");
        //todo:mac Safari内核 （不能读取跨域纹理）
        ua.match(/macintosh/) && !ua.match(/firefox|chrome|opera/) && (playMode = "flash");
        //todo:chrome 内核低于30的切换到flash
        !!ua.match(/chrome\/(\d+\.\d)/) && (ua.match(/chrome\/(\d+\.\d)/)[1] * 1 < 30) && (playMode = "flash");
        //hls 播放地址切换成html5
        //if (getFileExt(PConfig.scenesArr[0]["sceneFilePath"]) == ".m3u8")playMode = "html5";
        //  playMode = "flash";
        if (playMode === "html5" && webGL_Play) {
            initHTML5Player(PConfig, TConfig,vcode,isShare);
        } else if (playMode === "flash" && flash_Play) {
            initFlashPlayer(PConfig,TConfig,vcode,isShare);
        } else {
            //自动匹配模式 优先级别 flash Html5
            playMode = initAutoPlayer(PConfig, TConfig,vcode,isShare);
        }
        typeof callback === "function" && callback(playMode);
    };
})();