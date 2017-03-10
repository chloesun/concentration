// Name: Chloe Sun
//Student number: 101059882

const http = require ('http');
const fs = require('fs');
const mime = require('mime-types');   
const url = require('url');
const hostname = '127.0.0.1';
const port = 2406;
const makeBoard = require('./makeBoard.js');
const URL = require('url-parse');
const ROOT = "./public_html";

// store users
var users = {};

// create http server
var server = http.createServer(handleRequest); //already async
server.listen(port, hostname);


function handleRequest(req, res){
// parse url
var urlObj = url.parse(req.url,true);
var filename = ROOT+urlObj.pathname;    

//routing
if (urlObj.pathname==="/" || urlObj.pathname==="/index.html"){
	filename+="/index.html";
	fs.readFile(filename,"utf8",function(err, data){
		if(err)respondErr(err);
		else respond(200,data);
	});
	// execute after user input(name) is submitted
}else if(urlObj.pathname === "/memory/intro" && req.method == "POST"){
	var postBody="";
	req.setEncoding('utf8');
	req.on('data',function(chunk){			
		console.log(chunk);
			postBody+=chunk; //data is read as buffer objects
			console.log("chunk: "+postBody);
		});

	req.on('end',function(){
		var client = JSON.parse(postBody);
		console.log(client);
        // create new user
        var board = makeBoard(4);
		//account for empty username
		if(client.username ===""){
			client.username = "Anonymous";
		}

		//userBank.set(client.username, board);
		//adding key value pair to the object
		users[client.username] = board;
		respond(200);
	});

}else if (urlObj.pathname ==="/memory/card"){
	var parsedURL = new URL(req.url, true);
	//Extract info from the url

	var row = parsedURL.query.row;	
	var col = parsedURL.query.col;	
	var username = parsedURL.query.username;
	console.log(users);

	var board = users[username];
	var cardNum = board[row-1][col-1];
	console.log('Value at '+row+", "+col+" is "+cardNum);

	if(col>=3 || row >= 3){
		respond(400, "Bad request");
	}else respond(200, cardNum.toString());// the return has to be a string or a buffer


}else if(urlObj.pathname==="/match/card"){
	var parsedURL = new URL(req.url, true);
	var username = parsedURL.query.username;
	var row1 = parsedURL.query.row1;
	var col1 = parsedURL.query.col1;
	var row2 = parsedURL.query.row2;
	var col2 = parsedURL.query.col2;

	fs.readFile('./users.json', 'utf8', function (err, data) {
		if (err) throw err;

		var usersJSON = JSON.parse(data);

		if (usersJSON.hasOwnProperty(username) &&
			row1 <= usersJSON[username].level &&
			column1 <= usersJSON[username].level &&
			row2 <= usersJSON[username].level &&
			column2 <= usersJSON[username].level) {
			var mapValue1 = usersJSON[username].map[row1][column1];
		var mapValue2 = usersJSON[username].map[row2][column2];

		console.log('Matching', username, row1+','+col1, '- Value:', mapValue1, 'with', row2+','+column2, '- Value:', mapValue2);

		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		res.end((mapValue1 === mapValue2).toString());
	} else {
		res.statusCode = 400;
		res.setHeader('Content-Type', 'text/plain');
		res.end('Invalid values');
	}
});



	respond(200);
}
else{
	//the callback sequence for static serving...
	var stats = fs.stat(filename,function(err, stats){
		if(err){   //try and open the file and handle the error, handle the error
			respondErr(err);

		}else{
			if(stats.isDirectory()){
				filename+="/index.html";
			}
			fs.readFile(filename,"utf8",function(err, data){
				if(err)respondErr(err);
				else respond(200,data);
			});
		}
	});			
}


//locally defined helper function
//serves 404 files 
function serve404(){
	fs.readFile(ROOT+"/404.html","utf8",function(err,data){
		if(err)respond(500,err.message);
		else respond(404,data);
	});
}

//locally defined helper function
//responds in error, and outputs to the console
function respondErr(err){
	if(err.code==="ENOENT"){
		serve404();
	}else{
		respond(500,err.message);
	}
}

//locally defined helper function
//sends off the response message
function respond(code, data){
	// content header
	res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
	// write message and signal communication is complete
	res.end(data);
}	


function getParameterByName(name, url) {
	if (!url) {
		url = window.location.href;
	}
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}






};



