# Egret Learning Note

### 横轴 x 从左往右 越来越大
### 纵轴 y 从上到下 越来越大

#### 锚点 绝对位置

var shape:egret.Shape = new egret.Shape();
shape.x = 100;
shape.y = 20;

#### 缩放
shape.scaleX = 0.5;
shape.scaleY = 0.5;

#### 透明度
shape.alpha = 0.4;

#### 旋转 顺时针
shape.rotation = 30;


## 创建显示对象类
需要继承自**DisplayObject**的具体子类 例如**Shape**或者**TextField**

```
class MyGrid extends egret.Shape{
	public constructor(){
		super();
		this.drawGrid();
	}
	
	private drawGrid(){
		this.graphics.beginFill( 0x0000ff );
        this.graphics.drawRect( 0, 0, 50,50 );
        this.graphics.endFill();
        this.graphics.beginFill( 0x0000ff );
        this.graphics.drawRect( 50, 50, 50, 50);
        this.graphics.endFill();
        this.graphics.beginFill( 0xff0000 );
        this.graphics.drawRect( 50, 0, 50,50 );
        this.graphics.endFill();
        this.graphics.beginFill( 0xff0000 );
        this.graphics.drawRect( 0, 50, 50,50 );
        this.graphics.endFill();   
	}
}


//Main.ts

class Main extends egret.DisplayObjectContainer{
	public constructor(){
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage, this);
		
		private onAddToStage(event:egret.Event){
			var _myGrid = new myGrid();
			this.addChild( _myGrid );
		}
	}
}


```
效果如下图
![](http://cdn.dev.egret.com/egret-docs/Engine2D/displayObject/classes/556534d84ca7f.png)


### 锚点
> 默认锚点在左上角
> anchorOffsetX = 50; 锚点改为(50,0)
> anchorOffsetY = 50; 锚点改为(0,50)

实际效果看着是位置变动，但是x,y的值不变

### 位置
> x , y 默认创建显示对象时，x,y 均设置为0 ，从而可将对象放在其父内容的左上角
> x , y 属性始终是指显示对象相对于其父显示对象坐标轴的(0,0)坐标的位置
> 