/**
 * Created by kirito on 4/26/14.
 */

var DeepSeaLayer = cc.Layer.extend({

    winSize:null,
    diver:null,
    fishAry:null,
    keyCodeFlag:null,

    ctor:function(){

        this._super();
        this.winSize = cc.winSize;
        this.fishAry=[];
        this.backgroundInit();
        this.keyCodeFlag=0;

        this.diver = cc.Sprite.create(res.diver_png);
        this.diver.x = this.winSize.width/2;
        this.diver.y = this.winSize.height/2;
        this.addChild(this.diver ,2);

        this.fishActorsInitial();
        this.updateFishMovementOnce();
        this.scheduleUpdate();
        this.schedule(function(){this.bubbleInit(-100,100)}, 1+Math.random()/10+5);
        this.schedule(function(){this.bubbleInit(1030,300)}, 1+Math.random()/10+5);
//        this.schedule(function(){this.bubbleInit(400,-100)}, 1+Math.random()/10+5);
//        this.schedule(function(){this.bubbleInit(600,800)}, 1+Math.random()/10+5);

        cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed:function(key, event){

                var target = event.getCurrentTarget().diver;
                if(key == 87){//w
                    event.getCurrentTarget().keyCodeFlag=87;
                }else if(key == 65){//a

                    event.getCurrentTarget().keyCodeFlag=65;
                }else if(key == 83){//s

                    event.getCurrentTarget().keyCodeFlag=83;
                }else if(key == 68){//d

                    event.getCurrentTarget().keyCodeFlag=68;
                }else{

                    event.getCurrentTarget().keyCodeFlag=0;
                }
            },
            onKeyReleased:function(key, event){
                event.getCurrentTarget().keyCodeFlag=0;
            }
        }, this);

    },

    update:function(dt){

        this.controlDiver();
        this.updateFishMovementPerFrame();
     },

    fishActorsInitial:function(){

        for (var i=0;i<20;i++){

            var fish = new FishActor();
            fish.x=Math.random()*1020+1;
            fish.y=Math.random()*760+1;
            this.addChild(fish,1);
            this.fishAry.push(fish);
        }
    },

    backgroundInit:function(){

        var backgroundSea = cc.Sprite.create(res.background_png);
        backgroundSea.anchorX = 0;
        backgroundSea.anchorY = 0;
        backgroundSea.x = 0;
        backgroundSea.y = 0;
        this.addChild(backgroundSea,0);

        var liquidEffect = cc.Liquid.create(15, cc.size(50,50), 5, 15);
        backgroundSea.runAction(cc.RepeatForever.create(liquidEffect));
    },

    updateFishMovementPerFrame:function(){

        for(var i= 0;i<this.fishAry.length;i++){

            var fish = this.fishAry[i];
            if(fish.x>1030){
                fish.x=-40;
                fish.y=Math.random()*this.winSize.height+20;
            }else if(fish.x<-100){
                fish.x=1030;
                fish.y=Math.random()*this.winSize.height+20;
            }else if(fish.y<-100){
                fish.x=Math.random()*this.winSize.width+20;
                fish.y=800;
            }else if(fish.y>800){
                fish.x=Math.random()*this.winSize.width+1;
                fish.y=-40;
            }else{

                fish.x+=fish.speedX;
                fish.y+=fish.speedY;
            }
        }
    },

    updateFishMovementOnce:function(){

        for(var i=0;i<this.fishAry.length;i++){

            var fish = this.fishAry[0];
            var direction = Math.random()*2-1;
            var shiftX = (Math.random()*2+1)*direction;
            var shiftY = (Math.random()*2+1)*direction;

            fish.speedX = shiftX==0?1:shiftX;
            fish.speedY = shiftY==0?1:shiftY;

            var rotation = -Math.atan2(shiftX,shiftY);
            fish.rotation = (rotation*180/3.14);
        }
    },

    controlDiver:function(){

        switch(this.keyCodeFlag){
            case 87:{
                if(this.diver.y<=750)
                    this.diver.y+=2;
                break;
            }
            case 65:{
                if(this.diver.x>=10)
                    this.diver.x-=2;
                break;
            }
            case 83:{
                if(this.diver.y>=10)
                    this.diver.y-=2;
                break;
            }
            case 68:{
                if(this.diver.x<=1000)
                    this.diver.x+=2;
                break;
            }
            default: {
                break;
            }
        }
    },

    bubbleInit:function(positionX, positionY){

        var bubble = new Bubble();
        bubble.x = positionX;
        bubble.y = positionY;
        this.addChild(bubble,2);

        switch (positionX){

            case -100:{

                bubble.runAction(cc.Sequence.create(cc.MoveBy.create(20,cc.p(1200,400)), cc.CallFunc.create(this.bubbleRelease,bubble)));
                break;
            }
            case 1030:{

                bubble.runAction(cc.Sequence.create(cc.MoveBy.create(20,cc.p(-1200,400)), cc.CallFunc.create(this.bubbleRelease,bubble)));
                break;
            }
            case 400:{

                bubble.runAction(cc.Sequence.create(cc.MoveBy.create(20,cc.p(400,900)), cc.CallFunc.create(this.bubbleRelease,bubble)));
                break;
            }
            case 600:{

                bubble.runAction(cc.Sequence.create(cc.MoveBy.create(20,cc.p(400,-900)), cc.CallFunc.create(this.bubbleRelease,bubble)));
                break;
            }
            default:{

            }
        }
    },

    bubbleRelease:function(bubble){

        bubble.removeFromParent();
    }
});

var DeepSeaScene = cc.Scene.extend({

    onEnter:function(){

        this._super();

        var deepSeaLayer = new DeepSeaLayer();
        this.addChild(deepSeaLayer,0);
    }
});

