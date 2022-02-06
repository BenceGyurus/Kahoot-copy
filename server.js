var http = require('http');
var os = require('os');
var IP_ADRESS = "0.0.0.0";
let fs = require('fs');
const PORT = 8000
var connected_List = [];
answers = [];
host = [];
number_Of_Connected = [];
var send_Join = []
var started = [];

function open_File(path) {
  path = __dirname + "/" + path;
  try {
    data = fs.readFileSync(path);
  }
  catch (err) {
    data = false;
  }
  return data
}

function send_Get_Method(req, res, data, header, status) {
  if (!status) {
    status = 200;
  }
  if (header) {
    res.writeHeader(status, header);
  }
  res.write(data);
  res.end();
}

function path_Selector(path) {
  let splited_Path;
  let extesion;
  if (path != "/") {
    path = path.split("?")[0];
    splited_Path = path.split("/")[path.split("/").length - 1];
  }
  else {
    splited_Path = "index.html";
  }
  extesion = splited_Path.split(".")[splited_Path.split(".").length - 1];
  return [splited_Path, extesion];
}

function generate_Header(extesion) {
  var header;
  if (extesion == "html" || extesion == "css") {
    header = { "Content-Type": "text/" + extesion };
  }
  else if (extesion == "js") {
    header = { "Content-Type": "text/javascript" };
  }
  else if (extesion == "json") {
    header = { "Content-Type": "application/" + extesion };
  }
  else if (extesion == "png" || extesion == "jpg" || extesion == "jpeg") {
    header = { "Content-Type": "image/" + extesion };
  }
  return header;
}


function send_All_Answers(json, host, answers) {
  req = "";
  setTimeout(function () {
    send_Data = JSON.stringify({ answers: answers[json.code] });
    header = generate_Header("json");
    send_Get_Method(req, host[json.code], send_Data, header, 200);
    delete answers[json.code];
  }, 16000);
}

function save_File(file_Data, file_Name) {
  fs.writeFile(file_Name, file_Data, "utf-8", function () { });
}

function random_Name_Generate(length) {
  id = "";
  for (let i = 0; i < length; i++) {
    id += Math.floor(Math.random() * 10);
  }
  return id;
}

function log(url, ip) {
  time = new Date();
  string = "[" + time + "] request:" + url + ", IP: " + ip + "\n";
  fs.appendFileSync('log.txt', string);
}

