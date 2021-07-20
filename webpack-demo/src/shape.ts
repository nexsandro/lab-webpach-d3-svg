import * as d3 from 'd3';

class Point {
    x: number;
    y: number;
}

class Shape {
    position: Point; 
    width : number;
    height : number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    move(point: Point) {
        this.position.x = point.x;
        this.position.y = point.y;
    }

    translate(dx: number, dy: number) {
        this.position.x += dx;
        this.position.y += dy;
    }
}

class Process extends Shape {
    name: string;

    constructor(name: string) {
        super(200, 100);
        this.name = name;
    }
}

class Activity extends Shape {

    name: string;

    constructor(name: string) {
        super(200, 100);
        this.name = name;
    }

}

