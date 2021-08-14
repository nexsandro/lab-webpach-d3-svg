const GENERAL_STROKE = 'rgb(26, 117, 163)';
const EVENTO_STROKE = 'rgb(207, 167, 35)';
const EVENTO_INICIO_RAY = 20;
const EVENTO_INICIO_FILL = 'url(#radialGradientLifeCycle)';
const EVENTO_INICIO_STROKE_WIDTH = 4;
const EVENTO_FIM_STROKE_WIDTH = 6;
const EVENTO_TEXT_OFFSET = 40;
const ATIVIDADE_RAY = 10;
const ATIVIDADE_STROKE = GENERAL_STROKE;
const ATIVIDADE_STROKE_WIDTH = 4;
const ATIVIDADE_FILL = 'url(#radialGradient1)'; 
const RISK_STROKE = 'rgb(255, 119, 110)';
const RISK_STROKE_WIDTH = 1;
const RISK_STROKE_DASHARRAY = [];
//const RISK_FILL = 'url(#radialGradient1)'; 
const RISK_FILL = 'white'; 
const RISK_CONTROL_STROKE = 'rgb(109, 152, 252)';
const RISK_CONTROL_STROKE_WIDTH = 1;
const RISK_CONTROL_FILL = 'white'; 
const DECISAO_STROKE = 'rgb(252, 83, 151)';
const DECISAO_STROKE_WIDTH = 4;
const DECISAO_FILL = 'url(#radialGradientDecision)';
const DECISAO_TEXT_OFFSET = 17;
const LINE_STROKE = 'black'
const LINE_STROKE_WIDTH = 1.7;
const LINE_DRAG_WIDTH = 8;
const ARROW_STYLE_OPEN = 'arrow-open';
const ARROW_STYLE_CLOSED = 'arrow-closed';

const ALERT_RAY = 7;
const ALERT_STROKE = 'black';
const ALERT_STROKE_WIDTH = 0.2;
const ALERT_MEDIUM_FILL = 'url(#radialGradientYellow)'; 
const ALERT_LOW_FILL = 'url(#radialGradientGreen)'; 
const ALERT_HIGH_FILL = 'url(#radialGradientRed)'; 

/*
 Model
 */
function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Shape(x, y) {

    var shape = this;
    this.type = 'evento-inicio';
    this.position = new Point(x, y);
    this.width = 0;
    this.height = 0;
    this.name;
    this.id = uuidv4();
    this.selection = null;

    // D3 base selection
    this.selection = null;

    // Incoming Flow[]
    this.incoming = [];

    // Outgoing Flow[]
    this.outgoing = [];

    this.advisor = {
        move : function(px, py) {
            shape.position.x = px;
            shape.position.y = py;
            shape.selection.attr('transform', 'translate(' + px + ', ' + py + ')');

            for(var incIdx = 0; incIdx<shape.incoming.length; incIdx++) {
                var flow = shape.incoming[incIdx];
                var points = computeConnectionPoints(flow.start, flow.end);
                
                flow.connector.selection.select('line')
                    .attr('x2', points[1].x)
                    .attr('y2', points[1].y);
            }

            for(var outIdx = 0; outIdx<shape.outgoing.length; outIdx++) {
                var flow = shape.outgoing[outIdx];
                var points = computeConnectionPoints(flow.start, flow.end);
                
                
                flow.connector.selection.select('line')
                    .attr('x1', points[0].x)
                    .attr('y1', points[0].y);
            }

        },
        connectTo : function(otherShape, flowStyle) {
            var connection = new Flow(shape, otherShape, flowStyle);
            shape.outgoing.push(connection);
            otherShape.incoming.push(connection);
        }

    }

}

function EventoInicio(x, y) {
    var shape = new Shape(x, y);
    shape.type = 'evento-inicio';
    return shape;
}

function EventoFim(x, y) {
    var shape = new Shape(x, y);
    shape.type = 'evento-fim';
    return shape;
}

function Atividade(x, y) {
    var shape = new Shape(x, y);
    shape.type = 'atividade';
    shape.width = 150;
    shape.height = 100;

    return shape;
}

function SubProcess(x, y) {
    var shape = new Shape(x, y);
    shape.type = 'sub-process';
    shape.width = 150;
    shape.height = 100;

    return shape;
}