http.createServer(function (req, res) {
  url = req.url
  method = req.method;
  log(url, res.socket.remoteAddress);
  status = 200;
  if (method == "GET") {
    let array = path_Selector(url); let path = array[0]; let extesion = array[1];
    if (path != "server.js" && extesion != "json") {
      let data;
      let header;
      if (path == extesion) {
        path = "show_Quiz.html";
        extesion = "html";
      }
      header = generate_Header(extesion);
      data = open_File(path);
      if (!data) {
        data = open_File("error.html");
        status = 404;
      }
      send_Get_Method(req, res, data, header, status);
    }
    else {
      data = open_File("error.html");
      status = 404;
      header = generate_Header("html");
      send_Get_Method(req, res, data, header, status);
    }

  }
  else if (method == "POST") {
    body = "";
    req.on('data', function (data) {
      body += data;
      if (url == "/save") {
        file_Name = "quizes/" + JSON.parse(body).token + '.json';
        save_File(body, file_Name);
        let header = generate_Header("html");
        //let data = open_File(file_Name);
        send_Get_Method(req, res, body, header, status);
      }
      else if (url == "/get_This_Json") {
        file_Name = "quizes/" + body + ".json";
        let header = generate_Header("json");
        data = open_File(file_Name);
        //let data = open_File(file_Name);
        if (!data) {
          if (!data) {
            data = open_File("error.html");
            status = 404;
          }
        }
        send_Get_Method(req, res, data, header, status);
      }
      else if (url == "/get_Connection_Code") {
        let code = random_Name_Generate(10);
        token = random_Name_Generate(100);
        start_Token = random_Name_Generate(80);
        connected_List[code] = [req, token, start_Token];
        json = JSON.stringify({ code: code, token: token, start_Token: start_Token });
        header = generate_Header("json");
        send_Get_Method(req, res, json, header, status);
      }
      else if (url == "/join_With_This_Code") {
        code = JSON.parse(body).code;
        send_Json = { message: "", error: "", token: "", code: "", own_Token: "" };
        if (connected_List[code]) {
          if (!started[code]) {
            //connected_List[code].push(req);
            send_Json.message = "Sikeres csatlakotás";
            send_Json.error = false
            send_Json.token = connected_List[code][1];
            send_Json.own_Token = random_Name_Generate(30)
            send_Json.code = code;
          }
          else {
            send_Json.error = true;
            send_Json.message = "Már nem lehet csatlakozni";
          }
        }
        else {
          send_Json.error = true;
          send_Json.message = "Sikertelen csatlakozás, ilyen kód nem létezik";
        }
        header = generate_Header("json")
        send_Get_Method(req, res, JSON.stringify(send_Json), header, 200);
      }
      else if (url == "/add_To_Queue") {
        json = JSON.parse(body);
        if (!json.own_Code) {
          code = random_Name_Generate(35);
        }
        else {
          code = json.own_Code;
        }
        control = false;
        try {
          connected_List[json.code].push([res, json.name, code]);
          header = generate_Header("json");
          if (send_Join[json.code]) {
            send_Get_Method(req, send_Join[json.code], JSON.stringify({ name: json.name, own_Code: code }), header, 200);
          }
        }
        catch {
          header = generate_Header("json");
          send_Get_Method(req, res, JSON.stringify({ message: "error" }), header, 200);
        }
      }
      else if (url == "/start_Quiz") {
        json_Data = JSON.parse(body);
        if (connected_List[json_Data.code][2] == json_Data.start_Token) {
          started[json_Data.code] = true;
          header = generate_Header("json");
          if (send_Join[json_Data.code]) {
            send_Get_Method("req", send_Join[json_Data.code], JSON.stringify({ message: "end" }), header, 200);
            delete send_Join[json_Data.code];
          }
          json = JSON.stringify({ command: "start", code: "" })
          header = generate_Header("json");
          number_Of_Connected[json_Data.code] = 0;
          for (let i = connected_List[json_Data.code].length - 1; i >= 3; i--) {
            if (connected_List[json_Data.code][i]) {
              json = JSON.stringify({ command: "start", code: connected_List[json_Data.code][i][2], answers: json_Data.answers });
              send_Get_Method(req, connected_List[json_Data.code][i][0], json, header, 200);
              number_Of_Connected[json_Data.code]++;
              delete connected_List[json_Data.code][i];
            }
          }
        }
        host[json_Data.code] = res;
        send_All_Answers(json_Data, host, answers);

      }
      else if (url == "/onw_Answer") {
        json = JSON.parse(body);
        if (!answers[json.code]) {
          answers[json.code] = [[json.answer, json.name, json.own_Code]];
          header = generate_Header("json");
          send_Get_Method(req, res, JSON.stringify({ message: true }), json, 200);
        }
        else {
          try {
            answers[json.code].push([json.answer, json.name, json.own_Code]);
            header = generate_Header("json");
            send_Get_Method(req, res, JSON.stringify({ message: true }), json, 200);
          }
          catch {
            send_Get_Method(req, res, JSON.stringify({ message: false }), json, 200);
          }
        }
      }
      else if (url == "/close_Connection") {
        json = JSON.parse(body);
        message = "error";
        if (connected_List[json.code][2] == json.start_Token) {
          send_Json = JSON.stringify({ message: "connection has closed" });
          header = generate_Header("json");
          for (var i = 3; i < connected_List[json.code].length; i++) {
            if (connected_List[json.code][i]) {
              send_Get_Method(req, connected_List[json.code][i][0], send_Json, header, 200);
            }
          }
          delete connected_List[json.code];
          delete answers[json.code];
          message = "connection has closed";
        }
        header = generate_Header("json");
        delete started[json.code];
        send_Get_Method(req, res, JSON.stringify({ message: message }), header, 200);
      }
      else if (url = "/show_Join") {
        json = JSON.parse(body);
        try {
          if (json.start_Token == connected_List[json.code][2]) {
            send_Join[json.code] = res;
          }
        }
        catch { }
      }
    });
  }
}).listen(PORT, IP_ADRESS);
console.log("http://" + IP_ADRESS + ":" + PORT);