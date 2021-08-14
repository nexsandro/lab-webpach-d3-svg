"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var d3 = require("d3");
var uuid_1 = require("uuid");
var Point = /** @class */ (function () {
    function Point() {
    }
    return Point;
}());
var Shape = /** @class */ (function () {
    function Shape(width, height) {
        this.width = width;
        this.height = height;
        this.position = new Point();
        this.id = uuid_1.v4();
    }
    Shape.prototype.resize = function (width, height) {
        this.width = width;
        this.height = height;
    };
    Shape.prototype.move = function (point) {
        this.position.x = point.x;
        this.position.y = point.y;
    };
    Shape.prototype.translate = function (dx, dy) {
        this.position.x += dx;
        this.position.y += dy;
    };
    return Shape;
}());
var Process = /** @class */ (function (_super) {
    __extends(Process, _super);
    function Process(name) {
        var _this = _super.call(this, 200, 100) || this;
        _this.name = name;
        return _this;
    }
    return Process;
}(Shape));
var Activity = /** @class */ (function (_super) {
    __extends(Activity, _super);
    function Activity(name) {
        var _this = _super.call(this, 200, 100) || this;
        _this.name = name;
        return _this;
    }
    return Activity;
}(Shape));
(function main() {
    var svg = d3.select('body')
        .append('svg')
        .attr('id', 'svg1')
        .attr('width', 1800)
        .attr('height', 800);
    var widgetWidth = 150;
    var widgetHeight = 100;
    var widgetPadding = 5;
    /*
     Generate random data in widgets variable.
    */
    var widgets = d3
        .range(20)
        .map(function (i) {
        var p = new Process('Process #' + i);
        p.width = widgetWidth;
        p.height = widgetHeight;
        p.position.x = (i % 10) * (widgetWidth + widgetPadding);
        p.position.y = Math.trunc(i / 10) * (widgetHeight + widgetPadding);
        return p;
    });
    /*
    Render all Shapes in widgets var.
    */
    svg
        .selectAll('g')
        .data(widgets)
        .enter()
        .append('g')
        .attr('id', function (d) { return d.id; })
        .attr('transform', function (d) {
        return 'translate(' + d.position.x + ', ' + d.position.y + ')';
    })
        .append('rect')
        .attr('width', function (d) { return d.width; })
        .attr('height', function (d) { return d.height; })
        .attr('stroke', 'blue');
})();