function Risk(x, y) {
    var shape = new Shape(x, y);
    shape.type = 'risk';
    shape.width = 150;
    shape.height = 80;

    return shape;
}

function RiskControl(x, y) {
    var shape = new Shape(x, y);
    shape.type = 'risk-control';
    shape.width = 150;
    shape.height = 80;

    return shape;
}

function Line(p1, p2, flowStyle) {
    var shape = new Shape(p1.x, p1.y);
    shape.type = 'line';
    shape.flowStyle = flowStyle;
    shape.position.x = p1.x;
    shape.position.y = p1.y;
    shape.start = shape.position;
    shape.end = p2;
    shape.markerStyle = null;
    return shape;
}

function Decisao(x, y) {
    var shape = new Shape(x, y);
    shape.type = 'decisao';
    shape.width = 50;
    shape.height = 50;    
    return shape;

}

function Editor(width, height) {
    var editor = this;
    this.id = uuidv4();
    this.width = width;
    this.height = height;
    this.rendererFactory = new RendererFactory();
    this.shapes = [];

    this.addShape = function(shape) {
        editor.shapes.push(shape);
    }

    this.renderShapes = function() {
        for(var i=0; i<editor.shapes.length; i++) {
            var shape = editor.shapes[i];
            this.renderer = editor.rendererFactory.getInstance(shape);
            this.renderer.render(editor, shape);

            for(var j=0; j<shape.outgoing.length; j++) {
                var flow = shape.outgoing[j];
                this.renderer = editor.rendererFactory.getInstance(flow.connector);
                this.renderer.render(editor, flow.connector);
            }
        }
    }
}

/*
 Drag & Drop support
 */
