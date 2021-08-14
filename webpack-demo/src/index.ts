import * as d3 from 'd3';
import { v4 as uuidv4 }  from 'uuid';

class Point {
    x: number;
    y: number;
}

class Shape {
    id: string;
    position: Point; 
    width : number;
    height : number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.position = new Point();
        this.id = uuidv4();
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


(

    function main() {

        var svg = d3.select('body')
            .append('svg')
                .attr('id', 'svg1')
                .attr('width', 1800)
                .attr('height', 800)

        var widgetWidth = 150;
        var widgetHeight = 100;
        var widgetPadding = 5;
    
        /*
         Generate random data in widgets variable.
        */
        var widgets = d3
            .range(20)
            .map(function(i) {
                var p = new Process('Process #' + i);
                p.width = widgetWidth;
                p.height = widgetHeight;
                p.position.x = (i % 10) * (widgetWidth + widgetPadding);
                p.position.y = Math.trunc(i / 10) * (widgetHeight + widgetPadding);

                return p;
            });
        
        /*
        Drag & Drop evens
        */
       var dragShape = {
           function dragstarted() {
                console.log(this);
           }

           function dragged(event, d) {
                console.log(this);
            }

            function dragended() {
                console.log(this);
            }

           return d3.drag()
                .on('start', dragstarted)
                .on('end', dragended)
                .on('drag', dragged);
       };

        /*
        Render all Shapes in widgets var.
        */
            svg
            .selectAll('g')
            .data(widgets)
            .enter()
                .append('g')
                    .attr('id', function(d) { return d.id; })
                    .attr('transform', function(d) {
                        return 'translate(' + d.position.x + ', ' + d.position.y + ')';
                    })
                    .call(dragShape)
                    .on('click', function(event) { event.preventDefault(); })
                .append('rect')
                .attr('width', function(d) { return d.width; })
                .attr('height', function(d) { return d.height; })
                .attr('stroke', 'blue');                
    }
)();