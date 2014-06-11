/*global Quintus:false */

Quintus.Mouse = function(Q) {
  if(Q._isUndefined(Quintus.Sprites)) {
    throw "Quintus.Mouse requires Quintus.Sprites Module";
  }

  //TODO: Mouse detection
  var hasMouse =  !!('onmousemove' in window);

  var mouseStage = [0];
  var mouseType = 0;

  Q.Evented.extend("MouseSystem",{

    init: function() {
      var mouseSystem = this;

      this.boundMove = function(e) { touchSystem.move(e); };

      Q.el.addEventListener('mousemove',this.boundMove);

      this.mousePos = new Q.Evented();
      this.mousePos.grid = {};
      this.mousePos.p = { w:1, h:1, cx: 0, cy: 0 };
      this.enteredObject = null;
    },

    destroy: function() {
      Q.el.removeEventListener('mousemove',this.boundMove);
    },

    normalizeMouse: function(touch,stage) {
      var canvasPosX = touch.offsetX,
          canvasPosY = touch.offsetY;         

      if(Q._isUndefined(canvasPosX) || Q._isUndefined(canvasPosY)) {
        canvasPosX = touch.layerX;
        canvasPosY = touch.layerY;
      }

      if(Q._isUndefined(canvasPosX) || Q._isUndefined(canvasPosY)) {
        if(Q.touch.offsetX === void 0) {
          Q.touch.offsetX = 0;
          Q.touch.offsetY = 0;
          var el = Q.el;
          do {
            Q.touch.offsetX += el.offsetLeft;
            Q.touch.offsetY += el.offsetTop;
          } while(el = el.offsetParent);
        }
        canvasPosX = touch.pageX - Q.touch.offsetX;
        canvasPosY = touch.pageY - Q.touch.offsetY;
      }


      this.touchPos.p.ox = this.touchPos.p.px = canvasPosX / Q.cssWidth * Q.width;
      this.touchPos.p.oy = this.touchPos.p.py = canvasPosY / Q.cssHeight * Q.height;
      
      if(stage.viewport) {
        this.touchPos.p.px /= stage.viewport.scale;
        this.touchPos.p.py /= stage.viewport.scale;
        this.touchPos.p.px += stage.viewport.x;
        this.touchPos.p.py += stage.viewport.y;
      }

      this.touchPos.p.x = this.touchPos.p.px;
      this.touchPos.p.y = this.touchPos.p.py;

      this.touchPos.obj = null;
      return this.touchPos;
    },

    move: function(e) {
      for(var stageIdx=0;stageIdx < mouseStage.length;stageIdx++) {
        var touch = touches[i],
            stage = Q.stage(mouseStage[stageIdx]);

        if(!stage) { continue; }

        var pos = this.normalizeMouse(touch,stage);

        stage.regrid(pos,true);
        var col = stage.search(pos,mouseType), obj;

        if(col || stageIdx === mouseStage.length - 1) {
          obj = col && col.obj;
          pos.obj = obj;
          this.trigger("mousemove",pos);
        }

        if(!obj || obj !== this.enteredObject){
          if(enteredObject !== null){
              enteredObject.trigger('mouseExit',{
                //TODO: info here
              });
          }

          enteredObject = null;
        }

        if(obj){
          obj.trigger('mouseMove',{
            //TODO: info here
          });

          if(this.enteredObject !== obj) {
            this.enteredObject = obj;
            obj.trigger('mouseEnter',{
              //TODO: Info here
            });
          } 

          break;
        }
      }
    },
  });

  Q.mouse = function(type,stage) {
    Q.unmouse();
    mouseType = type || Q.SPRITE_UI;
    mouseStage = stage || [2,1,0];
    if(!Q._isArray(mouseStage)) {
      mouseStage = [mousehStage];
    }

    if(!Q._mouse) {
      Q.mouseInput = new Q.MouseSystem();
    }
    return Q;
  };

  Q.unmouse = function() {
    if(Q.mouseInput) {
      Q.mouseInput.destroy();
      delete Q['mouseInput'];
    }
    return Q;
  };



};