var dragSupport = function() {

    var dx, dy;

    function dragstarted(event, d) {
        
        dx = event.x - this.shape.position.x;
        dy = event.y - this.shape.position.y;
        d3.select(this).raise();

        // raise connectors
        for(var incIdx = 0; incIdx<this.shape.incoming.length; incIdx++) {
            var flow = this.shape.incoming[incIdx];
            flow.connector.selection.raise();
        }

        for(var outIdx = 0; outIdx<this.shape.outgoing.length; outIdx++) {
            var flow = this.shape.outgoing[outIdx];
            flow.connector.selection.raise();
        }

    }
  
    function dragged(event, d) {
        px = event.x - dx;
        py = event.y - dy;
        this.shape.advisor.move(px, py);
    }
  
    function dragended(event, d) {
    }
  
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

function EditorRenderer() {
    this.id = uuidv4();
    this.render = function (d3Selection, editor) {

        // editor.selection is the insertion point for other shapes
        editor.selection = d3.select(d3Selection)
            .append('svg')
            .attr('width', editor.width)
            .attr('height', editor.height)
            .attr('id', editor.id)
            .style('border', 'solid 1px');
            
        var defsSelection = editor.selection
            .append('defs');
        
        defsSelection
            .append('marker')
            .attr('id', 'arrow-closed')
            .attr('orient', 'auto')
            .attr('markerWidth', 7)
            .attr('markerHeight', 7)
            .attr('refX', 51)
            .attr('refY', 25)
            .attr('viewBox', '0 0 51 51')
            .append('path')
            .attr('d', 'M 0 0 L 50 25 L 0 50 L 10 25 z')
            .attr('stroke', 'black')
            .attr('stroke-width', 2);
        
        defsSelection
            .append('marker')
            .attr('id', 'arrow-open')
            .attr('orient', 'auto')
            .attr('markerWidth', 7)
            .attr('markerHeight', 7)
            .attr('refX', 51)
            .attr('refY', 25)
            .attr('viewBox', '0 0 51 51')
            .append('path')
            .attr('d', 'M 0 0 L 51 25 L 0 51 L 10 25 z')
            .attr('stroke', 'black')
            .attr('fill', 'white')
            .attr('stroke-width', 2);

        var radialGradient = defsSelection
            .append('radialGradient')
            .attr('id', 'radialGradientYellow')
            .attr('cx', '30%')
            .attr('cy', '20%')
            .attr('r', '70%');

        radialGradient
            .append('stop')
            .attr('offset', '0%')
            .attr('style', 'stop-color:rgb(255,255,255);stop-opacity:0.7');

        radialGradient
            .append('stop')
            .attr('offset', '100%')
            .attr('style', 'stop-color:rgb(255,255,0);stop-opacity:1');

        var radialGradient = defsSelection
            .append('radialGradient')
            .attr('id', 'radialGradientRed')
            .attr('cx', '30%')
            .attr('cy', '20%')
            .attr('r', '70%');

        radialGradient
            .append('stop')
            .attr('offset', '0%')
            .attr('style', 'stop-color:rgb(255,255,255);stop-opacity:0.7');

        radialGradient
            .append('stop')
            .attr('offset', '100%')
            .attr('style', 'stop-color:rgb(255,0,0);stop-opacity:1');

        var radialGradient = defsSelection
            .append('radialGradient')
            .attr('id', 'radialGradientGreen')
            .attr('cx', '30%')
            .attr('cy', '20%')
            .attr('r', '70%');

        radialGradient
            .append('stop')
            .attr('offset', '0%')
            .attr('style', 'stop-color:rgb(255,255,255);stop-opacity:0.7');

        radialGradient
            .append('stop')
            .attr('offset', '100%')
            .attr('style', 'stop-color:rgb(0,255,0);stop-opacity:1');

        var radialGradient = defsSelection
            .append('radialGradient')
            .attr('id', 'radialGradientDecision')
            .attr('cx', '60%')
            .attr('cy', '80%')
            .attr('r', '70%');

        radialGradient
            .append('stop')
            .attr('offset', '0%')
            .attr('style', 'stop-color:rgb(252, 83, 151);stop-opacity:0.55');

        radialGradient
            .append('stop')
            .attr('offset', '100%')
            .attr('style', 'stop-color:rgb(255,255,255);stop-opacity:0.4');


        var radialGradient = defsSelection
            .append('radialGradient')
            .attr('id', 'radialGradientLifeCycle')
            .attr('cx', '60%')
            .attr('cy', '80%')
            .attr('r', '70%');

        radialGradient
            .append('stop')
            .attr('offset', '0%')
            .attr('style', 'stop-color:rgb(207, 167, 35);stop-opacity:0.55');

        radialGradient
            .append('stop')
            .attr('offset', '100%')
            .attr('style', 'stop-color:rgb(255,255,255);stop-opacity:0.4');
            
        var radialGradient = defsSelection
            .append('radialGradient')
            .attr('id', 'radialGradient1')
            .attr('cx', '60%')
            .attr('cy', '80%')
            .attr('r', '70%');

        radialGradient
            .append('stop')
            .attr('offset', '0%')
            .attr('style', 'stop-color:rgb(200,200,235);stop-opacity:0.3');

        radialGradient
            .append('stop')
            .attr('offset', '100%')
            .attr('style', 'stop-color:rgb(255,255,255);stop-opacity:1');

        var linearGradient = defsSelection
            .append('linearGradient')
            .attr('id', 'grad1')
            .attr('x1', '50%')
            .attr('y1', '0%')
            .attr('x2', '50%')
            .attr('y2', '20%');

        linearGradient
            .append('stop')
            .attr('offset', '0%')
            .attr('style', 'stop-color:rgb(200,200,255);stop-opacity:1');

        linearGradient
            .append('stop')
            .attr('offset', '100%')
            .attr('style', 'stop-color:rgb(255,255,255);stop-opacity:1');

        var filterDropShadow = defsSelection
            .append('filter')
            .attr('id', 'dropShadow');

        filterDropShadow
            .append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 4);
        
        var feComponentTransfer = filterDropShadow
            .append('feComponentTransfer');

        feComponentTransfer
            .append('feFuncA')
            .attr('type', 'linear')
            .attr('slope', 0.45);

        filterDropShadow
            .append('feOffset')
            .attr('dx', 3)
            .attr('dy', 3)

        var feMerge = filterDropShadow
            .append('feMerge');

        feMerge
            .append('feMergeNode');

        feMerge
            .append('feMergeNode')
            .attr('in', 'SourceGraphic')
    }
}

function selectShape(shape) {
    if (!shape._data_stroke) {
        shape._data_stroke = this.attr('stroke');
    }

    this.shape.selected = !this.shape.selected;
    if (this.shape.selected) {
        this.attr('stroke') = 'black';
        this.attr('stroke-dasharray') = [7, 4];
    } else {
        this.attr('stroke') = shape._data_stroke
        this.attr('stroke-dasharray') = null;
    }
}

