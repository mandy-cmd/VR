let DemoFilledDonut = function() {

   this.init = (model) => {
      this.start = true;
      this.name = "cube";
      this.model = model;
      this.model.move(0,1.5,0).scale(0.2);
      this.node = this.model.add();
      this.donut = this.model.add('donut').color(1,0,1).texture('media/textures/cube-sea.png');
      
      this.node.add('tubeX').scale(0.1, 0.1, 3).color(0,1,1);
      this.node.add('cube').scale(0.5, 0.5, 0.5).texture('media/textures/brick.png').color(1,1,0);

   }

   this.display = () => {
      this.model.animate(() => {
         this.donut.identity().turnY(0.5 * this.model.time).turnX(0.5 * this.model.time);
         this.node.identity().turnY(2.5 * this.model.time).turnZ(2.5 * this.model.time);
      });
   }
}

export let demoFilledDonut
 = new DemoFilledDonut();
