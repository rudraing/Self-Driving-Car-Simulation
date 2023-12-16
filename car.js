class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.friction=0.05;
        this.angle=0;

        this.sensor=new Sensor(this);
        this.controls=new Controls();
    }
    update(){
        this.#move();  
        this.sensor.update();   
      
         
        
    }
    #move()
    {
        if(this.controls.forward){
            this.speed+=this.acceleration;
            
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }
        if(Math.abs(this.speed)<this.friction) this.speed=0;

       
        if(this.controls.left)
        {
            this.angle+=0.005;
            // if(this.x<15) this.x=15;
            // if(this.x>185) this.x=185;
        }
        if(this.controls.right)
        {
            this.angle-=0.005;
            // if(this.x<15) this.x=15;
            // if(this.x>185) this.x=185;
        }

        if(this.speed>0) this.speed-=this.friction;
        if(this.speed<0) this.speed+=this.friction;
        
        if(this.speed!=0)
        {
            const flip=this.speed>0?1:-1;
            if(this.controls.left) this.angle+=0.02*flip;
            if(this.controls.right) this.angle-=0.02*flip;
        }        
         
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;

        // if(this.y<25){ this.y=25;this.speed=0;}
        // if(this.y>683){ this.y=683;this.speed=0;}
        if(this.acceleration>4) this.acceleration=4;
        if(this.acceleration<-4) this.acceleration=-4;
        
    }
    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);
        ctx.beginPath();
        ctx.rect(
            - this.width / 2,  // X-coordinate of the top-left corner of the rectangle
            - this.height / 2, // Y-coordinate of the top-left corner of the rectangle
            this.width,               // Width of the rectangle
            this.height               // Height of the rectangle
        );
        
        ctx.fill();
        ctx.restore();

       this.sensor.draw(ctx);
       
    }
   
}