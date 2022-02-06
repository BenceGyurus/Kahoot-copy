var index = -1;
var json = [];
var data = [];
var questions = [];
join_Code = "";
token = "";
var answers = [];
var intervar = null;
var all_Answers = "";
started = false;
display = false;
pointes = [];
members = [];

function show_Final_Result(){
    document.body.innerHTML += "<div id = 'result'></div>";
    let font_Size = 20;
    let color = "#000000";
    let colors = ["#FFD700", "#C0C0C0", " #CD7F32"];
    let sorted = [];
    let index = window.members.length;
    console.log(index);
    while (index > 0){
        var max = [[0,0,-1]];
        for (i = 0; i < window.members.length; i++){
                if (window.members[i]){
                    let point = 0;
                    if (window.pointes[window.members[i][0]]){
                        point = window.pointes[window.members[i][0]][0];
                    }
                    console.log(point);
                    if (point > max[0][0]){
                        max = [[point, window.members[i][1],i]];
                    }
                    else if (point == max[0][0]){
                        if (max[0][2] == -1){
                            max[0] = [point, window.members[i][1],i];
                        }
                        else{
                        max.push([point,window.members[i][1],i]);
                        }
                    }
            }
        }
        for (let j = 0; j < max.length; j++){
            try{
            delete window.members[max[j][2]];
            }
            catch{}
        }
        sorted.push(max);
        index-= max.length;
        max = []
    }
    document.getElementById("result").innerHTML = "<div id = 'result_Grid'></div>"
    for (let i = 0; i < sorted.length; i++){
        if (i < 3){
            color = colors[i];
            font_Size = 30;
        }
        document.getElementById("result_Grid").innerHTML += "<div id = '"+(i+1)+"place' class = 'place_Div'></div>";
        element_Id = (i+1)+"place";
        document.getElementById(element_Id).style.margin = "10px auto";
        document.getElementById(element_Id).innerHTML += "#"+(i+1);
        for (let j = 0; j < sorted[i].length; j++){
            id = generate_Private_Id(10);
            document.getElementById(element_Id).innerHTML += " "+sorted[i][j][1];
            document.getElementById(element_Id).style.color = color;
            document.getElementById(element_Id).style.fontSize = font_Size+"px";
            if (i < 3){
                document.getElementById(element_Id).style.fontWeight = "bold";
            } 
        }
        color = "#000000";
    }
}

function show_Point(){
    element = document.getElementById("pointes");
    for (let i = 0; i < window.answers.length; i++){
        var this_Point = 0;
        let plus = "";
        if (window.pointes[window.answers[i][2]]){
            this_Point = window.pointes[window.answers[i][2]][0];
            if (window.pointes[window.answers[i][2]][1]){
                plus = "<label class = 'plus_In_This_Round'> +"+window.pointes[window.answers[i][2]][1]+"</label>";
                window.pointes[window.answers[i][2]][1] = 0;
            }
        }
        element.innerHTML += "<label class = 'point_Name'>"+window.answers[i][1]+": "+this_Point+"</label>"+plus+"<br />";
    }
}


function add_Point(list){
    let max_Point = 100; 
    for (let i = 0; i < list.length; i++){
        if (window.pointes[list[i][1]]){
        window.pointes[list[i][1]][0]+= Math.ceil(max_Point/(i+1));
        window.pointes[list[i][1]][1] = Math.ceil(max_Point/(i+1));
        }
        else{
            window.pointes[list[i][1]] = [Math.ceil(max_Point/(i+1)), Math.ceil(max_Point/(i+1))];
        }
    }
    show_Point();
}

