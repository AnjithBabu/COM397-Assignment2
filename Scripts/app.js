var Person = (function () {
    function Person() {
    }
    Person.prototype.eats = function () {
        console.log("he's eating");
    };
    return Person;
})();

var tom = new Person();
tom.eats();
//# sourceMappingURL=app.js.map
