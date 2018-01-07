function loadPage(page){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            document.getElementById("content").innerHTML = xhttp.responseText;
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            alert("Doslo je do greske");
        }
    }
    xhttp.open("GET", "page"+"?pageName="+page, true);
    xhttp.send();
}