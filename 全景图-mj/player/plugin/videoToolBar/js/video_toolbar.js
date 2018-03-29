(function () {
    /*判断是否支持hls*/
    var isHLSSupported = function () {
        return (window.MediaSource && window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"'));
    };
    window.TWToolbarClass = function (options, playerObj, fsCallBack, tConfig) {
        this.container = options.container || document.body;
        this.browser = JTUtil['getBrowser']();
        this.player = playerObj;

        this.fullStatus = false;
        this.fullScreenCallBack = (typeof fsCallBack == "function") ? fsCallBack : function () {
            alert("浏览器不支持全屏！");
        };
        this.videoList = (tConfig && tConfig.videoList) ? tConfig.videoList : [];
        this.videoQuality = (tConfig && tConfig.videoQuality) || 0;
        this.isSupportHLS = isHLSSupported();
        this.createDOM();
        var type = this.player.api_getCurSceneType();
        var self = this;
        if (type == "Video") {
            this.togglePlay = function () {
                if (!this.player.api_getVideoPlayStatus()) {
                    this.player.api_setVideoPlay();
                    this.deleteBeginLayer();
                } else {
                    this.player.api_setVideoPause();
                }
                this.setPlayStatus();
            };
            //播放暂停事件绑定
            EventUtil['addEvent'](this.videoTogglePlay, "click", function () {
                self.togglePlay();
            });
            this.isDown = false;
            this.BoundingEventDom = null;
            //播放进度条事件
            EventUtil['addEvent'](this.videoScroll, "mousedown", function (e) {
                EventUtil["stopDefault"](e);
                EventUtil["stopPropagation"](e);
                e = e.changedTouches && e.changedTouches[0] || e;
                self.isDown = true;
                self.BoundingEventDom = self.videoScroll.getBoundingClientRect();
                //计算水平的百分比
                var p = (e.pageX - self.BoundingEventDom.left) / self.BoundingEventDom.width;
                self.updateCurTime(p);
            });
            EventUtil['addEvent'](this.videoScroll, "mousemove", function (e) {
                if (self.isDown) {
                    e = e.changedTouches && e.changedTouches[0] || e;
                    //计算水平的百分比
                    var p = (e.pageX - self.BoundingEventDom.left) / self.BoundingEventDom.width;
                    self.updateCurTime(p);
                }
            });
            EventUtil['addEvent'](this.videoScroll, "mouseup", function (e) {
                EventUtil["stopDefault"](e);
                EventUtil["stopPropagation"](e);
                self.isDown = false;
            });
            EventUtil['addEvent'](this.videoScroll, "mouseout", function (e) {
                EventUtil["stopDefault"](e);
                EventUtil["stopPropagation"](e);
                self.isDown = false;
            });
            //开始引导
            this.createBeginLayer();
        }


        //全屏事件绑定
        EventUtil['addEvent'](this.videoFullScreen, "click", function () {
            //如果浏览器不支持全屏api
            /* if (!JTUtil['isSupportFullScreen']()) {
             (typeof  self.fullScreenCallBack == "function") && self.fullScreenCallBack(self.fullStatus, self.player);
             } else {
             JTUtil['isFullScreen']() ? self.player.api_exitFullScreen() : self.player.api_enterFullScreen();
             }*/
            var isVRModel = self.player.api_getViewPortStatus();
            self.player.api_setViewPortStatus(!isVRModel);
            // !isVRModel ? self.player.api_enterVRModel() : self.player.api_exitVRModel();
            self.setViewPortStatus();
            
             if(isVRModel){
            	 DomUtil["removeClass"](this.videoFullScreen, "videoFullScreen1");
            	 DomUtil["addClass"](this.videoFullScreen, "videoFullScreen2");
             }else{
            	  DomUtil["removeClass"](this.videoFullScreen, "videoFullScreen2");
            	 DomUtil["addClass"](this.videoFullScreen, "videoFullScreen1");
             }

            
            
//            this.videoFullScreen = JTUtil['cDom']("div");
//            DomUtil["setProperties"](this.videoFullScreen, {
//                id: "videoFullScreen",
//                class: "floatR videoFullScreen1"
//            });
//            DomUtil["inject"](this.videoFullScreen, this.videoBG);
            
            
        });
        //展示方法切换
        EventUtil['addEvent'](this.videoViewPortToggle, "click", function (e) {
            EventUtil.stopPropagation(e);
            self.toggleViewPortList();
        });


    };
    //设置默认值
    var funs = {
        createDOM: function () {
            this.target = JTUtil['cDom']("div");
            DomUtil["setProperties"](this.target, {id: "videoToolbar"});
            DomUtil["inject"](this.target, this.container);
            this.videoBG = JTUtil['cDom']("div");
            DomUtil["setProperties"](this.videoBG, {id: "videoBG"});
            var type = this.player.api_getCurSceneType();
            if (type != "Video") {
                DomUtil["setStyles"](this.videoBG, {
                    width: "200px",
                    left: "50%",
                    position: "absolute",
                    marginLeft: "-120px"
                });
            }
            ;
            DomUtil["inject"](this.videoBG, this.target);

            var type = this.player.api_getCurSceneType();
            if (type == "Video") {
                this.videoTogglePlay = JTUtil['cDom']("div");
                DomUtil["setProperties"](this.videoTogglePlay, {id: "videoTogglePlay", class: "floatL videoStop"});
                DomUtil["inject"](this.videoTogglePlay, this.videoBG);

                this.videoScroll = JTUtil['cDom']("div");
                DomUtil["setProperties"](this.videoScroll, {id: "videoScroll", class: "videoScroll"});
                DomUtil["inject"](this.videoScroll, this.videoBG);
                this.videoScrollBG = JTUtil['cDom']("div");
                DomUtil["setProperties"](this.videoScrollBG, {id: "videoScrollBG"});
                DomUtil["inject"](this.videoScrollBG, this.videoScroll);
                this.videoScrollBG1 = JTUtil['cDom']("div");
                DomUtil["setProperties"](this.videoScrollBG1, {id: "videoScrollBG1"});
                DomUtil["inject"](this.videoScrollBG1, this.videoScroll);
                this.videoScrollBG2 = JTUtil['cDom']("div");
                DomUtil["setProperties"](this.videoScrollBG2, {id: "videoScrollBG2"});
                DomUtil["inject"](this.videoScrollBG2, this.videoScroll);
                //视频时间显示
                this.videoTime = JTUtil['cDom']("div");
                DomUtil["setProperties"](this.videoTime, {id: "videoTime"});
                DomUtil["inject"](this.videoTime, this.videoBG);
                this.videoTime.innerHTML = "00:00/00:00";   //更新时间显示
            }
            //全屏
            this.videoFullScreen = JTUtil['cDom']("div");
            DomUtil["setProperties"](this.videoFullScreen, {
                id: "videoFullScreen",
                class: "floatR videoFullScreen2"
            });
            DomUtil["inject"](this.videoFullScreen, this.videoBG);

            //vr模式切换
            this.videoViewPortToggle = JTUtil['cDom']("div");
            DomUtil["setProperties"](this.videoViewPortToggle, {
                id: "videoViewPortToggle",
                class: "floatR sphere_c"
            });
            DomUtil["inject"](this.videoViewPortToggle, this.videoBG);

            this.addQualityDom();

            //添加显示模式
            this.addShowTypeDom();

        },
        addShowTypeDom: function () {
            "use strict";
            /*判断是否给出多码率切换*/
            //list容器dom
            this.videoShowTypeList = JTUtil['cDom']("div");
            this.videoShowTypeList.className = "videoShowTypeList";
            this.videoShowTypeList.id = "videoShowTypeList";
            DomUtil.setStyles(this.videoShowTypeList, {
                top: -143 + "px"
            });
            DomUtil["inject"](this.videoShowTypeList, this.videoViewPortToggle);
            
            var innerDom = "<div name='sphere' class='videoListShowTypeDom videoListShowTypeDomCheck'>" +"<div name='sphere' class='sphere' style='background-position: 53.5px -4.5px;'></div>" +
            	"<div name='sphere' class='showText'>球面</div>" +"</div>" +
                "<div name='panorama' class='videoListShowTypeDom'><div name='panorama' class='panorama'></div><div name='panorama' class='showText'>平面</div></div>" +
                "<div name='littlePlanet' class='videoListShowTypeDom'><div name='littlePlanet' class='littlePlanet'></div><div name='littlePlanet' class='showText'>小行星</div></div>";
            this.videoShowTypeList.innerHTML = innerDom;
            var self = this;

            /*隐藏右键信息功能*/
            EventUtil['addEvent'](document, "click", function (e) {
                self.hiddenViewPortList();
            });

            EventUtil.addEvent(this.videoShowTypeList, "click", function (e) {
                EventUtil.stopPropagation(e);
                var targetDom = EventUtil.getTarget(e);
                var name = targetDom.getAttribute("name");
                if (name == "sphere") {
                	var innerDom = "<div name='sphere' class='videoListShowTypeDom videoListShowTypeDomCheck'>" +"<div name='sphere' class='sphere' style='background-position: 53.5px -4.5px;'></div>" +
                	"<div name='sphere' class='showText'>球面</div>" +"</div>" +
                    "<div name='panorama' class='videoListShowTypeDom'><div name='panorama' class='panorama'></div><div name='panorama' class='showText'>平面</div></div>" +
                    "<div name='littlePlanet' class='videoListShowTypeDom'><div name='littlePlanet' class='littlePlanet'></div><div name='littlePlanet' class='showText'>小行星</div></div>";
                	self.videoShowTypeList.innerHTML = innerDom;
                    self.player.api_SpherePlanet();
                } else if (name == "panorama") {
                	var innerDom = "<div name='sphere' class='videoListShowTypeDom'>" +"<div name='sphere' class='sphere'></div>" +
                	"<div name='sphere' class='showText'>球面</div>" +"</div>" +
                    "<div name='panorama' class='videoListShowTypeDom videoListShowTypeDomCheck'><div name='panorama' class='panorama'  style='background-position: 55px -120.5px;'></div><div name='panorama' class='showText'>平面</div></div>" +
                    "<div name='littlePlanet' class='videoListShowTypeDom'><div name='littlePlanet' class='littlePlanet'></div><div name='littlePlanet' class='showText'>小行星</div></div>";
                	self.videoShowTypeList.innerHTML = innerDom;
                    self.player.api_normalView();
                } else if (name == "littlePlanet") {
                	var innerDom = "<div name='sphere' class='videoListShowTypeDom'>" +"<div name='sphere' class='sphere'></div>" +
                	"<div name='sphere' class='showText'>球面</div>" +"</div>" +
                    "<div name='panorama' class='videoListShowTypeDom'><div name='panorama' class='panorama'></div><div name='panorama' class='showText'>平面</div></div>" +
                    "<div name='littlePlanet' class='videoListShowTypeDom videoListShowTypeDomCheck'><div name='littlePlanet' class='littlePlanet' style='background-position: -345px -341px;'></div><div name='littlePlanet' class='showText'>小行星</div></div>";
                	self.videoShowTypeList.innerHTML = innerDom;
                	self.player.api_littlePlanet();
                }
                self.hiddenViewPortList();

                self.setViewPortStatus(name + "_c");
            });
        },
        addQualityDom: function () {
            /*判断是否给出多码率切换*/
            if (this.videoList.length > 0) {
                //高清切换模式dom容器
                this.curVideoDom = JTUtil['cDom']("div");
                DomUtil["setProperties"](this.curVideoDom, {id: "curVideo", class: "floatR floatW"});
                DomUtil["inject"](this.curVideoDom, this.videoBG);
                //码率文字显示dom
                this.curVideoDomText = JTUtil['cDom']("div");
                this.curVideoDomText.className = "curVideoText";
                this.curVideoDomText.innerHTML = this.getVideoObjByQuality(this.videoList, this.videoQuality).Text;   //码率名称显示
                DomUtil["inject"](this.curVideoDomText, this.curVideoDom);
                //list容器dom
                this.videoDomList = JTUtil['cDom']("div");
                this.videoDomList.className = "videoDomList";
                DomUtil.setStyles(this.videoDomList, {
                    top: -(3 + 10 * 2 + 30 * this.videoList.length) + "px"
                });
                DomUtil["inject"](this.videoDomList, this.curVideoDom);
                var innerDom = "";
                for (var i = 0; i < this.videoList.length; i++) {
                    var cobj = this.videoList[i];
                    var quality = cobj.Quality;
                    var defClass = "videoListDom";//videoListDomCheck
                    if (this.videoQuality == quality)defClass += " videoListDomCheck";
                    innerDom += "<div id='" + quality + "' class='" + defClass + "'>" + cobj.Text + "</div>";
                }
                this.videoDomList.innerHTML = innerDom;
            }
            var self = this;
            //多码率切换
            if (this.curVideoDom) {
                EventUtil['addEvent'](this.curVideoDom, "click", function (e) {
                    EventUtil.stopPropagation(e);
                    self.toggleVideoList();
                });
                /*隐藏右键信息功能*/
                EventUtil['addEvent'](document, "click", function () {
                    self.hiddenVideoList();
                });
                var type = this.player.api_getCurSceneType();
                // if (type != "Video")return;
                EventUtil.addEvent(this.videoDomList, "click", function (e) {
                    EventUtil.stopPropagation(e);
                    var targetDom = EventUtil.getTarget(e);
                    var targetId = targetDom.id;
                    var checkObj = self.getVideoObjByQuality(self.videoList, targetId);


                    if (targetId == self.videoQuality)return;
                    if (!checkObj)return;
                    var path;
                    if (type == "Video") {
                        path = (checkObj["MP4"] || checkObj["M3U8"]);
                    } else if (type == "Image") {
                        path = (checkObj["Path"]);
                    }

                    if (!path)return;
                    self.videoQuality = targetId;
                    //移除选中的样式
                    var domList = document.querySelectorAll(".videoListDomCheck");
                    for (var i = 0; i < domList.length; i++) {
                        var dom = domList[i];
                        dom.className = "videoListDom";
                    }
                    //设置选中的样式
                    DomUtil.addClass(targetDom, "videoListDomCheck");
                    //设置选中的文字
                    self.curVideoDomText.innerHTML = checkObj.Text;
                    self.hiddenVideoList();

                    if(navigator.userAgent.toLowerCase().match(/miuibrowser/i) == "miuibrowser"){
                        path+="?miuivideo=panorama";
                    }

                    if (type == "Video") {
                        self.player.api_changeVideoPath(path);
                    } else if (type == "Image") {
                        self.player.api_changeScenePath(path);
                    }

                });
            }
        },
        getVideoObjByQuality: function (Addresses, Quality) {
            var path = null;
            var sceneArray = Addresses;
            var sceneArrayLen = Addresses.length;
            for (var i = 0; i < sceneArrayLen; i++) {
                var indexObj = sceneArray[i];
                if (indexObj.Quality == Quality) {
                    path = indexObj;
                    break;
                }
            }
            return path;
        },
        hiddenVideoList: function () {
            if (!this.videoDomList)return;
            this.videoDomList.style.display = "none";
            this.curVideoDomText.className = "curVideoText";
        },
        showVideoList: function () {

            this.videoDomList.style.display = "block";
            this.curVideoDomText.className = "curVideoText_sel";
            this.hiddenViewPortList();
        },
        toggleVideoList: function () {
            if (!this.videoDomList)return;
            var isblock = this.videoDomList.style.display;
            if (isblock == "block") {
                this.hiddenVideoList();
            } else {
                this.showVideoList();
            }
        },
        hiddenViewPortList: function () {
            if (!this.videoShowTypeList)return;
            this.videoShowTypeList.style.display = "none";
        },
        showViewPortList: function () {

            this.videoShowTypeList.style.display = "block";
            this.hiddenVideoList();
        },
        toggleViewPortList: function () {
            if (!this.videoShowTypeList)return;
            var isblock = this.videoShowTypeList.style.display;
            if (isblock == "block") {
                this.hiddenViewPortList();
            } else {
                this.showViewPortList();
            }
        },
        setPlayStatus: function () {
            /*获取播放暂停状态的*/
            var isPlay = this.player.api_getVideoPlayStatus();
            var defClass = !isPlay ? "videoStop" : "videoPlay";
            DomUtil["removeClass"](this.videoTogglePlay, "videoStop");
            DomUtil["removeClass"](this.videoTogglePlay, "videoPlay");
            DomUtil["addClass"](this.videoTogglePlay, defClass);
            this.deleteBeginLayer();
        },
        setViewPortStatus: function (name) {
            /*获取播放暂停状态的*/
            if (!name)return;
            DomUtil["removeClass"](this.videoViewPortToggle, "sphere_c");
            DomUtil["removeClass"](this.videoViewPortToggle, "panorama_c");
            DomUtil["removeClass"](this.videoViewPortToggle, "littlePlanet_c");
//            console.log(name);
//            DomUtil["addClass"](this.sphere, "videoListDomCheck");
            
            DomUtil["addClass"](this.videoViewPortToggle, name);
        },
        //设置默认值
        setScrollSize: function () {
            var type = this.player.api_getCurSceneType();
            if (type != "Video")return;
            var countWidth = this.container.getBoundingClientRect().width;
            var defSize = countWidth - 50 * 4 - 110;
            DomUtil["removeClass"](this.videoScroll, "videoScroll");
            DomUtil["removeClass"](this.videoScroll, "videoScrollTop");
            this.videoTime.style.marginLeft = "0px";
            this.videoScroll.style.width = "100%";
            DomUtil["addClass"](this.videoScroll, "videoScrollTop");
        },
        setDefault: function () {
            var type = this.player.api_getCurSceneType();
            if (type == "Video") {
                //设置默认的播放状态
                this.setPlayStatus();
                //设置进度条的尺寸
                this.setScrollSize();
            }
            //获取当前多视口状态
            this.setViewPortStatus();
        },
        getUpdateBuffered: function () {
            var type = this.player.api_getCurSceneType();
            if (type != "Video")return;
            var videoDom = this.player.api_getVideoDom();
            if (!videoDom)return;
            var buf = videoDom.buffered;
            var leg = buf.length - 1;
            if (leg < 0)return;
            var duration = videoDom.duration.toFixed(1);
            //这里不考虑分段加载进度  只取最大进度
            var x1, x2;
            // while (leg--) {
            x1 = buf.start(leg).toFixed(1);
            x2 = buf.end(leg).toFixed(1);
            var p = ((x2 / duration) * 100);
            this.videoScrollBG1.style.width = p + "%";
        },
        /*更新进度*/
        updateProperties: function () {
            var type = this.player.api_getCurSceneType();
            if (type != "Video")return;
            var videoDom = this.player.api_getVideoDom();
            if (!videoDom)return;
            var duration = videoDom.duration || 0;
            var cur = videoDom.currentTime || 0;
            var curTime = JTUtil["formatToMin"](cur);//取得当前播放进度
            //直播时间显示
            if (isFinite(duration)) {
                var countTime = JTUtil["formatToMin"](duration);//取得总时长
                this.videoTime.innerHTML = curTime + "/" + countTime;   //更新时间显示
                var progress = ((cur / duration) * 100);
                this.videoScrollBG2.style.width = progress + "%";
            } else {
                this.videoTime.innerHTML = curTime;   //更新时间显示
            }
        },
        /*将拖动的百分比转换成视频的当前时间*/
        updateCurTime: function (p) {
            var videoDom = this.player.api_getVideoDom();
            if (!videoDom)return;
            //视频总时长
            var duration = videoDom.duration;
            var curTime = duration * p;
            this.player.api_setVideoCurTime(curTime);
        },
        /*将拖动的百分比转换成视频的当前时间*/
        resize: function (p) {
            //设置进度条的尺寸
            this.setScrollSize();
        },
        /*创建首次播放提示*/
        createBeginLayer: function () {
            if (this.player.api_getVideoAutoPlayStatus()) return;
            this.beginLayer = document.createElement("div");
            this.beginLayer.id = "beginLayer";
            var beginLayerImg = document.createElement("div");
            beginLayerImg.id = "beginLayerImg";
            this.beginLayer.appendChild(beginLayerImg);
            this.container.appendChild(this.beginLayer);
            var self = this;
            EventUtil['addEvent'](beginLayerImg, "click", function (e) {
                EventUtil.stopPropagation(e);
                self.togglePlay();
            });
        },
        /*删除提示*/
        deleteBeginLayer: function () {
            this.player.api_getVideoPlayStatus() && this.beginLayer && DomUtil.destroy(this.beginLayer);
        },
        resetQuality: function (address) {
            this.curVideoDom && DomUtil.destroy(this.curVideoDom);
            this.videoList = (address) ? address : [];
            this.addQualityDom();
        }
    };

    for (var key in funs) {
        window.TWToolbarClass.prototype[key] = funs[key];
    }
})();