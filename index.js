// Username: admin
// PW : admin
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require("express-session");
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'randomSecretHashCode',
    resave: true,
    saveUninitialized: true
 }));

 app.set("view engine", "pug");
 app.set("views", path.join(__dirname, "views"));

const Sequelize = require('sequelize');
const sequelize = require('./scripts/baza.js');
const Op = Sequelize.Op;

const Korisnik = sequelize.import(__dirname + "/scripts/korisnik.js");
const Rola = sequelize.import(__dirname + "/scripts/rola.js");
const LicniPodaci = sequelize.import(__dirname + "/scripts/licniPodaci.js");
sequelize.sync();


var HtmlEncode = require('htmlencode').htmlEncode;

app.get('/page', function(req, res) {
    let body = req.query.pageName;
    fs.readFile('html/'+body+'.html', function (err, html) {
        if(err)
            throw err;
        res.writeHeader(200, { "Content-Type": "text/html"});
        res.write(html);
        res.end();
    });
});

app.get('', function(req, res) {
    fs.readFile('html/index.html', function (err, html) {
        if(err)
            throw err;
        res.writeHeader(200, { "Content-Type": "text/html"});
        res.write(html);
        res.end();
    });
});


app.post("/unosSpiska", function(req,res) {
    if (req.session != null && req.session.korisnik != null && req.session.rola == 'nastavnik') {
        let Spirala = req.query.spirala;
        fs.writeFile("spisakS"+Spirala.toString()+'.json', JSON.stringify(req.body), function (err) {
            if(err)
                throw err;
            res.writeHeader(200, {"Content-Type": "text/html"});
            res.end();
        });
    }
    else {
        res.json(JSON.stringify({'message' : 'Nemate pravo pristupa ovoj opciji', 'data': null}));
    }
});

app.post('/komentar', function(req,res) {
    if (req.session != null && req.session.korisnik != null && req.session.rola == 'student') {
        let body = req.body;
        var bodyKeys = Object.keys(body);
        if( !bodyKeys.includes('spirala') || !bodyKeys.includes('index') || !bodyKeys.includes('sadrzaj'))
            res.json({message: "Podaci nisu u traženom formatu!", data: null});
        var fileName = "markS" + body['spirala'] + body['index'] + '.json';
        var content = body['sadrzaj'];
        var validFormat = true;
        for( let i = 0; i < content.length; i++ ) {
            var jsonKeys = Object.keys(content[i]);
            if( !jsonKeys.includes('sifra_studenta') || !jsonKeys.includes('tekst') || !jsonKeys.includes('ocjena') ) {
                validFormat = false;
                break;
            } 
        }
        if( !validFormat || !(body['index'].length > 0) || !(body['spirala'].length > 0) )
            res.json({message: "Podaci nisu u traženom formatu!", data: null});
        else {
            fs.writeFile(fileName, JSON.stringify(content), function(err) {
                if( err )
                    throw err;
                res.json( {message:"Uspješno kreirana datoteka!", data: content});
            });
        }
    }
    else {
        res.json(JSON.stringify({'message' : 'Nemate pravo pristupa ovoj opciji', 'data': null}));
    }
});

app.post('/lista', function (req, res) {
    if (req.session != null && req.session.korisnik != null && req.session.rola == 'nastavnik') {
        let body = req.body;
        var bodyKeys = Object.keys(body);
        if ( !bodyKeys.includes('godina') || !bodyKeys.includes('nizRepozitorija')) {
            res.json({message: "Podaci nisu u traženom formatu!", data: null});
        }
        var year = body['godina'];
        var repoArray = body['nizRepozitorija'];
        var fileContent = "";
        var fileName = "spisak" + body['godina'] + '.txt';
        var counter = 0;
        for (let i = 0; i < repoArray.length; i++) {
            if (repoArray[i].includes(year)) {
                fileContent += repoArray[i].toString() + "\r\n";
                counter++;
            }
        }    
        fs.writeFile( fileName, fileContent, function(err) {
            if(err)
                throw err;
            res.json({message: "Lista uspješno kreirana!", data: counter});
        });
    }
    else {
        res.json(JSON.stringify({'message' : 'Nemate pravo pristupa ovoj opciji', 'data': null}));
    }
});

