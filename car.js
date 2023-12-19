class Car{
    constructor(x,y,width,height,controlType,maxspeed=3,imageUrl='./rr.png'){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.friction=0.05;
        this.angle=0;
        this.maxspeed=maxspeed;
        this.useBrain=controlType=="AI";
        if(controlType!="DUMMY"){
             this.sensor=new Sensor(this);
             this.brain=new NeuralNetwork(
                [ this.sensor.rayCount,6,4]
             );
             this.brain.addHiddenLayer(8);
        }
        this.controls=new Controls(controlType);

        this.polygon=[];
        this.damaged=false;

        this.image=document.createElement('img');
        this.image.src=imageUrl;
    }
    update(roadBorders,traffic){
        if(!this.damaged){
            this.#move();  
            this.damaged=this.#assDamage(roadBorders,traffic);
            this.polygon=this.#createPolygon();
        }
        if(this.sensor){
             this.sensor.update(roadBorders,traffic);   
             const offsets=this.sensor.readings.map(
                s=>s==null?0:1-s.offset
             )
             const outputs=NeuralNetwork.feedforward(offsets,this.brain);
            // console.log(outputs);

            if (this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1] ;
                this.controls.right = outputs[2] ;
                this.controls.reverse = outputs[3]; 
            }
            
         }
              
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
            this.speed-=0.1;
        }
        if(Math.abs(this.speed)<this.friction) this.speed=0;

       
        if(this.controls.left)
        {
            this.angle+=0.03;
            // if(this.x<15) this.x=15;
            // if(this.x>185) this.x=185;
        }
        if(this.controls.right)
        {
            this.angle-=0.03;
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
    draw(ctx,color="red",drawSensor=false){
        
        if(this.damaged) ctx.fillStyle="gray";
        else ctx.fillStyle=color;

        if (this.polygon.length != 0) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(-this.angle);
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();

            if (this.sensor && drawSensor) this.sensor.draw(ctx);
        }
    }
    
}