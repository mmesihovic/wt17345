const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static(__dirname));

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

app.use(bodyParser.json());
app.post("/unosSpiska", function(req,res) {
    let Spirala = req.query.spirala;
    fs.writeFile("spisakS"+Spirala.toString()+'.json', JSON.stringify(req.body), function (err) {
        if(err)
            throw err;
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.end();
    });
});

app.post('/komentar', function(req,res) {
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
});

app.post('/lista', function (req, res) {
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
});

app.post('/izvjestaj', function (req,res) {
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
});

app.post('/bodovi', function (req,res) {
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
});

app.get('/izvjestajDownload', function (req, res) {
    let fileName = req.query.fileName;
    if( fileName.substr(0, 10) != 'izvjestajS' )
        res.json({message: "Neispravni parametri", data: null});
    res.download(__dirname + "/" + fileName);
});

app.listen(3000);

