import * as d3 from 'd3';

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
    
        var widgets = d3
            .range(20)
            .map(function(i) {
                return {
                    'x' : (i % 10) * (widgetWidth + widgetPadding),
                    'y' : Math.trunc(i / 10) * (widgetHeight + widgetPadding),
                    'width' : widgetWidth,
                    'height' : widgetHeight
                }
            });
        
            svg
            .selectAll('g')
            .data(widgets)
            .enter()
                .append('g')
                    .attr('transform', function(d) {
                        return 'translate(' + d.x + ', ' + d.y + ')';
                    })
                .append('rect')
                .attr('width', function(d) { return d.width; })
                .attr('height', function(d) { return d.height; })
                .attr('stroke', 'black');                
    }
)();