app.post('/izvjestaj', function (req,res) {
    if (req.session != null && req.session.korisnik != null && req.session.rola == 'nastavnik') {
        let body = req.body;
        var bodyKeys = Object.keys(body);
        if( !bodyKeys.includes('spirala') || !bodyKeys.includes('index') ) {
            res.json({message: "Podaci nisu u traženom formatu!", data: null});
        }
        var spirala = body['spirala'];
        var index = body['index'];
        var fileName = "izvjestajS" + spirala + index + ".txt";
        var sifre = {};
        var fileContent = [];
        sifre[1]="A";
        sifre[2]="B";
        sifre[3]="C";
        sifre[4]="D";
        sifre[5]="E";
        fs.readdir(__dirname, function(err, files) {
            var existingList = files.includes("spisakS"+spirala + ".json");
            if( !existingList )
                res.json({message: "Datoteka spisakS"+spirala+".json ne postoji!", data: null});
            fs.readFile("spisakS"+spirala+".json", function(err,data){
                var contentArray = JSON.parse(data);
                var reviewers = [];
                var positions = [];
                for(let i = 0; i < contentArray.length; i++) {
                    if( contentArray[i].includes(index.toString()) && contentArray[i].indexOf(index.toString()) != 0) {
                        reviewers.push(contentArray[i][0]);
                        positions.push(contentArray[i].indexOf(index.toString()));
                    }
                }
                for(let i = 0; i < reviewers.length; i++) {
                    var fileExists = files.includes("markS"+spirala+reviewers[i]+".json");
                    if( !fileExists )
                        res.json({message: "Datoteka markS"+spirala+reviewers[i]+".json ne postoji!", data: null});
                    let markData = fs.readFileSync("markS"+spirala+reviewers[i]+".json");
                    let markContent = JSON.parse(markData);
                    var found = false;
                    for(let j=0; j < markContent.length; j++) {
                        var markKeys = Object.keys(markContent[j]);
                        var valid = true;
                        if( !markKeys.includes('sifra_studenta') || !markKeys.includes('tekst') || !markKeys.includes('ocjena') ) {
                            validFormat = false;
                            break;
                        } 
                        if( !valid )
                            res.json({message: "Podaci nisu u traženom formatu!", data: null});
                        if( markContent[j]['sifra_studenta'] === sifre[ positions[i] ] )  {
                            fileContent += markContent[j]['tekst'] + "\r\n##########\r\n";
                            found = true;
                        }                        
                    }
                    if( !found ) 
                        fileContent += "\r\n##########\r\n";                    
                }
                fs.writeFile( fileName, fileContent.toString(), function(err) {
                    if(err)
                        throw err;
                    res.json(fileName);
                });
            });
        });
    }
    else {
        res.json(JSON.stringify({'message' : 'Nemate pravo pristupa ovoj opciji', 'data': null}));
    }    
});

app.post('/bodovi', function (req,res) {
    if (req.session != null && req.session.korisnik != null && req.session.rola == 'nastavnik') {
        let body = req.body;
        var bodyKeys = Object.keys(body);
        if( !bodyKeys.includes('spirala') || !bodyKeys.includes('index') ) {
            res.json({message: "Podaci nisu u traženom formatu!", data: null});
        }
        var spirala = body['spirala'];
        var index = body['index'];
        var sifre = {};
        sifre[1]="A";
        sifre[2]="B";
        sifre[3]="C";
        sifre[4]="D";
        sifre[5]="E";
        fs.readdir(__dirname, function(err, files) {
            var existingList = files.includes("spisakS"+spirala + ".json");
            if( !existingList )
                res.json({message: "Datoteka spisakS"+spirala+".json ne postoji!", data: null});
            fs.readFile("spisakS"+spirala+".json", function(err,data){
                var contentArray = JSON.parse(data);
                var reviewers = [];
                var positions = [];
                for(let i = 0; i < contentArray.length; i++) {
                    if( contentArray[i].includes(index.toString()) && contentArray[i].indexOf(index.toString()) != 0) {
                        reviewers.push(contentArray[i][0]);
                        positions.push(contentArray[i].indexOf(index.toString()));
                    }
                }
                var sum = 0;
                for(let i = 0; i < reviewers.length; i++) {
                    var fileExists = files.includes("markS"+spirala+reviewers[i]+".json");
                    if( !fileExists )
                        res.json({message: "Datoteka markS"+spirala+reviewers[i]+".json ne postoji!", data: null});
                    let markData = fs.readFileSync("markS"+spirala+reviewers[i]+".json");
                    let markContent = JSON.parse(markData);
                    for(let j=0; j < markContent.length; j++) {
                        var markKeys = Object.keys(markContent[j]);
                        var valid = true;
                        if( !markKeys.includes('sifra_studenta') || !markKeys.includes('tekst') || !markKeys.includes('ocjena') ) {
                            validFormat = false;
                            break;
                        } 
                        if( !valid )
                            res.json({message: "Podaci nisu u traženom formatu!", data: null});
                        if( markContent[j]['sifra_studenta'] === sifre[ positions[i] ] )  {
                            sum += markContent[j]['ocjena'];
                        }                        
                    }              
                }
                var avg = Math.floor(sum / reviewers.length) + 1;
                res.json({poruka: "Student " + index + " je ostvario u prosjeku " + avg + " mjesto"});
            });
        });
    }
    else {
        res.json(JSON.stringify({'message' : 'Nemate pravo pristupa ovoj opciji', 'data': null}));
    } 
});