function more(answers){
    if (!window.display){
    answers = window.answers;
    colors = ["Kék","Piros" ,"Zöld", "Sárga", "black"];
    try{
        document.getElementById("all_Answers_Grid").remove();
    }
    catch{}
    document.body.innerHTML += "<div id = 'all_Answers_Grid'></div>"
    all_Grid = "all_Answers_Grid";
    for (let i = 0; i < answers.length; i++){
        grid = generate_Div(generate_Private_Id(10), "more_Grid_Class", "", all_Grid);
        answer = answers[i][0] == "none" ? "Nem adott választ" : colors[answers[i][0]];
        this_Id = generate_Private_Id(20);
        document.getElementById(grid).innerHTML += "<h1 id = '"+this_Id+"'>"+answers[i][1]+"</h1><h2> Válasza:"+answer+"</h2>"
    }
    window.display = true;
    }
    else{
        document.getElementById("all_Answers_Grid").remove();
        window.display = false;
    }
}

function progress_Json_File(data){
    data = JSON.parse(data);
    for (let i = 0; i < data.data.length; i++){
        data.data[i] = JSON.parse(data.data[i])
    }
    window.questions = data;
}

function check_New_Site(){
    end = false;
    if (window.index >= window.questions.data.length-1){
        end_Of_The_Quiz();
        end = true;
    }
    return end;
}

function generate_Div(id, div_Class, data, location){
    if (location == "body"){
        document.body.innerHTML = "<div id = '"+id+"' class = '"+div_Class+"'>"+data+"</div>"
    }
    else{
        window.display = false;
        document.getElementById(location).innerHTML += "<div id = '"+id+"' class = '"+div_Class+"'>"+data+"</div>"
    }
    return id;
}

function progress_Answer(json){
    document.getElementById("conteiner").innerHTML = "";
    height = window.innerHeight*0.5;
    colors = ["blue","red" ,"green", "yellow", "black"];
    grid = generate_Div("data_Grid", "", "", "conteiner");
    document.getElementById(grid).style.width = "80%";
    json = JSON.parse(json);
    max_Height = 0;
    most = 0;
    list_Of_Height = []
    right = window.questions.data[index].right;
    list = [];
    for (var i = 0; i < 5; i++){
        sum = 0;
        for (var j = 0; j < json.answers.length; j++){
            if (json.answers[j][0] == i){
                sum++;
                if (i == right){
                    list.push([json.answers[j][1], json.answers[j][2]]);
                }
            }
            else if (i == 4 && json.answers[j][0] == "none"){
                sum++;
            }
        }
        if (sum > most){
            most = sum;
        }
        list_Of_Height.push(sum);
    }
    for (let i = 0; i < list_Of_Height.length; i++){
        sum = list_Of_Height[i];
        let id = generate_Div(generate_Private_Id(10), "data", sum, grid);
        document.getElementById(id).style.background = colors[i];
        let min = 0;
        let max = Math.floor(height*(sum/most));
        if (max > max_Height){
            max_Height = max;
            document.getElementById(grid).style.height = max_Height;
        }
        if (max){
            do_Animation(min, max, id);
        }
        else{
            document.getElementById(id).style.height = 0+"px";
        }
        document.getElementById(id).style.width = "17%";
        if (right == i){
                document.getElementById(id).style.color = "#52ff03";
        }
    }
    window.answers = json.answers;
    //more(json.answers);
    document.body.innerHTML += "<div id = 'pointes'></div>"
    document.body.innerHTML += "<input type = 'button' class = 'btn' value = 'Következő kérdés' onclick = 'start()'/>"
    document.body.innerHTML += "<input type = 'button' class = 'btn' value = 'Áttekintés' onclick = 'more()' />";
    add_Point(list);
    
}
function do_Animation(min, max, id){
    let interval = setInterval(animation, 1);
    function animation(){
        if (max-min>10){
            min += 10;
        }
        else if (max-min > 0){
            min += (max-min);
        }
        else{
            clearInterval(interval);
        }
        document.getElementById(id).style.height = min +"px";
    }
}

