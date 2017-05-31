var http = require('http'),
    io = require('socket.io');
//创建server
var server = http.createServer().listen(8321);
//创建socket
var socket = io.listen(server);
//客户端
var clients = new Array();
socket.on('connection', socket => {
    socket.emit('begin', {
        'count': clients.length
    });
    var newClient = {
        uniqueId: socket.id,
        number: clients.length + 1,
        socket: socket
    };
    clients.push(newClient);
    var cnt = clients.length;
    //广播
    clients.forEach(client => {
        client.socket.emit('onLine', {
            'name': '用户' + newClient.number,
            'count': cnt
        });
    });
    //绑定事件
    bindDisconnect(socket);
    bindNews(socket);
});
//断开连接
function bindDisconnect(socket) {
    socket.on('disconnect', function() {
        clients.forEach((client, i) => {
            if (client.uniqueId == socket.id) {
                clients.splice(i, 1);
                return true;
            }
        });
        //广播
        clients.forEach((client) => {
            client.socket.emit('offLine', {
                'name': '用户' + client.number,
                'count': _clients.length
            });
        })
    })
}
//收到新消息
function bindNews(socket) {
    socket.on('news', function(message) {
        //广播
        clients.forEach((client) => {
            client.socket.emit('broadCast', {
                'isSelf': client.uniqueId == socket.id,
                'message': message,
                'name': '用户' + client.number
            });
        });
    })
}