app.get('/izvjestajDownload', function (req, res) {
    if (req.session != null && req.session.korisnik != null && req.session.rola == 'nastavnik') {
        let fileName = req.query.fileName;
        if( fileName.substr(0, 10) != 'izvjestajS' )
            res.json({message: "Neispravni parametri", data: null});
        res.download(__dirname + "/" + fileName);
    }
    else {
        res.json(JSON.stringify({'message' : 'Nemate pravo pristupa ovoj opciji', 'data': null}));
    } 
});

function Hash(password) {
    return new Promise(function (resolve,reject) {
        setTimeout(function() {
            bcrypt.hash(password,10,function(err, hashPass) {
                if(!err)
                    resolve(hashPass);
            });
        }, 2000);
    });
}

function HashCompare( sifra, hashirana) {
    return new Promise(function (resolve,reject) {
        setTimeout(function() {
            bcrypt.compare(sifra, hashirana, function(err,res) {
                if(res) resolve(true);
                else resolve(false);
            });
        }, 2000);
    });
}

function dajKorisnika(ime, sifra, fnCallback) {
    Korisnik.findAll({
        where: { username : ime}
    }).then(function(korisnici) {
        if(korisnici && korisnici.length != 0) {
            korisnici.forEach(korisnik => {
                HashCompare(sifra, korisnik.password).then(function(res) {
                    if(res)
                        return fnCallback(null, korisnik);
                    else return fnCallback(new Error('Neispravna sifra'), null);
                });
            });  
        }
        else return fnCallback(new Error('Ne postoji korisnik sa unesenim imenom'), null);
    });
}

function dajRolu( id, fnCallback) {
    Rola.findOne({
        where : { KorisnikId : id }
    }).then(function(rola) {
        if(rola)
            return fnCallback(null,rola);
        else return fnCallback(new Error('Korisniku nije dodijeljenja rola'), null);
    });
}

app.post('/login', function(req, res) {
    var body = req.body;
    if(body.username == 'admin' && body.password == 'admin') {
        req.session.korisnik= 'admin';
        req.session.rola = 'administrator';
        res.json(JSON.stringify({'success': 'yes', 'rola':'administrator'}));
    }
    else {
        var username = HtmlEncode(body['username']);
        var pw = HtmlEncode(body['password']);
        dajKorisnika(username, pw, function(err, korisnik) {
            if(korisnik) {
                dajRolu(korisnik.id, function(err, rola) {
                    if(err == null) {
                        req.session.korisnik = korisnik.username;
                        req.session.rola = rola.tip;
                        res.json(JSON.stringify({success:'yes', rola: rola.tip}));
                    }
                    else res.json(JSON.stringify({ 'error' : err.toString()}));
                });
            }
            else {
                res.json(JSON.stringify({ 'error' : err.toString()}));
            }
        });
    }
});

app.post('/logout', function(req,res) {
    req.session.korisnik = null;
    req.session.rola = null;
    res.json(JSON.stringify({'success': 'yes', 'rola': 'odjava'}));
});

