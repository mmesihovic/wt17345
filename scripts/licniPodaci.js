const Sequelize = require("sequelize");
const sequelize = require("./baza.js");
const Korisnik = sequelize.import(__dirname + "/korisnik.js");

const licniPodaci = sequelize.define('licniPodaci', {
    imePrezime: Sequelize.STRING,
    akademskaGodina: Sequelize.STRING,
    brojIndeksa: Sequelize.INTEGER,
    grupa: Sequelize.INTEGER,
    bitbucketURL: Sequelize.STRING,
    bitbucketSSH: Sequelize.STRING,
    nazivRepozitorija: Sequelize.STRING,
    mail:Sequelize.STRING,
    maxBrojGrupa: Sequelize.INTEGER,
    regexZaValidaciju: Sequelize.STRING,
    trenutniSemestar: Sequelize.INTEGER,
    verified: Sequelize.BOOLEAN
})

licniPodaci.belongsTo(Korisnik);
module.exports = function(sequelize, DataTypes) {
    return licniPodaci;
}