function Alert(x, y) {
    var shape = new Shape(x, y);
    shape.type = 'alert';
    shape.level = 'HIGH'; // LOW, MEDIUM, HIGH
    return shape;
}

/*
  Renderers
 */
function EventoCicloDeVidaRenderer() {
    this.render = function(editor, shape) {
        var strokeWidth = EVENTO_INICIO_STROKE_WIDTH;
        if (shape.type === 'evento-fim') {
            strokeWidth = EVENTO_FIM_STROKE_WIDTH;
        }

        var gSelection = editor.selection
            .append('g')
            .attr('id', shape.id)
            .attr('transform', 'translate(' + shape.position.x + ', ' + shape.position.y + ')')
            .property('shape', shape)
            .on('click', () => selectShape(this))
            .call(dragSupport());
            
        gSelection
            .append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', EVENTO_INICIO_RAY)
            .attr('stroke', EVENTO_STROKE)
            .attr('stroke-width', strokeWidth)
            .attr('fill', EVENTO_INICIO_FILL);

        gSelection
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', EVENTO_TEXT_OFFSET)
            .attr('text-anchor', 'middle')
            .text(shape.name);

        shape.selection = gSelection;

    }
}

function AlertRenderer() {
    this.render = function(editor, shape) {

        // editor.selection is the insertion point for other shapes
        var gSelection = editor.selection
            .append('g')
            .attr('id', shape.id)
            .attr('transform', 'translate(' + shape.position.x + ', ' + shape.position.y + ')')
            .property('shape', shape)

        var alertSelection = gSelection
            .append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', ALERT_RAY)
            .attr('stroke', ALERT_STROKE)
            .attr('stroke-width', ALERT_STROKE_WIDTH);

        switch (shape.level) {
            case 'LOW' : alertSelection.attr('fill', ALERT_LOW_FILL); break;
            case 'MEDIUM' : alertSelection.attr('fill', ALERT_MEDIUM_FILL); break;
            case 'HIGH' : alertSelection.attr('fill', ALERT_HIGH_FILL); break;
        }
    }
}

function AtividadeRenderer() {
    this.render = function (editor, shape) {

        // editor.selection is the insertion point for other shapes
        var gSelection = editor.selection
            .append('g')
            .attr('id', shape.id)
            .attr('transform', 'translate(' + shape.position.x + ', ' + shape.position.y + ')')
            .property('shape', shape)
            .call(dragSupport());

        gSelection
            .append('rect')
            .attr('width', shape.width)    
            .attr('height', shape.height)    
            .attr('x', 0)    
            .attr('y', 0)
            .attr('rx', ATIVIDADE_RAY)
            .attr('stroke', ATIVIDADE_STROKE)
            .attr('stroke-width', ATIVIDADE_STROKE_WIDTH)
            .attr('fill', ATIVIDADE_FILL)
            .attr('filter', 'url(#dropShadow)');

        gSelection
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dx', shape.width/2)
            .attr('dy', shape.height/2)
            .attr('text-anchor', 'middle')
            .text(shape.name);

        shape.selection = gSelection;
    }

}

function SubProcessRenderer() {
    this.render = function (editor, shape) {

        // editor.selection is the insertion point for other shapes
        var gSelection = editor.selection
            .append('g')
            .attr('id', shape.id)
            .attr('transform', 'translate(' + shape.position.x + ', ' + shape.position.y + ')')
            .property('shape', shape)
            .call(dragSupport());

        gSelection
            .append('rect')
            .attr('width', shape.width)    
            .attr('height', shape.height)    
            .attr('x', 0)    
            .attr('y', 0)
            .attr('rx', ATIVIDADE_RAY)
            .attr('stroke', ATIVIDADE_STROKE)
            .attr('stroke-width', ATIVIDADE_STROKE_WIDTH)
            .attr('fill', ATIVIDADE_FILL)
            .attr('filter', 'url(#dropShadow)');

        const plusBox = 10;
        var plusPath = d3.path();
        plusPath.moveTo(shape.width/2 - plusBox, shape.height);
        plusPath.lineTo(shape.width/2 - plusBox, shape.height - plusBox*2);
        plusPath.lineTo(shape.width/2 + plusBox, shape.height - plusBox*2);
        plusPath.lineTo(shape.width/2 + plusBox, shape.height);

        // paint plus symbol
        gSelection.append('path')
            .attr('stroke', ATIVIDADE_STROKE)
            .attr('fill', 'rgba(255, 255, 255, 0)')
            .attr('stroke-width', 2)
            .attr('d', plusPath.toString());

        // paint + text
        gSelection
            .append('text')
            .style('font-weight', 'bolder')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dx', shape.width/2)
            .attr('dy', shape.height - plusBox/2)
            .attr('text-anchor', 'middle')
            .text('+');

        // shape name
        gSelection
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dx', shape.width/2)
            .attr('dy', shape.height/2)
            .attr('text-anchor', 'middle')
            .text(shape.name);

        shape.selection = gSelection;
    }

}

