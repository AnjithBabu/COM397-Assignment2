var objects;
(function (objects) {
    var Button = (function () {
        function Button(path, x, y) {
            this.setX(x);
            this.setY(y);

            this._buttonImage = new createjs.Bitmap(path);
            this._buttonImage.x = this._x;
            this._buttonImage.y = this._y;
            this._buttonImage.addEventListener("mouseover", this._buttonOver);
            this._buttonImage.addEventListener("mouseout", this._buttonOut);
        }
        // PUBLIC PROPERTIES
        Button.prototype.getImage = function () {
            return this._buttonImage;
        };

        Button.prototype.getX = function () {
            return this._x;
        };

        Button.prototype.getY = function () {
            return this._y;
        };

        Button.prototype.setX = function (x) {
            this._x = x;
        };

        Button.prototype.setY = function (y) {
            this._y = y;
        };

        // EVENT HANDLERS
        Button.prototype._buttonOut = function (event) {
            event.currentTarget.alpha = 1.0;
        };

        Button.prototype._buttonOver = function (event) {
            event.currentTarget.alpha = 0.5;
        };
        return Button;
    })();
    objects.Button = Button;
})(objects || (objects = {}));
//# sourceMappingURL=Button.js.map
