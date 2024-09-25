class MapGenerator {
    private map: string[][];
    private n: number;
    private m: number;

    constructor(n: number, m: number) {
        this.n = n;
        this.m = m;
        this.map = []; 
    }

    create_empty_map() {
        for (let i = 0; i < this.n; i++) {
            this.map[i] = new Array(this.m).fill(0);
        }
    }

    add_path() {
        if (!this.map) {
            throw new Error('Map is not initialized');
        }
        let x = Math.floor(this.n / 2); 
        let y = 0; 

        this.map[x][y] = 7; 

        while (y < this.m - 1) {  
            const direction = Math.floor(Math.random()* 3);  // Randomly choose a direction

            if (direction === 0 && x > 0) {
                x--; // 0 means up
            } else if (direction === 1 && x < this.n - 1) {
                x++; // 1 means down
            }
            if (x >= 0 && x < this.n && y >= 0 && y < this.m) { // keeps it inside x and y
                this.map[x][y] = 7; // keep track of where you been 
                y++; // Always move right
                this.map[x][y] = 7;
            }
        }
    }
// add the contition not to be 7:
    contour_map() {
        // first border
        for (let i = 0; i < this.n; i++) {
            this.map[i][0] = 1; 
            this.map[i][this.m - 1] = 1;
        }

        for (let j = 0; j < this.m; j++) {
            this.map[0][j] = 1;
            this.map[this.n - 1][j] = 1 ; 
        }

        // second border
        for (let i = 1; i < this.n - 1; i++) {
            this.map[i][1] = Math.floor(Math.random() * 2); 
            this.map[i][this.m - 2] = Math.floor(Math.random() * 2);
        }

        for (let j = 1; j < this.m - 1; j++) {
            this.map[1][j] = Math.floor(Math.random() * 2);
            this.map[this.n - 2][j] = Math.floor(Math.random() * 2); 
        }
    }

    fill_map() {
        const map_tiles = [0, 2, 3, 4, 5, 6, 8, 9];
        const frequency = [50, 35, 5, 3, 3, 2, 1, 1]; 
    
        const cumulativeFrequency = this.calculateCumulativeFrequency(frequency);
        
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.m; j++) {
                if (this.map[i][j] === 0) { 
                    const randomValue = Math.random() * cumulativeFrequency[cumulativeFrequency.length - 1];
                    const selectedIndex = this.getSelectedIndex(cumulativeFrequency, randomValue);
                    this.map[i][j] = map_tiles[selectedIndex];
                }
            }
        }
    }
    
    calculateCumulativeFrequency(frequency) {
        const cumulativeFrequency = [];
        let total = 0;
    
        for (const weight of frequency) {
            total += weight; 
            cumulativeFrequency.push(total);
        }
    
        return cumulativeFrequency;
    }
    
    getSelectedIndex(cumulativeFrequency, randomValue) {
        return cumulativeFrequency.findIndex(weight => randomValue < weight);
    }

    run() {
        this.create_empty_map(); 
        this.add_path();
        this.contour_map();
        this.fill_map();
        console.log(this.map); 
    }
}

const mapGenerator = new MapGenerator(20, 20);
mapGenerator.run();