function RiskRenderer() {
    this.render = function (editor, shape) {

        // editor.selection is the insertion point for other shapes
        var gSelection = editor.selection
            .append('g')
            .attr('id', shape.id)
            .attr('transform', 'translate(' + shape.position.x + ', ' + shape.position.y + ')')
            .property('shape', shape)
            .call(dragSupport());

        const cut = 15;
        var riskPath = d3.path();
        riskPath.moveTo(shape.width - cut, 0);
        riskPath.lineTo(0, 0);
        riskPath.lineTo(0, shape.height);
        riskPath.lineTo(shape.width, shape.height);
        riskPath.lineTo(shape.width, cut);
        riskPath.closePath();

        gSelection
            .append('path')
            .attr('d', riskPath.toString())
            .attr('stroke', RISK_STROKE)
            .attr('stroke-width', RISK_STROKE_WIDTH)
            .attr('stroke-dasharray', RISK_STROKE_DASHARRAY)
            .attr('fill', RISK_FILL)
            .attr('filter', 'url(#dropShadow)');

        gSelection
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dx', shape.width/2)
            .attr('dy', shape.height/2)
            .attr('text-anchor', 'middle')
            .text(shape.name);

        shape.selection = gSelection;
    }

}

function RiskControlRenderer() {
    this.render = function (editor, shape) {

        // editor.selection is the insertion point for other shapes
        var gSelection = editor.selection
            .append('g')
            .attr('id', shape.id)
            .attr('transform', 'translate(' + shape.position.x + ', ' + shape.position.y + ')')
            .property('shape', shape)
            .call(dragSupport());

        const cut = 15;
        var riskControlPath = d3.path();
        riskControlPath.moveTo(shape.width - cut, 0);
        riskControlPath.lineTo(0, 0);
        riskControlPath.lineTo(0, shape.height);
        riskControlPath.lineTo(shape.width, shape.height);
        riskControlPath.lineTo(shape.width, cut);
        riskControlPath.closePath();

        gSelection
            .append('path')
            .attr('d', riskControlPath.toString())
            .attr('stroke', RISK_CONTROL_STROKE)
            .attr('stroke-width', RISK_CONTROL_STROKE_WIDTH)
            .attr('fill', RISK_CONTROL_FILL)
            .attr('filter', 'url(#dropShadow)');

        gSelection
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dx', shape.width/2)
            .attr('dy', shape.height/2)
            .attr('text-anchor', 'middle')
            .text(shape.name);

        shape.selection = gSelection;
    }

}

function DecisaoRenderer() {
    this.render = function (editor, shape) {

        var gSelection = editor.selection
            .append('g')
            .attr('id', shape.id)
            .attr('transform', 'translate(' + shape.position.x + ', ' + shape.position.y + ')')
            .property('shape', shape)
            .call(dragSupport());

        var decisionPath = d3.path();
        decisionPath.moveTo(shape.width/2, 0)
        decisionPath.lineTo(shape.width, shape.height/2)
        decisionPath.lineTo(shape.width/2, shape.height)
        decisionPath.lineTo(0, shape.height/2)
        decisionPath.closePath();

        gSelection
            .append('path')
            .attr('d', decisionPath)
            .attr('x', 0)    
            .attr('y', 0)
            .attr('stroke', DECISAO_STROKE)
            .attr('stroke-width', DECISAO_STROKE_WIDTH)
            .attr('fill', DECISAO_FILL);

        gSelection
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dx', shape.width/2)
            .attr('dy', shape.height + DECISAO_TEXT_OFFSET)
            .attr('text-anchor', 'middle')
            .text(shape.name);

        shape.selection = gSelection;

    }

}

