class road{
    constructor(x,width,lanecount=3){
        this.x=x;
        this.width=width;
        this.lanecount=lanecount;

        this.left=x-width/2;
        this.right=x+=width/2;

        const inf=1000000;

    }
}