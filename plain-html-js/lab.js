(
    function main() {

        var svg = d3.select('body')
            .append('svg')
                .attr('width', 200)
                .attr('height', 200)

            .append('rect')
                .attr('width', 50)
                .attr('height', 50)
                .attr('fill', 'red');
    }
)();