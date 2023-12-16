// Get the canvas element with the id "myCanvas"
const canvas = document.getElementById("myCanvas");

// Set the width of the canvas to 200 pixels
canvas.width = 600;

// Get the 2D rendering context of the canvas
const ctx = canvas.getContext("2d");

// Create a new instance of the Car class with initial position (100, 100), width 30, and height 50
const car = new Car(100, 100, 30, 50);

// Draw the initial state of the car on the canvas
car.draw(ctx);

// Start the animation loop
animate();

// Animation loop function
function animate() {
    // Update the state of the car (position, etc.)
    car.update();

    // Set the height of the canvas to the window's inner height
    canvas.height = window.innerHeight;

    // Draw the updated state of the car on the canvas
    car.draw(ctx);

    // Request the next animation frame, creating a loop
    requestAnimationFrame(animate);
}
