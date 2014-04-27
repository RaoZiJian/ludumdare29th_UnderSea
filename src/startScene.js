/**
 * Created by kirito on 4/28/14.
 */
var startScene = cc.Scene.extend({

   onEnter:function(){

       this._super();
       var bk1 = cc.Sprite.create(res.startMenu_png);
       bk1.x=0;
       bk1.y=0;
       bk1.anchorX=0;
       bk1.anchorY=0;
       this.addChild(bk1,1);

       var menuItem = cc.MenuItemImage.create(res.pressToStart_png,res.pressToStartPush_png,this.startScene);
       var menu = cc.Menu.create(menuItem);
       menu.x=200;
       menu.y=700;
       this.addChild(menu,2);
   },

    startScene:function(){

        var newScene = new DeepSeaScene();
        var transition = cc.TransitionFadeBL.create(0.5, newScene);

        cc.director.runScene(transition);
    }
});