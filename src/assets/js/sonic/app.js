import Painter from "./painter";
import System from "./system";

/**
 * Constructor.
 * 
 * @param {Object} element 
 */
let SonicApp = function (element) {
    this.element = element;
    this.painter = new Painter(element);
    this.system = new System(element.offsetHeight);
};

/**
 * Initialisation method.
 */
SonicApp.prototype.init = function () {
    this._initialiseEventListeners();
    this._initialiseLoop();
};

/**
 * Initialise event listeners.
 */
SonicApp.prototype._initialiseEventListeners = function () {
    // Add event listener for mouse movement
    this.element.onmousemove = function (e) {
        this.system.cursorX = e.pageX;
        this.system.cursorY = e.pageY - this.element.offsetTop;
    }.bind(this);

    this.element.ontouchmove = function (e) {
        this.system.cursorX = e.changedTouches[0].pageX;
        this.system.cursorY = e.changedTouches[0].pageY - this.element.offsetTop;
    }.bind(this);

    // Add event listener for key ups
    document.onkeyup = function (e) {
        this.handleKeyEvent(e.key, false);
    }.bind(this);

    // Add event listener for key downs
    document.onkeydown = function (e) {
        this.handleKeyEvent(e.key, true);
    }.bind(this);

    document.getElementById('sonic-feature').onchange = function (e) {
        let value = e.target.value;
        this.handleKeyEvent(this.system.previousDropdownFunction, false);
        this.handleKeyEvent(value, true);
        this.system.previousDropdownFunction = value;
    }.bind(this);
};

/**
 * Handle key event when a key is pressed / released
 *
 * @param {int}  key
 * @param {boolean} active
 */
SonicApp.prototype.handleKeyEvent = function (key, active) {
    switch (key) {
        case 's':
            this.system.speedEnabled = active;
            break;
        case 'c':
            this.system.colourEnabled = active;
            break;
        case 'g':
            active ? this.system.setZeroGravity() : this.system.setInitialGravity();
            break;
        case 'u':
            active ? this.system.setUpwardsGravity() : this.system.setInitialGravity();
            break;
        case 'm':
            active ? this.system.setHighCreationRate() : this.system.setDefaultCreationRate();
            break;
        case 'l':
            active ? this.system.setLowCreationRate() : this.system.setDefaultCreationRate();
            break;
        case 'i':
            this.system.implodeEnabled = active;
            break;
        case 't':
            this.system.tinyEnabled = active;
            break;
        case 'f':
            this.system.floorEnabled = active;
            break;
        case 'e':
            this.system.explodeEnabled = active;
            break;
        case 'v':
            this.system.dropEnabled = active;
            break;
    }
};

/**
 * Initialise loop.
 */
SonicApp.prototype._initialiseLoop = function () {
    setInterval(this._loop.bind(this), 1000 / 800);
};

/**
 * Loop function.
 */
SonicApp.prototype._loop = function () {
    this.painter.clear();
    this.system.updateRings();
    this.painter.paintRings(this.system.rings);
};

export default SonicApp;
