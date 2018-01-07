function createJSONList() {
    let csvValues = document.getElementById('csvList').value;
    let rowValues = csvValues.split('\n');
    var jsonValue = [];
    for(let i = 0; i< rowValues.length; i++){
        var row = rowValues[i].split(',');
        if(row.length != 6 )
            alert("Nema 6 elemenata");
        var uniqueElements = row.every(function(elem, i, array){return array.lastIndexOf(elem) === i});
        if(!uniqueElements)
            alert("Indeksi u redu nisu jedinstveni");
        jsonValue[i] = row;
    } 
    sendFileRequest(JSON.stringify(jsonValue));
}

function sendFileRequest(value) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            alert("Datoteka je kreirana");
        } else if(xhttp.readyState == 4 && xhttp.status != 200) {
            alert("Doslo je do greske.");
        }
    }

    var spirala = document.getElementById('brSpirale').value;
    xhttp.open("POST", "unosSpiska"+"?spirala="+spirala, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(value);
}