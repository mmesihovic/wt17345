const Sequelize = require("sequelize");
const sequelize = require("./baza.js");

const Korisnik = sequelize.define('Korisnik', {
    username: Sequelize.STRING,
    password: Sequelize.STRING
})
module.exports = function(sequelize, DataTypes) {
    return Korisnik;
}
