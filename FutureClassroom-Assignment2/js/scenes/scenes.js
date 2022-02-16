import * as global from "../global.js";
import { Gltf2Node } from "../render/nodes/gltf2.js";

export default () => {

   global.scene().addNode(new Gltf2Node({
      url: "./media/gltf/60_fifth_ave/60_fifth_ave.gltf"
   }));

   return {
      enableSceneReloading: true,
      scenes: [
         { name: "DemoCube"   , path: "./demoCube.js"    },
         { name: "DemoController"     , path: "./demoController.js"      },
         { name: "DemoHitRect", path: "./demoHitRect.js" },
         { name: "DemoDots"   , path: "./demoDots.js"    },
         { name: "DemoBlobs"  , path: "./demoBlobs.js"   },
         { name: "DemoPingPong"  , path: "./demoHitPingPong.js"   }
      ]
   };
}