app.post('/registracija', function(req,res) {
    var body = req.body;
    var pass = body['regPassword-student'] != null ? HtmlEncode(body['regPassword-student']) : HtmlEncode(body['regPassword-profesor']);

    var _username = body['username-profesor'] != null ? HtmlEncode(body['username-profesor']) : HtmlEncode(body['regImePrezime-student']);
    var _imePrezime = body['regImePrezime-profesor'] != null ? HtmlEncode(body['regImePrezime-profesor']) : HtmlEncode(body['regImePrezime-student']);
    var _akgod = body['akgodina-profesor'] != null ? HtmlEncode(body['akgodina-profesor']) : HtmlEncode(body['akgodina-student']);
    var _brindexa = body['index-student'] != null ? HtmlEncode(body['index-student']) : null;
    var _grupa = body['grupa-student'] != null ? HtmlEncode(body['grupa-student']) : null;
    var _bbURL = body['bitbucketURL-student'] != null ? HtmlEncode(body['bitbucketURL-student']) : null;
    var _bbSSH = body['bitbucketSSH-student'] != null ? HtmlEncode(body['bitbucketSSH-student']) : null;
    var _nazivRepo = body['nazivRepozitorija-student'] != null ? HtmlEncode(body['nazivRepozitorija-student']) : null;
    var _mail = body['mail-profesor'] != null ? HtmlEncode(body['mail-profesor']) : null;
    var _maxBrGrupa = body['maxGrupa-profesor'] != null ? HtmlEncode(body['maxGrupa-profesor']) : null;
    var _Regex = body['regex-profesor'] != null ? HtmlEncode(body['regex-profesor']) : null;
    var _semestar = body['semestar-profesor'] != null ? HtmlEncode(body['semestar-profesor']) : null;

    Hash(pass).then(function (hashedPassword) {
        Korisnik.create( {
            username: _username,
            password: hashedPassword
        }).then(function(korisnik) {
            LicniPodaci.create({
                imePrezime: _imePrezime,
                akademskaGodina: _akgod,
                brojIndeksa: _brindexa,
                grupa: _grupa,
                bitbucketURL: _bbURL,
                bitbucketSSH: _bbSSH,
                nazivRepozitorija: _nazivRepo,
                mail: _mail,
                maxBrojGrupa: _maxBrGrupa,
                regexZaValidaciju: _Regex,
                trenutniSemestar: _semestar,
                verified: false,
                KorisnikId: korisnik.id
            }).then(function(smt) {
                Rola.create({
                    tip: body['regImePrezime-profesor'] != null ? 'nastavnik' : 'student',
                    KorisnikId: korisnik.id
                }).then(function(result) {
                    res.json(JSON.stringify({'message' : 'Registracija uspjesno izvrsena', 'error' : null}));
                }).catch(function(err) {
                    res.end(err);
                });
            }).catch(function(err) {
                res.end(err);
            });
        }).catch(function(err) {
            res.end(err);
        });
    });
});

app.post('/listaKorisnika', function(req,res) {
    if(req.session != null && req.session.korisnik != null && req.session.rola == 'administrator') {
        req.session.pretraga = HtmlEncode(req.body.korisnickoIme);
        LicniPodaci.findAll({
            where : { imePrezime : { [Op.like]: '%' + req.session.pretraga + '%'} }
        }).then(function(users) {
            if(users && users.length != 0)
                res.render('listakorisnika', { users: users});
        });
    }
    else res.json(JSON.stringify({'message' : 'Nemate pravo pristupa ovoj opciji', 'data': null}));
});

app.post('/verify', function(req, res) {
    if(req.session != null && req.session.korisnik != null && req.session.rola == 'administrator') {
        var body = req.body;
        LicniPodaci.findOne({
            where: { KorisnikId : body.id}
        }).then(function(korisnik) {
            korisnik.update({ verified: !korisnik.verified });
        }).then(function(done) {
            res.json(JSON.stringify({ 'message' : 'Nastavnik uspjesno verifikovan/odjavljen', 'data': null}));
        });
    }
    else res.json(JSON.stringify({'message' : 'Nemate pravo pristupa ovoj opciji', 'data': null}));
});

app.listen(3000);