function LineRenderer() {
    this.render = function (editor, shape) {

        // editor.selection is the insertion point for other shapes
        var gSelection = editor.selection
            .append('g')
            .attr('id', shape.id)
            .property('shape', shape);

        var linePath = gSelection
            .append('line')
            .attr('x1', shape.start.x)
            .attr('y1', shape.start.y)
            .attr('x2', shape.end.x)
            .attr('y2', shape.end.y)
            .attr('stroke', shape.flowStyle === 'risk-association' ? RISK_STROKE : LINE_STROKE)
            .attr('stroke-width', LINE_STROKE_WIDTH);

        if (shape.flowStyle === 'risk-association') {
            linePath.attr('stroke-dasharray', [6,3]);
        }

        if (shape.markerStyle) {
            linePath.attr('marker-end', 'url(#' + shape.markerStyle + ')');
        }

        shape.selection = gSelection;

    }
}

function computeConnectionPoints(shape1, shape2) {
    var dx = shape2.position.x - shape1.position.x;
    var dy = shape2.position.y - shape1.position.y;

    if (dx > 0) {      // 2 a direita de 1
        if (Math.abs(dx) > Math.abs(dy)) {  // aponta pelo lado
            x1 = shape1.position.x + shape1.width;
            x2 = shape2.position.x;
            y1 = shape1.position.y + shape1.height/2;
            y2 = shape2.position.y + shape2.height/2;
        } else {                            // aponta por cima
            x1 = shape1.position.x + shape1.width/2;
            x2 = shape2.position.x + shape2.width/2;
            if (dy > 0) {
                y1 = shape1.position.y + shape1.height;
                y2 = shape2.position.y;
            } else {
                y1 = shape1.position.y;
                y2 = shape2.position.y + shape2.height;
            }
        }
    } else {           // 2 a esquerda de 1
        if (Math.abs(dx) > Math.abs(dy)) {  // aponta pelo lado
            x1 = shape1.position.x;
            x2 = shape2.position.x + shape2.width;
            y1 = shape1.position.y + shape1.height/2;
            y2 = shape2.position.y + shape2.height/2;
        } else {                            // aponta por cima
            x1 = shape1.position.x + shape1.width/2;
            x2 = shape2.position.x + shape2.width/2;
            if (dy > 0) {
                y1 = shape1.position.y + shape1.height;
                y2 = shape2.position.y;
            } else {
                y1 = shape1.position.y;
                y2 = shape2.position.y + shape2.height;
            }
        }
    }

    var p1 = new Point(x1, y1);
    var p2 = new Point(x2, y2);

    return [p1, p2];

}

function Flow(shape1, shape2, flowStyle) {
    var points = computeConnectionPoints(shape1, shape2);
    var connector = new Line(points[0], points[1], flowStyle);
    connector.markerStyle = ARROW_STYLE_CLOSED;

    return {
        'start' : shape1,
        'end' : shape2,
        'connector' : connector
    };
}

function RendererFactory () {
    var atividadeRenderer = new AtividadeRenderer();
    var lineRenderer = new LineRenderer();
    var eventoCicloDeVidaRenderer = new EventoCicloDeVidaRenderer();
    var decisaoRenderer = new DecisaoRenderer();
    var alertRenderer = new AlertRenderer();
    var riskRenderer = new RiskRenderer();
    var riskControlRenderer = new RiskControlRenderer();
    var subProcessRenderer = new SubProcessRenderer();

    return {
        getInstance : function(shape) {
            if (shape.type === 'atividade') {
                return atividadeRenderer;
            } else if (shape.type === 'sub-process') {
                return subProcessRenderer;
            } else if (shape.type === 'risk') {
                return riskRenderer;
            } else if (shape.type === 'risk-control') {
                return riskControlRenderer;
            } else if (shape.type === 'evento-inicio') {
                return eventoCicloDeVidaRenderer;
            } else if (shape.type === 'evento-fim') {
                return eventoCicloDeVidaRenderer;
            } else if (shape.type === 'line') {
                return lineRenderer;
            } else if (shape.type === 'decisao') {
                return decisaoRenderer;
            } else if (shape.type === 'alert') {
                return alertRenderer;
            } else {
                throw new Error('Shape type with undefined renderer', shape);
            }
        }
    }
}