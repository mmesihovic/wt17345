function verify(e) {
    var id = e.id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {  
        if (xhttp.readyState == 4 && xhttp.status == 200 ) {
            if (e.value == 'Verify')
                e.value = "Unverify";
            else 
                e.value = "Verify";
        }
    }
    xhttp.open('POST',"http://localhost:3000/verify",true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("id="+id);
}