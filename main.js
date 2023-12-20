// Get the canvas element with the id "myCanvas"
const carCanvas = document.getElementById("carCanvas");

// Set the width of the canvas to 200 pixels
carCanvas.width = 500;

const networkCanvas = document.getElementById("networkCanvas");

// Set the width of the canvas to 200 pixels
networkCanvas.width = 300;
const src='./rr.png';

// Get the 2D rendering context of the canvas
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.95);

// Create a new instance of the Car class with initial position (100, 100), width 30, and height 50
const  N=1000;
const cars = generateCars(N);
let bestcar=cars[0];
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
function randomTraffic(N)
{
    const traffic=[];
    let y_coordinate=-100;
    for(let i=0;i<N;i++)
    {

        const laneNumber=Math.floor((Math.random()*10)%5);
        const randomSize=Math.floor((Math.random()*100));
        const randomSpeed=Math.random()%(0.2);
       // console.log(laneNumber);
        traffic.push(new Car(road.getLaneCenter(laneNumber),y_coordinate,30,50+randomSize,"DUMMY",0.5+randomSpeed));
        y_coordinate-=100+randomSize;             
    }
    return traffic;
}
const traffic=randomTraffic(100);

function carCounter(carCoordinate)
{
    let carPasses=0;
    //console.log(traffic.length);
    for(let i=0;i<traffic.length;i++)
    {
       // console.log(traffic[i].y);
        if(traffic[i].y>carCoordinate) carPasses+=1;
    }
   // console.log(carCoordinate);
    return carPasses;
}

// Draw the initial state of the car on the canvas
cars[0].draw(carCtx);

// Start the animation loop
animate();

function save(){
    localStorage.setItem("bestBrain",JSON.stringify(bestcar.brain));
}
function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N)
{
    const car=[];
    
    const laneNumber=Math.floor((Math.random()*10)%5);
    for(let i=1;i<=N;i++)
    {
        car.push(new Car(road.getLaneCenter(laneNumber), 100, 30, 50,"AI",10,'./rr2.png'));
    }
    return car;
}
//console.log(traffic);

// Animation loop function
function animate(time) {
    // Update the state of the car (position, etc.)
    for(let i=0;i<traffic.length;i++)
    {
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++)
    {
        cars[i].update(road.borders,traffic);
    }
    
    const bestcar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );

    const carPasses=carCounter(bestcar.y);
    document.getElementById("counter").textContent=carPasses;
    console.log(carPasses);
    // Set the height of the canvas to the window's inner height
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestcar.y+carCanvas.height*0.5);

    road.draw(carCtx);
    // Draw the updated state of the car on the canvas
    for(let i=0;i<traffic.length;i++)
    {
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.0;
    for(let i=0;i<cars.length;i++)
    {
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestcar.draw(carCtx,"blue",true);
    
    //console.log(localStorage);
    carCtx.restore();
    // Request the next animation frame, creating a loop
    networkCtx.lineDashOffset=-time/70;
    Visualizer.drawNetwork(networkCtx,cars[0].brain);
    requestAnimationFrame(animate);
}
