var SeaObject = cc.Sprite.extend({

    //0:fish
    //1:bubbles
    //2:coins
    id:null,

    ctor:function(res){

        this._super(res);
    }
});

var FishActor = SeaObject.extend({

    speedX:null,
    speedY:null,

    ctor:function(){

        this._super();
        this.id=0;

        this.speedX = Math.random()*2+1;
        this.speedY = Math.random()*2+1;

        var fishFrames = [];
        fishFrames.push(cc.SpriteFrame.create(res.fish_one_png, cc.rect(0,0,50,52)));
        fishFrames.push(cc.SpriteFrame.create(res.fish_two_png,cc.rect(0,0,50,43)));

        var animation = cc.Animation.create(fishFrames,0.3);
        var animate = cc.Animate.create(animation);
        this.runAction(cc.RepeatForever.create(animate));
        this.activateFishMovement();
    },

    activateFishMovement:function(){

        this.schedule(this.updateFishMovement, 0.1+Math.random());
    },

    updateFishMovement:function(dt){

        var direction = Math.random()*2-1;
        var shiftX = (Math.random()*2+1)*direction;
        var shiftY = (Math.random()*2+1)*direction;

        this.speedX = shiftX==0?1:shiftX;
        this.speedY = shiftY==0?1:shiftY;

        var rotation = -Math.atan2(shiftX,shiftY);
        this.rotation = (rotation*180/3.14);
    }
});

var Bubble = SeaObject.extend({

   ctor:function(){

       this._super(res.bubble_png);
       this.scale = 0.1;
       this.id=1;
   }
});