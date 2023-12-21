class Controls{
    //constructor is used to initialize this the control properties
    constructor(controlType){
        this.forward=false;
        this.left=false;
        this.right=false;
        this.reverse=false;

        //switch used for altering the path based on the controltype
        switch(controlType)
        {
            case "KEYS" || "AI":
                this.#addKeyboardListerners();
                break;
            case "DUMMY":
                this.forward=true;
                break;
        }
    }

    // # is used for declaring private method
    #addKeyboardListerners(){
        //general function in onkeydown=function(event) but it does not help
        // in calling the constructor that's why we use (event)=> method
        document.onkeydown=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=true;
                    break;
                case "ArrowRight":
                    this.right=true;
                    break;
                case "ArrowUp":
                    this.forward=true;
                    break;
                case "ArrowDown":
                    this.reverse=true;
                    break;
            }
        }
        document.onkeyup=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=false;
                    break;
                case "ArrowRight":
                    this.right=false;
                    break;
                case "ArrowUp":
                    this.forward=false;
                    break;
                case "ArrowDown":
                    this.reverse=false;
                    break;
            }
        }
    }
}