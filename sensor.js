class Sensor{
    constructor(car) {
        this.car = car;
        this.rayCount = 4;
        this.rayLength = 100;
        this.raySpread = Math.PI /4;

        this.rays = [];
        this.readings=[];
    }

    update(roadBorders) {
      this.#castRays();
      this.reading=[];
      for(let i=0;i<this.rays.length;i++)
      {
        this.readings.push(
            this.#getReading(this.rays[i],roadBorders)
        );
      }
    }

    #getReading(ray,roadBorders)
    {
        
    }

    #castRays(){
        this.rays= [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                i / (this.rayCount - 1)
            );

            const start = { x:this.car.x, y:this.car.y };
            const end = {
                x: this.car.x -Math.sin(rayAngle) * this.rayLength,
                y: this.car.y- Math.cos(rayAngle) * this.rayLength
            };
            
            // Move the push operation inside the loop to store each ray
            this.rays.push([start, end]);
       
    } 
}
    draw(ctx) {
        
        if(this.rays.length!=0){
            for (let i = 0; i < this.rayCount; i++) {
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "Yellow";
                ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
                ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
                ctx.stroke(); // Add the stroke operation to actually draw the line
            }
        }
    }
}
