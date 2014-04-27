/**
 * Created by kirito on 4/26/14.
 */

var DeepSeaLayer = cc.Layer.extend({

    winSize:null,
    diver:null,
    fishAry:null,
    keyCodeFlag:null,
    ship:null,
    point:0,
    deleteCoinAry:null,
    coinAry:null,
    garavity:1,

    ctor:function(){

        this._super();
        this.winSize = cc.winSize;
        this.fishAry=[];
        this.coinAry=[];
        this.deleteCoinAry=[];
        this.keyCodeFlag=0;

        this.diverInit();
        this.fishActorsInitial();
        this.shipInit();
        this.updateFishMovementOnce();
        this.scheduleUpdate();
        this.coinInit();
        this.schedule(function(){this.bubbleInit(-100,100)}, Math.random()*10+10);
        this.schedule(function(){this.bubbleInit(1030,300)}, Math.random()*10+10);
        this.schedule(this.coinInit, 15);

        cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed:function(key, event){

                var target = event.getCurrentTarget().diver;
                if(key == 87){//w

                    event.getCurrentTarget().keyCodeFlag=87;
                }else if(key == 65){//a

                    event.getCurrentTarget().diver.flippedX = false;
                    event.getCurrentTarget().keyCodeFlag=65;
                }else if(key == 83){//s

                    event.getCurrentTarget().keyCodeFlag=83;
                }else if(key == 68){//d

                    event.getCurrentTarget().diver.flippedX = true;
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

        this.shipUpdateMovement();
        this.controlDiver();
        this.updateFishMovementPerFrame();
     },

    fishActorsInitial:function(){

        for (var i=0;i<20;i++){

            var fish = new FishActor();
            fish.x=Math.random()*1020+1;
            fish.y=Math.random()*100+1;
            this.addChild(fish,1);
            this.fishAry.push(fish);
        }
    },

    updateFishMovementPerFrame:function(){

        for(var i= 0;i<this.fishAry.length;i++){

            var fish = this.fishAry[i];
            if(fish.x>1030){
                fish.x=-40;
                fish.y=Math.random()*450;
            }else if(fish.x<-100){
                fish.x=1030;
                fish.y=Math.random()*450;
            }else if(fish.y<-100){

                var shiftX = (Math.random()*2+1)*(Math.random()*2-1);
                var shiftY = (Math.random()*2+1);
                fish.speedX = shiftX==0?1:shiftX;
                fish.speedY = shiftY;
                var rotation = -Math.atan2(shiftX,shiftY);

                if(shiftX>0&&shiftY>0){
                    fish.flippedX = false;
                    rotation = -Math.atan2(shiftX,shiftY);
                    fish.rotation = (rotation*180/3.14);
                }else if(shiftX<0&&shiftY>0){
                    fish.flippedX = true;
                    rotation = -Math.atan2(shiftX,shiftY);
                    fish.rotation = (rotation*180/3.14);
                }else if(shiftX>0&&shiftY<0){
                    fish.flippedX=false;
                    rotation = -Math.atan2(shiftX,shiftY);
                    fish.rotation = (rotation*180/3.14+180);
                }else if(shiftX<0&&shiftY<0){
                    this.flippedX=true;
                    rotation = -Math.atan2(shiftX,shiftY);
                    fish.rotation = (rotation*180/3.14+180);
                }

                fish.x+=fish.speedX;
                fish.y+=fish.speedY;
            }else if(fish.y>420){

                var shiftX = (Math.random()*2+1)*(Math.random()*2-1);
                var shiftY = -(Math.random()*2+1);
                fish.speedX = shiftX==0?1:shiftX;
                fish.speedY = shiftY;
                var rotation = -Math.atan2(shiftX,shiftY);

                if(shiftX>0&&shiftY>0){
                    fish.flippedX = false;
                    rotation = -Math.atan2(shiftX,shiftY);
                    fish.rotation = (rotation*180/3.14);
                }else if(shiftX<0&&shiftY>0){
                    fish.flippedX = true;
                    rotation = -Math.atan2(shiftX,shiftY);
                    fish.rotation = (rotation*180/3.14);
                }else if(shiftX>0&&shiftY<0){
                    fish.flippedX=false;
                    rotation = -Math.atan2(shiftX,shiftY);
                    fish.rotation = (rotation*180/3.14+180);
                }else if(shiftX<0&&shiftY<0){
                    this.flippedX=true;
                    rotation = -Math.atan2(shiftX,shiftY);
                    fish.rotation = (rotation*180/3.14+180);
                }

                fish.x+=fish.speedX;
                fish.y+=fish.speedY;
            }else{

                fish.x+=fish.speedX;
                fish.y+=fish.speedY;
            }
        }

        this.collideCheck();
    },

    updateFishMovementOnce:function(){

        for(var i=0;i<this.fishAry.length;i++){

            var fish = this.fishAry[0];
            var shiftX = (Math.random()+0.5)*(Math.random()*2-1);
            var shiftY = (Math.random()+0.5)*(Math.random()*2-1);

            fish.speedX = shiftX==0?1:shiftX;
            fish.speedY = shiftY==0?-1:shiftY;
            var rotation;

            if(shiftX>0&&shiftY>0){
                fish.flippedX = false;
                rotation = -Math.atan2(shiftX,shiftY);
                fish.rotation = (rotation*180/3.14);
            }else if(shiftX<0&&shiftY>0){
                fish.flippedX = true;
                rotation = -Math.atan2(shiftX,shiftY);
                fish.rotation = (rotation*180/3.14);
            }else if(shiftX>0&&shiftY<0){
                fish.flippedX=false;
                rotation = -Math.atan2(shiftX,shiftY);
                fish.rotation = (rotation*180/3.14+180);
            }else if(shiftX<0&&shiftY<0){
                this.flippedX=true;
                rotation = -Math.atan2(shiftX,shiftY);
                fish.rotation = (rotation*180/3.14+180);
            }
        }
    },

    controlDiver:function(){

        switch(this.keyCodeFlag){
            case 87:{
                if(this.diver.y<=500)
                    this.diver.y+=5*this.garavity;
                break;
            }
            case 65:{
                if(this.diver.x>=10)
                    this.diver.x-=5*this.garavity;
                break;
            }
            case 83:{
                if(this.diver.y>=50)
                    this.diver.y-=5*this.garavity;
                break;
            }
            case 68:{
                if(this.diver.x<=1000)
                    this.diver.x+=5*this.garavity;
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
    },

    diverInit:function(){

        this.diver = cc.Sprite.create(res.diver_png);
        this.diver.x = this.winSize.width/2;
        this.diver.y = this.winSize.height/2;

        var diverFrame1 = cc.SpriteFrame.create(res.diver_png,cc.rect(0,0,100,47));
        var diverFrame2 = cc.SpriteFrame.create(res.diver_png2,cc.rect(0,0,100,66));
        var diverFrame3 = cc.SpriteFrame.create(res.diver_png3,cc.rect(0,0,100,54));

        var diverFrames = [];
        diverFrames.push(diverFrame1);
        diverFrames.push(diverFrame2);
        diverFrames.push(diverFrame3);

        var diverAnimation = cc.Animation.create(diverFrames,0.1);
        var diverAnimate = cc.Animate.create(diverAnimation);

        this.diver.runAction(cc.RepeatForever.create(diverAnimate));
        this.addChild(this.diver ,2);
    },

    shipInit:function(){

        this.ship = cc.Sprite.create(res.ship_png);
        this.ship.scale=1.5;
        this.ship.flippedX=true;
        this.ship.x = 200;
        this.ship.y = 512;
        var shipShake = cc.RepeatForever.create(cc.Sequence.create(cc.MoveBy.create(5,cc.p(0,5)), cc.MoveBy.create(5,cc.p(0,-5))));
        this.ship.runAction(shipShake);
        this.addChild(this.ship);
    },

    shipUpdateMovement:function(){

        if(this.ship!=null&&this.ship.flippedX==true){
            this.ship.x++;
        }else if(this.ship!=null&&this.ship.flippedX==false){
            this.ship.x--;
        }

        if(this.ship!=null&&this.ship.x>650){
            this.ship.flippedX=false;
        }else if(this.ship!=null&&this.ship.x<120){
            this.ship.flippedX=true;
        }
    },

    coinInit:function(){

       var coinBatch = cc.SpriteBatchNode.create(res.coin_png,10);

       for(var i=0;i<10;i++){

           var coin = cc.Sprite.create(res.coin_png);
           coinBatch.addChild(coin);
           coin.scale = Math.random()*0.5+0.2;
           coin.x=Math.random()*900+50;
           coin.y=Math.random()*(-50)-50
           this.coinAry.push(coin);

           coin.runAction(cc.Sequence.create(cc.MoveBy.create(20,cc.p(Math.random()*200-100,Math.random()*500+50)),cc.DelayTime.create(Math.random()*3+1), cc.CallFunc.create(this.coinRelease,coin)));
       }
        this.addChild(coinBatch,1);
    },

    coinRelease:function(coin){
        var thisCoinAry = coin.getParent().getParent().coinAry;
        thisCoinAry.splice(thisCoinAry[thisCoinAry.indexOf(coin)],1);
        coin.removeFromParent();
    },

    collideCheck:function(){

        for(var i=0;i<this.fishAry.length;i++){

            if(cc.rectIntersectsRect(cc.rect(this.diver.x,this.diver.y,50,20),cc.rect(this.fishAry[i].x,this.fishAry[i].y,20,20))){

                this.onExit();
            }
        }

        for(var i=0;i<this.coinAry.length;i++){

            if(cc.rectIntersectsRect(cc.rect(this.diver.x,this.diver.y,100,50),cc.rect(this.coinAry[i].x,this.coinAry[i].y,20,20))){

               this.deleteCoinAry.push(this.coinAry[i]);
            }
        }

        for(var i=0;i<this.deleteCoinAry.length;i++){

            this.coinAry.splice(this.coinAry.indexOf(this.deleteCoinAry[i]),1);
            this.deleteCoinAry[i].removeFromParent();
        }

        this.deleteCoinAry = [];
    }
});

var DeepSeaScene = cc.Scene.extend({

    onEnter:function(){

        this._super();

        var deepSeaLayer = new DeepSeaLayer();
        this.backgroundInit();
        this.addChild(deepSeaLayer,1);
    },

    backgroundInit:function(){

        var backgroundSea = cc.LayerColor.create(cc.color(87,121,222,255), 1024 ,500);
        backgroundSea.anchorX = 0;
        backgroundSea.anchorY = 0;
        backgroundSea.x = 0;
        backgroundSea.y = 0;
        backgroundSea.opacity=180;
        this.addChild(backgroundSea,2);

        var backgroundWhite = cc.LayerGradient.create(cc.color(182,216,192,255),cc.color(236,219,188,255));
        backgroundWhite.width=1024;
        backgroundWhite.height=768;
        backgroundWhite.anchorX = 0;
        backgroundWhite.anchorY = 0;
        backgroundWhite.x = 0;
        backgroundWhite.y = 0;
        this.addChild(backgroundWhite,0);

        var liquidEffect = cc.Liquid.create(15, cc.size(20,20), 5, 5);
        backgroundSea.runAction(cc.RepeatForever.create(liquidEffect));
    }
});

