/**************************************************
 ** GAME BALL CLASS
 **************************************************/
var Ball = function(startX, startY) {
  var x = startX, y = startY;

  // Getters and setters
  var getX = function() {
    return x;
  };

  var getY = function() {
    return y;
  };

  var setX = function(newX) {
    x = newX;
  };

  var setY = function(newY) {
    y = newY;
  };

  // Define which variables and methods can be accessed
  return {
    getX: getX,
    getY: getY,
    setX: setX,
    setY: setY
  }
};

// Export the Ballclass so you can use it in
// other files by using require("Ball").Ball
exports.Ball = Ball;
