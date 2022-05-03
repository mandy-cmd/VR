import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState, time } from "../render/core/controllerInput.js";

   let cx, cy, tx, ty, tz, theta, reverse = 0, hitByR = false, facingWall = undefined, hitByWall = false, t = 0, p = 0, startTime = 0, zstartTime = 0, g=1.8, startPositionMatrix, hitWallPositionMatrix;

   let hitsound = new Audio('media/sound/pingponghit.mp3')
   export const init = async model => {
      cx = 0, cy = 1.5, tx = 0, ty = 0, theta = 0, tz = 3.5, hitByWall = false;

      model.control('a', 'left' , () => tx -= .1);
      model.control('s', 'down' , () => ty -= .1);
      model.control('d', 'right', () => tx += .1);
      model.control('w', 'up'   , () => ty += .1);
      model.control('e', 'forward', () => tz += .1);
      model.control('l', 'controller left'  , () => cx -= .1);
      model.control('r', 'controller right' , () => cx += .1);

      model.control('f', 'rotate left'  , () => theta -= .1);
      model.control('g', 'rotate right' , () => theta += .1);

      // CREATE THE TARGET
      let parent = model.add();
      let target = parent.add();
      
      target.move(0,1.5,0).scale(.1).add('sphere').color(1,1,1).texture('media/textures/pingpong-butterfly.jpeg');
      let beam1 = target.add();
      let beam2 = target.add();
      let beam3 = target.add();
      
      let wall = model.add();
      wall.add('cube').texture('media/textures/brick.png');
      let paddle = model.add().add('cube').scale(0.5,0.5,.001)

   }

   export const display = model => {
      model.animate(() => {
         model.setTable(false);

         // GET THE CURRENT MATRIX AND TRIGGER INFO FOR BOTH CONTROLLERS

         let matrixL  = controllerMatrix.left;
         let triggerL = buttonState.left[0].pressed;

         let matrixR  = controllerMatrix.right;
         
         let RM = matrixR.length ? cg.mMultiply(matrixR, cg.mTranslate(-.001,-0.01,-0.04)) : cg.mTranslate(cx+.2,cy,1);
	      // ANIMATE THE TARGET
         let target_parent = model.child(0);
         let target = target_parent.child(0);
         let beam1 = target.child(0);


         let wall = model.child(1);
         wall.identity().scale(5, 1, 0.00000001).move(tx, ty+1, tz*10);
         let paddle = model.child(2);
         paddle.setMatrix(RM).scale(0.15, 0.15, 1);

         let hitR = cg.mHitRectXZ(paddle.getGlobalMatrix(), target.getGlobalMatrix());

         // let hitWall = cg.mHitRect(cg.mMultiply(target.getMatrix(), target_parent.getMatrix()), wall.getMatrix());
         // let hitWall = cg.mHitRect(beam1.getGlobalMatrix(), wall.getGlobalMatrix()) === null
         //  && cg.mHitRectXZ(beam2.getGlobalMatrix(), wall.getGlobalMatrix()) !== null
         //  && cg.mHitRectYZ(beam3.getGlobalMatrix(), wall.getGlobalMatrix()) !== null;
         let hitWall = cg.mHitRect(target.getGlobalMatrix(), wall.getGlobalMatrix()) === null;
         
         if (hitWall) {
            console.log("hit wall");
         }
         
         if (triggerL) {
            // serving ball
            target_parent.identity();
            
            target.setMatrix(cg.mMultiply(matrixL, cg.mTranslate(.006,0,-0.1))).scale(.05,.05,.05);
            
            if (facingWall)
               console.log("facing wall")
            t = 0;
            p = 0;
            startTime = model.time;
            hitByR = false;
            hitByWall = false;
            startPositionMatrix = null;
            hitWallPositionMatrix = null;
            
         }
         else if (hitR && startPositionMatrix === null) {
            // first time hit paddle
            hitByR = true;
            facingWall = cg.mHitRect(matrixR, wall.getGlobalMatrix()) !== null;
            
            if (facingWall)
               console.log("facing wall")
            startTime = model.time;
            startPositionMatrix = cg.mMultiply(cg.mMultiply(matrixR, cg.mTranslate(.006,0,-0.1)), cg.mScale(.05, .05, .05));
            // startPositionMatrix = cg.mMultiply(paddle.getGlobalMatrix(), cg.mScale(.05, .05, .05));            
            
            hitsound.play();
            let deltaT = (model.time/1.5 - startTime/1.5);
            reverse = deltaT * g;
            
         } 
         else if (hitR && hitByWall) {
            // Coming back from wall and hit
            hitByR = true;
            hitByWall = false;
            facingWall = cg.mHitRect(matrixR, wall.getGlobalMatrix()) !== null;
            
            if (facingWall)
               console.log("catching ball")
            startTime = model.time;
            startPositionMatrix = cg.mMultiply(cg.mMultiply(matrixR, cg.mTranslate(.006,0,-0.1)), cg.mScale(.05, .05, .05));
            hitWallPositionMatrix = null;
            
            hitsound.play();
            let deltaT = (model.time/1.5 - startTime/1.5);
            reverse = deltaT * g;
         } 

         else {
            // Free fall
            let deltaT = (model.time/1.5 - startTime/1.5);
            let downPosition = deltaT * deltaT * 1/2 * g;
            target_parent.identity().move(0, -downPosition, 0);
         }
         if(hitByR) {
            // ball moving after hit by paddle
            hitWall = hitWall && facingWall;
            let s = t;
            let backward = 0;
            let v = 80;
            let deltaT = (model.time/1.5 - startTime/1.5);
            if (hitWall && hitWallPositionMatrix === null) {
               hitsound.play();
               hitByWall = true;
               hitWallPositionMatrix = target.getGlobalMatrix();
               t = 0;
               console.log("hit wall");
               
            }
            let startingPoint = undefined;
            if (hitByWall) {
               console.log("hit by wall");
               
              
               facingWall = false;
               backward = 1.1;
               // s = -v * deltaT;
               startingPoint = hitWallPositionMatrix;
               deltaT = (model.time/3 - startTime/3);
               reverse = 0;
            } else {
               console.log("moving forward");
               // keep moving
               startingPoint = startPositionMatrix
               s = v * deltaT;
               
            }
            let downPosition = deltaT * deltaT * 1/2 * g;
            
            target.setMatrix(startingPoint).move(0, 0, -s);
            console.log(s);
            console.log("down " + downPosition);
            
            
            
            target_parent.move(0, -downPosition+reverse*deltaT, -backward*1.2 * deltaT);
         }
      
      });
   }
