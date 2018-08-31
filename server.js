
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');


app.use(express.static(path.join(__dirname + "./static")));
app.use(bodyParser.urlencoded({extended : true}));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var server = app.listen(8000, function() {
	console.log("listening on port 8000");
});

app.get('/', function(req, res) {
    res.render('index');
})

const io = require('socket.io').listen(server);

//an empty list to hold the usernames and their respective id's.
let users = [];
let messages = [];

io.on('connect', function(socket) {
	socket.emit('connection', {msg: "Connection Successful...!"});
	 socket.on('username_submit', function(data) {
        users.push({id: this.id, username: data});
        io.emit('show_users', users);
        io.emit('show_messages', messages);
	});


	 socket.on('new_message', function(data) {
        var message = data;
        let user = users.find(u => u.id === this.id);
        messages.push({user: user["username"], message: message});
        io.emit('show_messages', messages);
    })
	 
});





