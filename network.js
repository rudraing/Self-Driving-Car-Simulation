class NeuralNetwork {
    constructor(neuronCounts) {
        this.levels = [];
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
    }

    // Function to add a new hidden layer in the network
    addHiddenLayer(neuronCount) {
        const lastHiddenLayerIndex = this.levels.length - 2;
        this.levels.splice(lastHiddenLayerIndex, 0, new Level(this.levels[lastHiddenLayerIndex].outputs.length, neuronCount));
        this.levels[lastHiddenLayerIndex + 1] = new Level(neuronCount, this.levels[lastHiddenLayerIndex + 1].outputs.length);
    }

    // Feedforward network
    static feedforward(givenInputs, network) {
        let outputs = Level.feedforward(givenInputs, network.levels[0]);
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedforward(outputs, network.levels[i]);
        }
        return outputs;
    }

    // Mutation in the biases and weights of the nodes
    static mutate(network, amount = 1) {
        network.levels.forEach((level) => {
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
            }
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(level.weights[i][j], Math.random() * 2 - 1, amount);
                }
            }
        });
    }
}

class Level {
    constructor(inputCount, outputCount) {

        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);


        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }
       // Level.#randomize(this)
       Level.#xavierInitialize(this);

    }
    //Xavier Initialization 
    static #xavierInitialize(level) {
        const xavierFactor = Math.sqrt(1 / (level.inputs.length + level.outputs.length));
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 * xavierFactor - xavierFactor;
            }
        }
        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 * xavierFactor - xavierFactor;
        }
    }
    
    //initializing random biases and weights between -1 and 1 of the nodes
    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }
        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    static sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    static feedforward(givenInputs, level) {
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }
            level.outputs[i] = Level.sigmoid(sum + level.biases[i]);
        }
        return level.outputs;
    }
    
    // static feedforward(givenInputs, level) {
    //     for (let i = 0; i < level.inputs.length; i++) {
    //         level.inputs[i] = givenInputs[i];
    //     }
    //     for (let i = 0; i < level.outputs.length; i++) {
    //         let sum = 0;
    //         for (let j = 0; j < level.inputs.length; j++) {
    //             sum += level.inputs[j] * level.weights[j][i];
    //         }
    //         if(sum>level.biases[i]) level.outputs[i]=1;
    //         else level.outputs[i]=0;
    //     }
    //     return level.outputs;
    // }
}
