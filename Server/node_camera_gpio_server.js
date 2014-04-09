var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

var gpio = require("rpi-gpio");
gpio.setup(13,gpio.DIR_OUT);
app.listen(3000);
var old = "";
function handler (request, response) {
    var file = __dirname + (request.url == '/' ? '/index.html' : request.url);
    fs.readFile(file, function(error, data) {
        if (error) {
            response.writeHead(500);
            return response.end('Error loading index.html');
        }
        response.writeHead(200);
        response.end(data, 'utf-8');
    });
}

io.sockets.on('connection', function (socket) {
  socket.on('pressBtnData', function (data) {
	if(old!=data.button){
	old = data.button;
	//console.log(old);
	if(data.button == 'on'){
		write(13,true);
	}else{
		write(13,false);
	}
	}
  });
});
function write(pin,set){
	console.log(set);
	gpio.write(pin,set,function(err){
		if (err) throw err;
		setInterval(function(){},2000);
	});
	
}
