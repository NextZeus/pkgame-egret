class Music extends egret.DisplayObjectContainer{
    // http://developer.egret.com/cn/example/egret2d/index.html#120-media-audio

    private _sound:egret.Sound;
    private _channel:egret.SoundChannel;
    private _pauseTime:number;
    private _bar:egret.Shape;
    private _progress:egret.Shape;
    private _updateTxt:egret.TextField;
    private _playTxt:egret.TextField;
    private _pauseTxt:egret.TextField;
    private _stopTxt:egret.TextField;
    private _pauseTime:number = 30;

    constructor(){
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event){
        this.loadSound();
    }

    private loadSound():void{
        var sound:egret.Sound = this._sound = new egret.Sound();

        sound.addEventListener(egret.Event.COMPLETE,function (e:egret.Event) {
            this.init();
        },this);
        sound.load('resource/assets/ccnn.mp3');

    }

    private play():void{
        this._channel = this._sound.play(this._pauseTime,1);
        this._channel.addEventListener(egret.Event.SOUND_COMPLETE,this.onComplete,this);
        this._channel.addEventListener(egret.Event.ENTER_FRAME,this.onTimeUpdate,this);
    }

    private onTimeUpdate():void{

    }

    private onComplete():void{
        this.stop();
    }

    private stop():void{
        if(this._channel){
            this._channel.removeEventListener(egret.Event.SOUND_COMPLETE,this.onComplete,this);
            this.removeEventListener(egret.Event.ENTER_FRAME,this.onTimeUpdate,this);

            this._channel.stop();
        }
    }

    private setProgress(position:number):void{
        this._updateTxt.text = position.toFixed(1)+'/'+this._sound.length.toFixed(1);

        var w:number = (position / this._sound.length) * 400;
        this._bar.x = w + this.stage.stageWidth / 2 - 200;
        var mask:egret.Rectangle = <egret.Rectangle>this._progress.mask || new egret.Rectangle(0,0,0,60);
        mask.x = w;
        mask.width = 400 - w;
        this._progress.mask = mask;

    }

    private init():void{

        var rap:number = 180;
        var rapH:number = 200;

        var playTxt:egret.TextField = this._playTxt = new egret.TextField();
        playTxt.text = "Play";
        playTxt.size = 60;
        playTxt.x = 80;
        playTxt.y = 200 + rapH;
        playTxt.addEventListener(egret.TouchEvent.TOUCH_TAP,function () {
            this.play();
            this.setAllAbled(true);
        },this);

        this.addChild(playTxt);

        //stop
        var stopTxt:egret.TextField = this._stopTxt = new egret.TextField();
        stopTxt.text = "Stop";
        stopTxt.size = 60;
        stopTxt.x = playTxt.x + rap ;
        stopTxt.y = 200 + rapH;
        stopTxt.touchEnabled = true;
        stopTxt.addEventListener(egret.TouchEvent.TOUCH_TAP,function () {
            if(this._channel){
                this._pauseTime = 0;
                this.stop();

                this.onTimeUpdate();
            }
            this.setAllAbled(false);

        },this);
        this.addChild(stopTxt);

        //pause
        var pauseTxt: egret.TextField = this._pauseTxt = new egret.TextField();
        pauseTxt.text = "暂停";
        pauseTxt.size = 60;
        pauseTxt.x = playTxt.x + rap * 2;
        pauseTxt.y = 200 + rapH;
        pauseTxt.touchEnabled = true;
        pauseTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (this._channel) {
                this._pauseTime = this._channel.position;

                this.stop();
            }

            this.setAllAbled(false);
        }, this);
        this.addChild(pauseTxt);

        this.setAllAbled(false);

        var bg:egret.Shape = new egret.Shape();
        this.addChild(bg);

        bg.x = this.stage.stageWidth / 2 - 200;
        bg.y = 100 - 5 * rapH;
        bg.graphics.beginFill(0x999999);
        bg.graphics.drawRoundRect(0,0,400,100,5,5);
        bg.graphics.endFill();

        this._progress = new egret.Shape();
        this.addChild(this._progress);
        this._progress.x = this.stage.stageWidth / 2 - 200;
        this._progress.y = 100 - 5 + rapH;
        this._progress.graphics.beginFill(0xffff00);
        this._progress.graphics.drawRoundRect(0, 0, 400, 10, 5, 5);
        this._progress.graphics.endFill();

        this._bar = new egret.Shape();
        this.addChild(this._bar);
        this._bar.x = this.stage.stageWidth / 2 - 200;
        this._bar.y = 100 + rapH;
        this._bar.graphics.beginFill(0xffff00);
        this._bar.graphics.drawCircle(0, 0, 20);
        this._bar.graphics.endFill();

        this._updateTxt = new egret.TextField();
        this._updateTxt.text = 0 + "/" +  this._sound.length.toFixed(1);
        this._updateTxt.width = 200;
        this._updateTxt.size = 30;
        this._updateTxt.x = this.stage.stageWidth / 2 - 100;
        this._updateTxt.y = 50 + rapH;
        this._updateTxt.textAlign = egret.HorizontalAlign.CENTER;
        this.addChild(this._updateTxt);

    }

    private setAllAbled(isPlaying:boolean):void{
        this.setTextAbled(this._playTxt, !isPlaying);
        this.setTextAbled(this._stopTxt, isPlaying);
        this.setTextAbled(this._pauseTxt, isPlaying);
    }

    private setTextAbled(text:egret.TextField,touchEnabled:boolean):void{
        text.touchEnabled = touchEnabled;
        if (touchEnabled) {
            text.textColor = 0xffffff;
        }
        else {
            text.textColor = 0x999999;
        }
    }
}