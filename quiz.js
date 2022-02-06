var all_Data = [];
var quiz_Datas;
rightes = [];
var a = [];
function query_Load_Site(path){
    req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (this.status == 200 && this.readyState == 4){
            data = this.responseText;
            document.body.innerHTML = data;
        }
    }
    req.open('GET', path);
    req.send();
}

function open_In_New_Tab(name){
    url = window.location.origin
    url += "/"+name;
    console.log(url)
    window.open(url, '_blank');
    return 0;
}

function send_Data(path, method, callback, data){
    req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (this.status == 200 && this.readyState == 4){
            data = this.responseText;
            window.quiz_Datas = data;
        }
    }
    req.open(method, path);
    req.send(data);
    return 0;
}
function main(){
    generate_Question();
    return 0;
}

function after_Append(){
    window.a = [];
    for (let i = 0; i < window.all_Data.length; i++){
        if (window.all_Data[i]){
            window.a.push([]);
            var right;
            for (let j = 0; j < document.getElementsByName(window.rightes[i][2]).length; j++){
                console.log(window.rightes[i][2]);
                console.log(document.getElementsByName(window.rightes[i][2])[j].checked);
                if (document.getElementsByName(window.rightes[i][2])[j].checked){
                    exist = true;
                    right = [Number(document.getElementsByName(window.rightes[i][2])[j].value), window.rightes[i][2],j];
                }
            }
            window.a[window.a.length-1].push([document.getElementById(window.all_Data[i][0]).value, window.all_Data[i][0]], [], right);
            for (let k = 0; k < window.all_Data[i][1].length; k++){
                question = document.getElementById(window.all_Data[i][1][k]).value;
                window.a[window.a.length-1][1].push([question, window.all_Data[i][1][k]]);
            }

        }
    }
    console.log(window.a);
}

function write_To_This(){
    for (let i = 0; i < window.a.length; i++){
        if (window.a[i]){
        document.getElementById(window.a[i][0][1]).value = window.a[i][0][0];
        for (let j = 0; j < window.a[i][1].length; j++){
            document.getElementById(window.a[i][1][j][1]).value = window.a[i][1][j][0];
        }
        if (window.a[i][2]){
            document.getElementsByName(window.a[i][2][1])[window.a[i][2][2]].checked = true;
        }
        }
    }
}

function save_All(){
    document.getElementById("error").innerHTML = "";
    errors = []
    let json_File = [];
    number_Of_Questions = 0;
    for (let i = 0; i < window.all_Data.length; i++){
        if (window.all_Data[i]){
            number_Of_Questions++;
            list = [];
            exist = false;
            let right;
            for (let j = 0; j < document.getElementsByName(window.rightes[i][2]).length; j++){
                console.log(window.rightes[i][2]);
                console.log(document.getElementsByName(window.rightes[i][2])[j].checked);
                if (document.getElementsByName(window.rightes[i][2])[j].checked){
                    exist = true;
                    right = Number(document.getElementsByName(window.rightes[i][2])[j].value);
                }
                
            }
            if (!exist){
                errors.push("Kérlek jelöld be a helyes választ!");
            }
            control_A = true;
            for (let k = 0; k < window.all_Data[i][1].length; k++){
                a = document.getElementById(window.all_Data[i][1][k]).value
                error = false;
                if (a.length > 50){
                    errors.push("A válasz maximális hossza 50 karakter!");
                    error = true;
                }
                if (!error){
                    list.push(a);
                }
                else{
                    break;
                }
            }
            json_File.push(JSON.stringify({
                title : document.getElementById(window.all_Data[i][0]).value,
                answers: list,
                right: right
            }));
        }
    }
    if (!number_Of_Questions){
        errors.push("A mentéshez minimum egy kérdést létre kell hozni!");
    }
    if (errors.length < 1){
    token =  generate_Private_Id(100);
    data = JSON.stringify({data : json_File, token:token});
    send_Data("save", "POST", "", data);
    open_In_New_Tab(token);
    delete token;
    }
    else{
        document.getElementById("error").innerHTML = errors[0];
    }
}

function generate_Private_Id(length){
    id = "";
    for (let i = 0; i < length; i++){
        id += Math.floor(Math.random()*10);
    }
    return id
}

function add_Buttons(div_Id){
    buttons = "<input type = 'button' class = 'question_Control_Buttons' value = 'Törlés' onclick = 'delete_This(\""+div_Id+"\")'>";
    document.getElementById(div_Id).innerHTML += buttons;
}

function generate_Question(){
    after_Append();
    window.all_Data.push([]);
    grid_Div = generate_Tag(["div", "", "", "", "gird_Div"], "conteiner");
    window.all_Data[window.all_Data.length-1].push(generate_Tag(["input", "", "", "Kérdés", "question_Title"], grid_Div));
    window.all_Data[window.all_Data.length-1].push([]);
    right_Id = generate_Private_Id(10);
    right_Name = generate_Private_Id(11);
    for (var i = 0; i < 4; i++){
        this_Grid = generate_Tag(["div", "", "", "", "answers_Grid"], grid_Div);
        console.log(this_Grid);
        window.all_Data[window.all_Data.length-1][1].push(generate_Tag(["input", "", "", "Válasz "+(i+1), "answear"], this_Grid));
        document.getElementById(this_Grid).innerHTML += "<input type = 'radio' name = '"+right_Name+"' id = '"+right_Id+"' value = '"+i+"'>";
    }
    rightes.push([right_Id, grid_Div, right_Name]);
    window.all_Data[window.all_Data.length-1][2] = grid_Div;
    add_Buttons(grid_Div);
    write_To_This();
}

function delete_This(div_Id){
    for (var i = 0; i < window.all_Data.length; i++){
        if (window.all_Data[i] && window.all_Data[i][2] == div_Id){
            delete window.all_Data[i];
        }
    }
    for (let i = 0; i < window.rightes.length; i++){
        if (window.rightes[i] && window.rightes[i][1] == div_Id){
            delete window.rightes[i];
        }
    }
    document.getElementById(div_Id).remove();
}

function generate_Tag(list, element_Id){ //[tag, text,name, value, class]
    tag_Id = generate_Private_Id(30);
    if (list[0] == "input"){
        tag = "<"+list[0]+" value = '"+list[3]+"' id = "+tag_Id+" class = "+list[4]+" placeholder = "+list[3]+" name = '"+list[1]+"'>"
    }
    else{
        tag = "<"+list[0]+" id = "+tag_Id+" class = "+list[4]+">"+list[1]+"</"+list[0]+">"
    }
    document.getElementById(element_Id).innerHTML += tag;
    return tag_Id;
}

main();