import Ring from "./ring.js";

/**
 * The system state.
 * 
 * @param {int} distanceToFloor
 */
let System = function (distanceToFloor) {
    // Constants.
    this.INITIAL_GRAVITY = 0.04;
    this.HIGH_CREATION_RATE = 0;
    this.LOW_CREATION_RATE = 10;
    this.DEFAULT_CREATION_RATE = 3;
    this.IMPLODE_ENABLED_RATE = 0.01;
    this.MAX_RING_SIZE = 3000;
    this.BOUNCE_COEFFICIENT = -0.8;
    this.DEFAULT_RING_COLOUR = 'black';
    this.DEFAULT_RING_RADIUS_COEFFICIENT = 50;
    this.TINY_RING_RADIUS_COEFFICIENT = 5;
    this.RING_VELOCITY_COEFFICIENT_HIGH = 15;
    this.RING_VELOCITY_COEFFICIENT_LOW = 6;
    this.MAX_RINGS = 500;

    this.rings = [];
    this.gravity = 0.04;
    this.cursorX = null;
    this.cursorY = null;
    this.cursorEnabled = false;
    this.colourEnabled = false;
    this.speedEnabled = false;
    this.reverseGravityEnabled = false;
    this.moreEnabled = false;
    this.lessEnabled = false;
    this.implodeEnabled = false;
    this.tinyEnabled = false;
    this.floorEnabled = false;
    this.explodeEnabled = false;
    this.dropEnabled = false;
    this.loopsBeforeCreation = this.DEFAULT_CREATION_RATE;
    this.loopsSinceCreation = 0;
    this.distanceToFloor = distanceToFloor;
    this.previousDropdownFunction = null;
};

/**
 * Whether creation of new rings is currently enabled.
 */
System.prototype._isCreationEnabled = function () {
    return this.loopsSinceCreation >= this.loopsBeforeCreation &&
        !this.implodeEnabled &&
        !this.explodeEnabled &&
        !this.dropEnabled;
};

/**
 * Set gravity to its initial value.
 */
System.prototype.setInitialGravity = function () {
    this.gravity = this.INITIAL_GRAVITY;
};

/**
 * Set gravity to pull upwards.
 */
System.prototype.setUpwardsGravity = function () {
    this.gravity = -this.INITIAL_GRAVITY;
};

/**
 * Set gravity to zero.
 */
System.prototype.setZeroGravity = function () {
    this.gravity = 0;
};

/**
 * Set creation rate of rings to high.
 */
System.prototype.setHighCreationRate = function () {
    this.loopsBeforeCreation = this.HIGH_CREATION_RATE;
};

/**
 * Set creation rate of rings to low.
 */
System.prototype.setLowCreationRate = function () {
    this.loopsBeforeCreation = this.LOW_CREATION_RATE;
};

/**
 * Set creation rate of rings to its default value.
 */
System.prototype.setDefaultCreationRate = function () {
    this.loopsBeforeCreation = this.DEFAULT_CREATION_RATE;
};

System.prototype.updateRings = function () {
    if (this._isCreationEnabled()) {
        this._create();
        this.loopsSinceCreation = 0;
    } else {
        this.loopsSinceCreation++;
    }

    for (let i = 0; i < this.rings.length; i++) {
        let ring = this.rings[i];
        this._updateRing(ring);
    }

    this._garbageCollect();
};

/**
 * Remove references to old rings.
 */
System.prototype._garbageCollect = function () {
    this.rings = this.rings.slice(-this.MAX_RINGS);
};

/**
 * @param {Object} ring
 */
System.prototype._updateRing = function (ring) {
    if (this.implodeEnabled) {
        // If the implode feature is enabled increase the ring's radius in each frame
        ring.radius = ring.radius * (1 - this.IMPLODE_ENABLED_RATE);
    } else if (this.explodeEnabled) {
        if (ring.radius < this.MAX_RING_SIZE) {
            // If the explode feature is enabled and the ring is not over the maximum size,
            // increase the ring's radius in each frame
            ring.radius = ring.radius * (1 + this.IMPLODE_ENABLED_RATE);
        }
    } else {
        // Only update ring positions if neither implode or explode features are enabled
        ring.yPosition += ring.velocityY;
        ring.xPosition += ring.velocityX;
        ring.velocityY += this.gravity;
    }

    // If vertical drop feature is enabled, clear horizontal velocity
    if (this.dropEnabled) {
        ring.velocityX = 0;
    }

    if (
        this.floorEnabled &&
        ring.yPosition + ring.radius + 10 > this.distanceToFloor &&
        ring.velocityY > 0 &&
        ring.yPosition + ring.radius < this.distanceToFloor
    ) {
        // If floor feature is enabled and ring is at the bottom of the canvas, apply bounce
        ring.velocityY = ring.velocityY * this.BOUNCE_COEFFICIENT;
    }

    // Update ring state to show which part of the spin process it is
    if (ring.widthPercentage === 0) {
        ring.decreasing = false;
    } else if (ring.widthPercentage === 100) {
        ring.decreasing = true;
    }

    // Increase or decrease ring radius for its current state for spinning effect
    if (ring.decreasing) {
        ring.widthPercentage -= 2;
    } else {
        ring.widthPercentage += 2;
    }
};

/**
 * Create a ring.
 */
System.prototype._create = function () {
    let colour,
        radius,
        velocityX,
        velocityY;

    // Generate random colour if colour feature enabled
    if (this.colourEnabled) {
        colour = this._getRandomColour();
    } else {
        colour = this.DEFAULT_RING_COLOUR;
    }

    // Decrease radius range if tiny ring feature enabled
    if (this.tinyEnabled) {
        radius = Math.random() * this.TINY_RING_RADIUS_COEFFICIENT;
    } else {
        radius = Math.random() * this.DEFAULT_RING_RADIUS_COEFFICIENT;
    }

    // Increase ring speed if speed feature enabled
    if (this.speedEnabled) {
        velocityX = (Math.random() * this.RING_VELOCITY_COEFFICIENT_HIGH - this.RING_VELOCITY_COEFFICIENT_HIGH / 2);
        velocityY = (Math.random() * this.RING_VELOCITY_COEFFICIENT_HIGH - this.RING_VELOCITY_COEFFICIENT_HIGH / 2);
    } else {
        velocityX = (Math.random() * this.RING_VELOCITY_COEFFICIENT_LOW - this.RING_VELOCITY_COEFFICIENT_LOW / 2);
        velocityY = (Math.random() * this.RING_VELOCITY_COEFFICIENT_LOW - this.RING_VELOCITY_COEFFICIENT_LOW / 2);
    }

    let newRing = new Ring(this.cursorX, this.cursorY, true, 100, true, colour, radius, velocityX, velocityY);

    // Push new ring to system state
    this.rings.push(newRing);

    // Reset loops since creation
    this.loopsSinceCreation = 0;
};

/**
 * Generate a random hex colour
 */
System.prototype._getRandomColour = function () {
    let letters = '0123456789ABCDEF',
        color = '#';

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
};

export default System;
