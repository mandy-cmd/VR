import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState, time } from "../render/core/controllerInput.js";

   let cx, cy, tx, ty, tz, theta, hitByR = false, hitByWall = false, t = 0, p = 0, startTime = 0, zstartTime = 0, g=9.8, startPositionMatrix, hitWallPositionMatrix;

   let hitsound = new Audio('media/sound/pingponghit.mp3')
   export const init = async model => {
      cx = 0, cy = 1.5, tx = 0, ty = 0, theta = 0, tz = 3.5, hitByWall = false;

      model.control('a', 'left' , () => tx -= .1);
      model.control('s', 'down' , () => ty -= .1);
      model.control('d', 'right', () => tx += .1);
      model.control('w', 'up'   , () => ty += .1);
      model.control('e', 'forward'   , () => tz += .1);
      model
      model.control('l', 'controller left'  , () => cx -= .1);
      model.control('r', 'controller right' , () => cx += .1);

      model.control('f', 'rotate left'  , () => theta -= .1);
      model.control('g', 'rotate right' , () => theta += .1);

      // CREATE THE TARGET

      let target = model.add().add();
      target.move(0,1.5,0).scale(.1)
      .add('sphere').color(1,1,1).texture('media/textures/pingpong-butterfly.jpeg');

      let wall = model.add();
      wall.add('cube').texture('media/textures/brick.png');

   }

   export const display = model => {
      model.animate(() => {
         model.setTable(false);

         // GET THE CURRENT MATRIX AND TRIGGER INFO FOR BOTH CONTROLLERS

         let matrixL  = controllerMatrix.left;
         let triggerL = buttonState.left[0].pressed;

         let matrixR  = controllerMatrix.right;
         

	 // ANIMATE THE TARGET
         let target_parent = model.child(0);
         let target = model.child(0).child(0);
         let wall = model.child(1);
         wall.identity().scale(3, 3, 0.01).move(tx, ty, -tz*40);
         

         let LM = matrixL.length ? cg.mMultiply(matrixL, cg.mTranslate( -.01,0,0)) : cg.mTranslate(cx-.2,cy,1);
         let RM = matrixR.length ? cg.mMultiply(matrixR, cg.mTranslate(-.001,0,0)) : cg.mTranslate(cx+.2,cy,1);

      

         let hitR = cg.mHitRect(matrixR, target.getMatrix());
         let hitWall = cg.mHitRect(target.getMatrix(), wall.getMatrix());

         
         if (triggerL) {
            target_parent.identity();
            target.setMatrix(cg.mMultiply(matrixL, cg.mTranslate(.006,0,-0.1))).scale(.05,.05,.05);
            console.log("target matrix " + target.getMatrix());
            console.log("controller matrix " + matrixL);
            t = 0;
            p = 0;
            startTime = model.time;
            hitByR = false;
            hitByWall = false;
            startPositionMatrix = null;
            
         }
         else if (hitR && startPositionMatrix === null) {
            hitByR = true;
            zstartTime = model.time;
            startPositionMatrix = cg.mMultiply(matrixR, cg.mTranslate(.006,0,-0.1));
            hitsound.play();
         } else {
            let deltaT = (model.time/1.5 - startTime/1.5);
            let downPosition = deltaT * deltaT * 1/2 * g;
            target_parent.identity().move(0, -downPosition, 0);
         }
         if(hitByR) {
            let s = t;
            if (hitWall && hitWallPositionMatrix === null) {
               
               hitByWall = true;
               hitWallPositionMatrix = target.getMatrix();
               t = 0;
               console.log("hit wall");
               
            }
            let startingPoint = undefined;
            if (hitByWall) {
               console.log("hit by wall");
               t -= 0.08;
               startingPoint = hitWallPositionMatrix;
            } else {
               t += 0.08;
               startingPoint = startPositionMatrix;
            }
            s = t;
            
            target.setMatrix(startingPoint).move(0, 0, -s).scale(.05,.05,.05);
            let deltaT = (model.time/1.5 - startTime/1.5);
            let downPosition = deltaT * deltaT * 1/2 * 9.8;
            target_parent.move(0, -downPosition, 0);
         }
      
      });
   }
