function send_Data(url, method, data, callback){
    req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            console.log(this.responseText);
            callback(this.responseText);
        }
        
    }
    req.open(method, url);
    req.send(data);
}