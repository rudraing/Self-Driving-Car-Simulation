class Car{
    constructor(x,y,width,height,controlType,maxspeed=3){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.friction=0.05;
        this.angle=0;
        this.maxspeed=maxspeed;
        if(controlType!="DUMMY") this.sensor=new Sensor(this);
        this.controls=new Controls(controlType);

        this.polygon=[];
        this.damaged=false;
    }
    update(roadBorders,traffic){
        if(!this.damaged){
            this.#move();  
            this.damaged=this.#assDamage(roadBorders,traffic);
            this.polygon=this.#createPolygon();
        }
        if(this.sensor) this.sensor.update(roadBorders,traffic);   
              
    }
    #assDamage(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++)
        {
            if(polyIntersect(this.polygon,roadBorders[i])) return true;
        }
        for(let i=0;i<traffic.length;i++)
        {
            if(polyIntersect(this.polygon,traffic[i].polygon)) return true;
        }
        return false;
    }
    
    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);

        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        })
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        })
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        })
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        })
        return points;

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
            this.angle+=0.02;
            // if(this.x<15) this.x=15;
            // if(this.x>185) this.x=185;
        }
        if(this.controls.right)
        {
            this.angle-=0.02;
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
        if(this.speed>this.maxspeed) this.speed=this.maxspeed;
        if(this.speed<-this.maxspeed) this.speed=-this.maxspeed;
        
    }
    draw(ctx,color){
        
        if(this.damaged) ctx.fillStyle="gray";
        else ctx.fillStyle=color;

        if(this.polygon.length!=0){
            ctx.beginPath();
            ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
            for(let i=1;i<this.polygon.length;i++)
            {
                    ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
            }
            ctx.fill();

            if(this.sensor)  this.sensor.draw(ctx);
        }
    }
    
}