function load(index, json){
    console.log(json);
    document.body.innerHTML = ""
    document.body.innerHTML = "<div id = 'conteiner'></div>"
    document.getElementById("conteiner").innerHTML = "";
    colors = ["blue","red" ,"green", "yellow"];
    grid_Id = create_Html_Tag(["div", "", "", "grid_Div"], "conteiner");
    create_Html_Tag(["h2", json.data[index].title, "", "question_Title"], grid_Id);
    color_Index = 0;
    for (let j = 0; j < json.data[index].answers.length; j++){
        if (json.data[index].answers[j]){
        this_Id = create_Html_Tag(["h3", json.data[index].answers[j], "", "answear"], grid_Id);
        document.getElementById(this_Id).style.background = colors[color_Index];
        color_Index++;
    }
    }
}

function end_Of_The_Quiz(){
    json = {code: window.join_Code, token: window.token, start_Token: window.start_Token};
    send_Request("close_Connection", "POST", "", JSON.stringify(json));
}

function next_Question(){
    next = false;
    if (window.index < window.questions.data.length-1){
        document.getElementById("conteiner").innerHTML = "";
    window.index++;
    index = window.index;
    json = window.questions;
    load(index, json);
    next = true;
    }
    return next;
    
}

function last_Question(){
    if (window.index > 0){
        document.body.innerHTML = "";
    window.index--;
    index = window.index;
    json = window.json;
    load(index, json);
    }
}

function generate_Private_Id(length){
    let id = "";
    for (let i = 0; i < length; i++){
        id += Math.floor(Math.random()*10);
    }
    return id
}

function random_Color(){
    colors = []
    for (var i = 0; i < 3; i++){
        colors.push(Math.random()*255);
    }
    color = "rgb("+colors[0]+","+colors[1]+","+colors[2]+")";
    return color;
}

function show_Joined(data){
    json = JSON.parse(data);
    if (!json.message){
        document.getElementById("show_Memebers").innerHTML += "<h2 style = 'color: "+random_Color()+"'class = 'memeber_Names'>"+json.name+"</h2>";
        window.members.push([json.own_Code, json.name]);
    }
    if (!started){
        get_Joined();
    }

}

function get_Joined(){
    this_Json = JSON.stringify({code : window.join_Code, token: window.token, start_Token: window.start_Token});
    send_Request("show_Join", "POST", show_Joined, this_Json);
}

function create_Html_Tag(list, element_Loacation){ //tag, value, type, class
    tag_Id = generate_Private_Id(30);
    if (list[0] == "input"){
        tag = "<"+list[0]+" id = "+tag_Id+" value = '"+list[1]+"'type = '"+list[2]+"'class = "+list[3]+"/>"
    }
    else{
        tag = "<"+list[0]+" id = "+tag_Id+" class = '"+list[3]+"' id = >"+list[1]+"</"+list[0]+">"
    }
    document.getElementById(element_Loacation).innerHTML += tag;
    return tag_Id
}

function write_Connection_Code(json){
    window.join_Code = JSON.parse(json).code;
    window.token = JSON.parse(json).token;
    window.start_Token = JSON.parse(json).start_Token;
    document.getElementById("connection_Code").innerHTML = "Belépési kód: "+JSON.parse(json).code;
    get_Joined();
}

function start(){
    if (next_Question()){
        window.started = true;
    this_Json = JSON.stringify({code : window.join_Code, token: window.token, start_Token: window.start_Token, answers: window.questions.data[index].answers});
    send_Request("start_Quiz", "POST", get_Answers, this_Json);
    }
}

function get_Answers(answers){
    end = check_New_Site();
    progress_Answer(answers);
    if (end){
        show_Final_Result();
    }
}

function send_Request(path, method, callback, message){
    req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (this.status == 200 && this.readyState == 4){
            data = this.responseText;
            try{
            callback(data);
            }catch{
                
            }
        }
    }
    req.open(method, path);
    req.send(message);
    return 0;
}
data = window.location.pathname.split("/")[window.location.pathname.split("/").length-1]
send_Request("get_This_Json", "POST", progress_Json_File, data);
send_Request("get_Connection_Code", "POST", write_Connection_Code, "none");
