/**
 * @param {int} xPosition
 * @param {int} yPosition
 * @param {boolean} decreasing 
 * @param {float} widthPercentage
 * @param {boolean} left 
 * @param {string} colour 
 * @param {int} radius 
 * @param {int} velocityX 
 * @param {int} velocityY 
 */
let Ring = function (xPosition, yPosition, decreasing, widthPercentage, left, colour, radius, velocityX, velocityY) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.widthPercentage = widthPercentage;
    this.left = left;
    this.colour = colour;
    this.radius = radius;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
}

export default Ring;
