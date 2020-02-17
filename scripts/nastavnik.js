function generisiIzvjestaj() {
    var index = document.getElementById("index").value;
    var spirala = document.getElementById("brSpirale").value;
    var callback = function(error, data) {
        data = data.substr(1, data.length-2);            
        if(error != null) {
            document.getElementById("nastavnikContent").innerHTML = "Doslo je do greske. Greska: " + data;
        } else {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200){
                    document.getElementById("nastavnikContent").innerHTML = "<a href=\" http://localhost:3000/izvjestajDownload?fileName=" + data + "\"> Skini izvjestaj </a>" ;
                }                    
                if(xhttp.readyState == 4 && xhttp.status != 200){
                    document.getElementById("nastavnikContent").innerHTML = "Doslo je do greske. Greska: " + xhttp.responseText;
                } 
            }
            xhttp.open("GET", "http://localhost:3000/izvjestajDownload?fileName="+data, true);
            xhttp.send();
        }
    }
    KreirajFajl.kreirajIzvjestaj(spirala,index, callback);
}

function generisiBodove() {
    var index = document.getElementById("index").value;
    var spirala = document.getElementById("brSpirale").value;
    var callback = function(error, data) {
        if(error != null) {
            document.getElementById("nastavnikContent").innerHTML = "Doslo je do greske. Greska: " + data;
        } else {
            document.getElementById("nastavnikContent").innerHTML = JSON.parse(data)['poruka'];
        }
    }
    KreirajFajl.kreirajBodove(spirala,index, callback);
}