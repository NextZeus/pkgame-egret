class Music extends egret.DisplayObjectContainer{
    private _sound:egret.Sound;
    private _channel:egret.SoundChannel;

    constructor(){
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event){

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

        this._channel.stop();
        this._channel = null;
    }

    private onTimeUpdate():void{

    }

    private onComplete():void{
        this.stop();
    }

    private stop():void{

    }

    private setProgress(position:number):void{

    }

    private init():void{

    }

}