var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            //remove loading view
            this.stage.removeChild(this.loadingView);
            //remove resource load listeners
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            //create game scene
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        var sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);
        var icon = this.createBitmapByName("egret_icon_png");
        this.addChild(icon);
        icon.x = 26;
        icon.y = 33;
        var line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 172;
        line.y = 61;
        this.addChild(line);
        var colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello World!";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        this.addChild(colorLabel);
        var textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. 
        // As for the property of name please refer to the configuration file of resources/resource.json.
        //key completedCallback 
        RES.getResAsync("description_json", this.startAnimation, this);
        var offsetX;
        var offsetY;
        // 手指在任意显示对象上按下，该显示对象就会移到舞台显示列表的顶部 所以拖动的对象始终出现在顶部
        var draggedObject = new egret.Shape();
        var circle = new egret.Shape();
        circle.graphics.beginFill(0xffffff, 0.5);
        circle.graphics.drawCircle(100, 100, 50);
        circle.graphics.endFill();
        this.addChild(circle);
        circle.x = 136;
        circle.y = 368;
        circle.touchEnabled = true;
        // 手指按到屏幕 出发startMove方法
        circle.addEventListener(egret.TouchEvent.TOUCH_BEGIN, startMove, this);
        // 手指离开屏幕 出发stopMove方法
        circle.addEventListener(egret.TouchEvent.TOUCH_END, stopMove, this);
        var square = new egret.Shape();
        square.graphics.beginFill(0xffffff);
        square.graphics.drawRect(0, 0, 100, 100);
        square.graphics.endFill();
        this.addChild(square);
        square.touchEnabled = true;
        // 手指按到屏幕 出发startMove方法
        square.addEventListener(egret.TouchEvent.TOUCH_BEGIN, startMove, this);
        // 手指离开屏幕 出发stopMove方法
        square.addEventListener(egret.TouchEvent.TOUCH_END, stopMove, this);
        function startMove(event) {
            draggedObject = event.currentTarget;
            offsetX = event.stageX - draggedObject.x;
            offsetY = event.stageY - draggedObject.y;
            this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, onMove, this);
        }
        function stopMove(event) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, onMove, this);
        }
        function onMove(event) {
            var stageW = this.stage.stageWidth;
            var stageH = this.stage.stageHeight;
            var x = event.stageX - offsetX;
            if (x >= 50 && x <= stageW - 100) {
                draggedObject.x = x;
            }
            var y = event.stageY - offsetY;
            if (y >= 50 && y <= stageH - 100) {
                draggedObject.y = y;
            }
            console.log('stageW:' + stageW + ' stageH:' + stageH + ' x:' + draggedObject.x + ' y:' + draggedObject.y + ' offsetX:' + offsetX + ' offsetY:' + offsetY);
        }
        // 可移动显示对象
        var bigText = new egret.TextField();
        bigText.text = "平移和滚动显示对象，平移和滚动显示对象";
        bigText.scrollRect = new egret.Rectangle(0, 0, 200, 50);
        bigText.cacheAsBitmap = true;
        this.addChild(bigText);
        // 创建一个按钮 点击后控制文本内容向左移动
        var btnLeft = new egret.Shape();
        btnLeft.graphics.beginFill(0xcccc01);
        btnLeft.graphics.drawRect(0, 0, 50, 50);
        btnLeft.graphics.endFill();
        btnLeft.x = 50;
        btnLeft.y = 100;
        this.addChild(btnLeft);
        btnLeft.touchEnabled = true;
        btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, onScroll, this);
        var btnRight = new egret.Shape();
        btnRight.graphics.beginFill(0x01cccc);
        btnRight.graphics.drawRect(0, 0, 50, 50);
        btnRight.graphics.endFill();
        btnRight.x = 150;
        btnRight.y = 100;
        this.addChild(btnRight);
        btnRight.touchEnabled = true;
        btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, onScroll, this);
        function onScroll(e) {
            var rect = bigText.scrollRect;
            switch (e.currentTarget) {
                case btnLeft:
                    rect.x += 20;
                    break;
                case btnRight:
                    rect.x -= 20;
                    break;
            }
            bigText.scrollRect = rect;
        }
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    Main.prototype.startAnimation = function (result) {
        var self = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = [];
        for (var i = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }
        var textfield = self.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];
            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200); //不透明
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200); //透明
            tw.call(change, self);
        };
        change();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    Main.prototype.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
