function send_Request(path, method, callback){
    req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (this.status == 200 && this.readyState == 4){
            data = this.responseText;
            callback(data);
            console.log(data);
        }
    }
    req.open(method, path);
    req.send();
    return 0;
}

function element_To_Conteiner(text){    
    document.getElementById("container").innerHTML = text;
}

function get_This(name){
    send_Request(name+".html", "GET", element_To_Conteiner);
}

get_This("main");