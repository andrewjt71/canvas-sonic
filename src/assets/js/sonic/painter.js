/**
 * A painter service for painting onto a canvas.
 */
let Painter = function (element) {
    this.RING_LINE_WIDTH = 7;
    // Create a context with a canvas.
    this.context = function () {
        let canvas = document.createElement('canvas');
        element.append(canvas);
        canvas.width = element.offsetWidth;
        canvas.height = element.offsetHeight;

        return canvas.getContext('2d');
    }();
};

/**
 * @param {array} rings
 */
Painter.prototype.paintRings = function (rings) {
    for (let i = 0; i < rings.length; i++) {
        let ring = rings[i];
        this._paintRing(ring);
    }
};

/**
 * Paint a ring on the canvas.
 */
Painter.prototype._paintRing = function (ring) {
    this.context.beginPath();
    this.context.lineWidth = this.RING_LINE_WIDTH;
    this.context.strokeStyle = ring.colour;
    this.context.ellipse(
        ring.xPosition,
        ring.yPosition,
        ring.radius * ring.widthPercentage / 100,
        ring.radius,
        2 * Math.PI,
        0,
        2 * Math.PI
    );

    this.context.stroke();
};

/**
 * Clear the canvas.
 */
Painter.prototype.clear = function () {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
};

export default Painter;
