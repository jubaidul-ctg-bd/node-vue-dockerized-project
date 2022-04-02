const ormUser = require('../domain/orm/orm-user');
const io = require("socket.io-client");



describe('Post Endpoints', () => {
    it('should info of a USER', async () => {
        const res = await ormUser.GetById("76b446ec-e739-496c-a639-8c42c9cf0f00");
        expect(res.name).toEqual("joanna");
    });
});


let socketUrl = "http://localhost:4040";
var options = {
    transports: ["websocket"],
    "force new connection": true,
};

describe("Sockets", function () {
    var client1, client2, client3;

    it("Test user connected with socket", function (done) {
        // client1 = io.connect(socketUrl, options);
        client1 = io.connect(socketUrl, options);
        done();
    })


    // user cann't bid before start time
    it("This bid has not started", function (done) {
        // Set up client1 connection
        client1 = io.connect(socketUrl, options);
        client1.emit("bidPrice", { productId: "6f106154-71a1-4563-895d-8aea08029c41", bidPrice: 15})
        client1.on('prodStatus', (data) => {
            expect(data.status).toEqual(200)
            done()
        })
    });

    // user cann't bid because time over
    it("this bid time is over", function (done) {
        let date = generateDate()
        let time = generateTime()

        console.log('time', time)
        // Set up client1 connection
        client1 = io.connect(socketUrl, options);
        client1.emit("bidPrice", { productId: "6f106154-71a1-4563-895d-8aea08029c41", bidPrice: 15})
        client1.on('prodStatus', (data) => {
            expect(data.status).toEqual(200)
            done()
        })
    });

    // user can bid this product
    it("bid successful", function (done) {
        let date = generateDate()
        let time = generateTime()
        // Set up client1 connection
        client1 = io.connect(socketUrl, options);
        client1.emit("bidPrice", { productId: "6f106154-71a1-4563-895d-8aea08029c41", bidPrice: 15})
        client1.on('prodStatus', (data) => {
            expect(data.status).toEqual(200)
            done()
        })
    });

    // cant not bid above the predifined limit
    it("biding with above predfined limit", function (done) {
        let date = generateDate()
        let time = generateTime()
        // Set up client1 connection
        client1 = io.connect(socketUrl, options);
        client1.emit("bidPrice", { productId: "6f106154-71a1-4563-895d-8aea08029c41", bidPrice: 15})
        client1.on('prodStatus', (data) => {
            expect(data.status).toEqual(200)
            done()
        })
    });

    // subsequently bidding
    it("subsequent bidding will failed", function (done) {
        let date = generateDate()
        let time = generateTime()
        // Set up client1 connection
        client1 = io.connect(socketUrl, options);
        client1.emit("bidPrice", { productId: "6f106154-71a1-4563-895d-8aea08029c41", bidPrice: 15})
        client1.on('prodStatus', (data) => {
            expect(data.status).toEqual(200)
            done()
        })
    });

});
