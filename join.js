var token = "";
var code = "";
var own_Code = "";
var name = "";
var own_Token = "";
var animation;
var auto_Send = true;
var time = 1500;
var from_Time = 1500;
var timer;
var answers = [];

function join_This_Code(){
    code = document.getElementById("join_Input").value;
    json = JSON.stringify({code : code});
    window.code = code;
    send_Data("join_With_This_Code", "POST", json, write_To_Result_To_Join);
}

function write_To_Result_To_Join(json){
    json = JSON.parse(json)
    if (json.error){
        document.getElementById("result").style.color = "red";
        document.getElementById("result").innerHTML = json.message;

    }
    else{
        window.token = json.token;
        add_Name();
    }
}

function element_To_Body(data){
    document.body.innerHTML = data;
    console.log(window.answers.length)
    answers_Index = 0;
    for (let i = 0; i < window.answers.length; i++){
        if (window.answers[i]){
        id = "answer"+answers_Index;
        console.log(window.answers[i])
        document.getElementById(id).innerHTML = window.answers[i];
        answers_Index++;
        }
        else{
            id = "answer"+i
            document.getElementById(id).style.display = "none";
        }
    }
}

function show_Answers(data){
    window.auto_Send = true;
    window.time = 1500;
    clearInterval(window.animation);
    json = JSON.parse(data);
    console.log(json);
    if (!json.message){
    window.own_Code = json.code;
    window.answers = json.answers;
    send_Data("answering_Screen.html", "GET", "", element_To_Body);
    setTimeout(function(){ send_Answer("none") },15000);
    max_Width = window.innerWidth;
    timer = setInterval(function () {window.time--;document.getElementById("timer").style.width = max_Width*(window.time/window.from_Time)+"px"}, 10);
    }
    else{
        window.location.reload(true);
    }
}

function show_Queue_Screen(){
    if (window.innerWidth > window.innerHeight){
        height = Math.floor(window.innerHeight*0.5);
    }
    else{
        height = Math.floor(window.innerWidth*0.5);
    }
    if (!height){
    height = 1500*0.5;
    }
    document.body.innerHTML = "<div id = 'animation_Grid'></div>";
    document.getElementById("animation_Grid").innerHTML = "<div id = 'load_Animation'></div>";
    document.getElementById("load_Animation").style = "width: "+height+"px;" + "height: "+height+"px; background: black;";
    border = 0;
    increment = true;
    clearInterval(window.animation)
    color = [0,0,0];
    index = 0;
    re = true;
    window.animation = setInterval(function(){
        if (index == 2 && color[index] == 255){
            re = false;
        }
        if (index == 0 && color[index] == 0){
            re = true;
        }
        if (color[index] == 255 && re){
            index++;
        }
        if (color[index] == 0 && !re){
            index--;
        }
        if (!re){
            color[index]--;
        }
        else{
            color[index]++;
        }
        if (border < 60 && increment){
            border++;
        }
        else if(border == 60){
            increment = false;
        }
        if (border > 0 && !increment){
            border--;
        }
        else if (border == 0){
            increment = true;
        }
        document.getElementById("load_Animation").style.borderRadius = border+"%";
        this_Color = "rgb("+color[0]+", "+color[1]+", "+color[2]+")";
        document.getElementById("load_Animation").style.backgroundColor = this_Color;
    }, 20);
}

function add_Name(){
    document.getElementById("container").innerHTML = '<h1>Add meg a neved</h1>' 
    document.getElementById("container").innerHTML += "<input type = 'text' id = 'user_Name' class = 'joins'>"
    document.getElementById("container").innerHTML += "<input type = 'button' value = 'Belépés' onclick = 'start_To_Waiting_In_Queue()' class = 'joins'>"
}

function send_Answer(index){
    clearInterval(window.timer);
    if (window.auto_Send){
        window.auto_Send = false;
        json = JSON.stringify({answer: index, token: window.token, code: window.code, own_Code: window.own_Code, name: window.name});
        console.log(json);
        show_Queue_Screen();
        send_Data("onw_Answer", "POST", json, start_To_Waiting_In_Queue);
    }
}

function start_To_Waiting_In_Queue(){
    if (!window.name){
    window.name = document.getElementById('user_Name').value;
    }
    json = JSON.stringify({token: window.token, code: window.code, name:window.name, own_Code: window.own_Code});
    console.log(json);
    show_Queue_Screen();
    send_Data("add_To_Queue", "POST", json, show_Answers);
}