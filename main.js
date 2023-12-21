//Car Canvas Declaration 
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 250;
const carCtx = carCanvas.getContext("2d");

//Network canvas Declaration 
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;
const networkCtx = networkCanvas.getContext("2d");


//Road Construction 
const road=new Road(carCanvas.width/2,carCanvas.width*0.95);


//Number of cars and Finding best car out of it 
const  N=1000;
const cars = generateCars(N);
let bestcar=cars[0];

function generateCars(N)
{
    const car=[];
    const laneNumber=Math.floor((Math.random()*10)%3);
    for(let i=1;i<=N;i++)
    {
        car.push(new Car(road.getLaneCenter(laneNumber), 100, 30, 50,"AI",10,'./rr2.png'));
    }
    return car;
}

//Storing best car in the local storage 
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++)
    {
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if(i!=0)
        {
            NeuralNetwork.mutate(cars[i].brain,0.2);
        }
    }
}
//Saving the best car in the local storage 
function save(){
    localStorage.setItem("bestBrain",JSON.stringify(bestcar.brain));
}
//removing that particular best car from the local storage 
function discard(){
    localStorage.removeItem("bestBrain");
}


//Creating a set of cars whcih has random lane number and and randome size 
function randomTraffic(N)
{
    const traffic=[];
    let y_coordinate=-100;
    for(let i=0;i<N;i++)
    {
        const laneNumber=Math.floor((Math.random()*10)%3);
        const randomSize=Math.floor((Math.random()*100));
        const randomSpeed=Math.random()%(0.2);
        traffic.push(new Car(road.getLaneCenter(laneNumber),y_coordinate,30,50+randomSize,"DUMMY",0.5+randomSpeed));
        y_coordinate-=100+randomSize;             
    }
    return traffic;
}
const traffic=randomTraffic(100);


//function to check the number of cars passed successfully
function carCounter(carCoordinate)
{
    let carPasses=0;
    for(let i=0;i<traffic.length;i++)
    {
        if(traffic[i].y>carCoordinate) carPasses+=1;
    }
    return carPasses;
}

//initial car drawing 
cars[0].draw(carCtx);
animate();

// Animation loop function
function animate(time) {

    //updating the road traffic 
    for(let i=0;i<traffic.length;i++)   traffic[i].update(road.borders,[]);
    
    //updating the cars with current traffic 
    for(let i=0;i<cars.length;i++)      cars[i].update(road.borders,traffic);
    
    //lambda function to find the best car on the road(car which has the minimum y length )
    const bestcar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );

    //const carPress to find the number of cars successfully passed 
    const carPasses=carCounter(bestcar.y);
    document.getElementById("counter").textContent=carPasses;

   
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestcar.y+carCanvas.height*0.5);

    road.draw(carCtx);

    for(let i=0;i<traffic.length;i++)    traffic[i].draw(carCtx,"red");
    
    //visibility of cars 
    carCtx.globalAlpha=0.0;
    for(let i=0;i<cars.length;i++)         cars[i].draw(carCtx,"blue");
    carCtx.globalAlpha=1;

    //draw the best car 
    bestcar.draw(carCtx,"blue",true);
    
    carCtx.restore();
    networkCtx.lineDashOffset=-time/70;

    //visualizer 
    Visualizer.drawNetwork(networkCtx,cars[0].brain);
    requestAnimationFrame(animate);
}
