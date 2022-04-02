const socket = require('socket.io')
const {Authenticate} = require("../domain/middleware/authenticate");
const productService = require("../domain/services/service-product");

const socketServer = (app) =>{
    //Socket for main server request
    let server = app.listen(4040, function () {
        console.log('Socket Server is listening on port 4040');
    });

    const io = socket(server)
    io.use(async (socket, next) => {
        // console.log("socket", socket);
        let req = {
            headers: { authorization: socket.handshake.auth.token },
        }
        await Authenticate(req, socket.res, next)
        if(req.user?.id) {
            socket.handshake.user = req.user
        } else {
            return next(new Error('Invalid Token 1'))
        }
    }).on('connection', async function (socket, next) {
        console.log(`${socket.id} is connected`);
        socket.on('disconnect', function (socket) {
            console.log(`user is disconnected`);
        });

        socket.on('bidPrice', async (data) => {
            let req = {
                body: data,
                params: {id: data.productId},
                user: socket.handshake.user
            }
            let response = await productService.bidProduct(req)
            io.emit('prodStatus|'+ data.productId, response);
            socket.emit('logStatus|'+ data.productId, response);
        });
    });
};

module.exports = socketServer;

