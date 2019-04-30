export class Rgb {
    constructor(r, g, b){
        if(!arguments.length){ //empty constructor - new Rgb()
            this.r = 0;
            this.g = 0;
            this.b = 0;
        }
        else if(arguments.length == 1){ //string argument - new Rgb("rgb(123,123,123)")
            let substring = r.substring(4, r.length-1);
            let array = substring.split(',');
            this.r = Number(array[0]);
            this.g = Number(array[1]);
            this.b = Number(array[2]);

        }
        else{ //constructor with r, g, b - new Rgb(10, 50, 100)
            this.r = r;
            this.g = g;
            this.b = b;
        }
    }

    toString() {
        return `rgb(${this.r},${this.g},${this.b})`
    }

    //parses string and gets Rgb object - strings need to be like this: rgb(100, 5, 29)!
    static getObjectFromString(colorString) {
        let object = new Rgb();

        let substring = color.substring(4, color.length-1);
        let array = substring.split(',');
        object.r = Number(array[0]);
        object.g = Number(array[1]);
        object.b = Number(array[2]);

        return object;
    }
}