// Get the canvas element with the id "myCanvas"
const carCanvas = document.getElementById("carCanvas");

// Set the width of the canvas to 200 pixels
carCanvas.width = 250;

const networkCanvas = document.getElementById("networkCanvas");

// Set the width of the canvas to 200 pixels
networkCanvas.width = 300;


// Get the 2D rendering context of the canvas
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.95);

// Create a new instance of the Car class with initial position (100, 100), width 30, and height 50
const car = new Car(road.getLaneCenter(1), 100, 30, 50,"AI",3);

const traffic=[
    new Car(road.getLaneCenter(1), -100, 30, 50,"DUMMY",1)
];
// Draw the initial state of the car on the canvas
car.draw(carCtx);

// Start the animation loop
animate();

// Animation loop function
function animate(time) {
    // Update the state of the car (position, etc.)
    for(let i=0;i<traffic.length;i++)
    {
        traffic[i].update(road.borders,[]);
    }
    car.update(road.borders,traffic);
    
    // Set the height of the canvas to the window's inner height
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-car.y+carCanvas.height*0.5);

    road.draw(carCtx);
    // Draw the updated state of the car on the canvas
    for(let i=0;i<traffic.length;i++)
    {
        traffic[i].draw(carCtx,"red");
    }
    car.draw(carCtx,"blue");
    
    carCtx.restore();
    // Request the next animation frame, creating a loop
    networkCtx.lineDashOffset=-time/70;
    Visualizer.drawNetwork(networkCtx,car.brain);
    requestAnimationFrame(animate);
}
