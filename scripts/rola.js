const Sequelize = require("sequelize");
const sequelize = require("./baza.js");
const Korisnik = sequelize.import(__dirname + "/korisnik.js");

const Rola = sequelize.define('Rola', {
    tip: Sequelize.STRING
})

Rola.belongsTo(Korisnik);
module.exports = function(sequelize, DataTypes) {
    return Rola;
}
