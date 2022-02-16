import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState, time } from "../render/core/controllerInput.js";

   let cx, cy, tx, ty, theta, hitByR = false, t = 0, p = 0, startPositionMatrix;
   let bgm = new Audio('media/sound/workout.mp3');
   bgm.volume = 0.2;
   let hitsound = new Audio('media/sound/pingponghit.mp3')
   export const init = async model => {
      cx = 0, cy = 1.5, tx = 0, ty = 0, theta = 0;

      model.control('a', 'left' , () => tx -= .1);
      model.control('s', 'down' , () => ty -= .1);
      model.control('d', 'right', () => tx += .1);
      model.control('w', 'up'   , () => ty += .1);

      model.control('l', 'controller left'  , () => cx -= .1);
      model.control('r', 'controller right' , () => cx += .1);

      model.control('f', 'rotate left'  , () => theta -= .1);
      model.control('g', 'rotate right' , () => theta += .1);
      bgm.play();
      // CREATE THE TARGET

      let target = model.add();
      target.move(0,1.5,0).scale(.1)
      .add('sphere').color(1,1,1).texture('media/textures/pingpong-butterfly.jpeg');

   }

   export const display = model => {
      model.animate(() => {

         // GET THE CURRENT MATRIX AND TRIGGER INFO FOR BOTH CONTROLLERS

         let matrixL  = controllerMatrix.left;
         let triggerL = buttonState.left[0].pressed;

         let matrixR  = controllerMatrix.right;
         let triggerR = buttonState.right[0].pressed;

	 // ANIMATE THE TARGET

         let target = model.child(0);


         let LM = matrixL.length ? cg.mMultiply(matrixL, cg.mTranslate( -.01,0,0)) : cg.mTranslate(cx-.2,cy,1);
         let RM = matrixR.length ? cg.mMultiply(matrixR, cg.mTranslate(-.001,0,0)) : cg.mTranslate(cx+.2,cy,1);

         model.child(1).setMatrix(LM);
         model.child(2).setMatrix(RM);


         let hitL = cg.mHitRect(matrixL, target.getMatrix());
         let hitR = cg.mHitRect(matrixR, target.getMatrix());

         if (triggerL) {
            target.setMatrix(cg.mMultiply(matrixL, cg.mTranslate(.006,0,-0.1))).scale(.05,.05,.05);
            t = 0;
            p = 0;
            hitByR = false;
            startPositionMatrix = null;
            
         }
         else if (hitR && startPositionMatrix == null) {
            hitByR = true;
            startPositionMatrix = cg.mMultiply(matrixR, cg.mTranslate(.006,0,-0.1));
            hitsound.play();
         } else {
            p += model.deltaTime;
            target.move(0, -p, 0);
         }
         if(hitByR) {
            t += model.deltaTime;
            let s = t;
            target.setMatrix(startPositionMatrix).move(0, 0, -s).scale(.05,.05,.05);
         }
      
      });
   }
