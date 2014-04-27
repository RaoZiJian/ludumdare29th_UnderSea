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

        var randomPng = Math.random();
        if(randomPng>0.5){
            this._super(res.fish_one_png);
        }else{
            this._super(res.fish_two_png);
        }
        this.id=0;
        this.scale=0.5;

        this.speedX = Math.random()*2+1;
        this.speedY = Math.random()*2+1;

         this.activateFishMovement();
    },

    activateFishMovement:function(){

        this.schedule(this.updateFishMovement, 1+Math.random()*4);
    },

    updateFishMovement:function(dt){

        var shiftX = (Math.random()+0.5)*(Math.random()*2-1);
        var shiftY = (Math.random()+0.5)*(Math.random()*2-1);

        this.speedX = shiftX==0?1:shiftX;
        this.speedY = shiftY==0?-1:shiftY;

        var rotation;

        if(shiftX>0&&shiftY>0){
            this.flippedX = false;
            rotation = -Math.atan2(shiftX,shiftY);
            this.rotation = (rotation*180/3.14);
        }else if(shiftX<0&&shiftY>0){
            this.flippedX = true;
            rotation = -Math.atan2(shiftX,shiftY);
            this.rotation = (rotation*180/3.14);
        }else if(shiftX>0&&shiftY<0){
            this.flippedX=false;
            rotation = -Math.atan2(shiftX,shiftY);
            this.rotation = (rotation*180/3.14+180);
        }else if(shiftX<0&&shiftY<0){
            this.flippedX=true;
            rotation = -Math.atan2(shiftX,shiftY);
            this.rotation = (rotation*180/3.14+180);
        }
    }
});

var Bubble = SeaObject.extend({

   ctor:function(){

       this._super(res.bubble_png);
       this.scale = 0.1;
       this.id=1;
   }
});
