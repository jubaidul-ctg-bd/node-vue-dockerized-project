const ormUser = require('../domain/orm/orm-user');
const io = require("socket.io-client");


describe('Post Endpoints', () => {
    it('should info of a USER', async () => {
        const res = await ormUser.GetById("e88462d5-3193-47b0-8883-8d07f306fea2");
        expect(res.name).toEqual("Jubaidul");
    });
});


let socketUrl = "http://localhost:4040";
let options = {
    transports: ["websocket"],
    "force new connection": true,
};

describe("Sockets", function () {
    var client1, client2, client3;

    it("Test user connected with socket", () => {
        client1 = io.connect(socketUrl, options);
    })


    // user cann't bid before start time
    it("This bid has not started", () => {
        // Set up client1 connection
        client1 = io.connect(socketUrl, options);
        client1.emit("bidPrice", {productId: "3511d967-6738-40c6-aafe-679acfbdaae9", bidPrice: 15})
        client1.on('prodStatus', (data) => {
            console.log("1st test case", data)
            expect(data.status).toEqual("Failure")
        })
    });

    // user cann't bid because time over
    it("This bid time is over", () => {
        client1 = io.connect(socketUrl, options);
        client1.emit("bidPrice", {productId: "97057746-6339-43f7-b27b-5fbc3339ceee", bidPrice: 15})
        client1.on('prodStatus', (data) => {
            console.log("2st test case", data)
            expect(data.status).toEqual("Failure")
        })
    });

    // user can bid this product
    it("Bid successful", () => {
        // Set up client1 connection
        client1 = io.connect(socketUrl, options);
        client1.emit("bidPrice", {productId: "16c5198b-c38a-4062-9cd7-d3ed2fd2e597", bidPrice: 10})
        client1.on('prodStatus', (data) => {
            console.log("3st test case", data)
            expect(data.status).toEqual("Success")
        })
    });

    // cant not bid above the predifined limit
    it("Biding with above pre-define limit", () => {
        // Set up client1 connection
        client1 = io.connect(socketUrl, options);
        client1.emit("bidPrice", {productId: "16c5198b-c38a-4062-9cd7-d3ed2fd2e597", bidPrice: 25})
        client1.on('prodStatus', (data) => {
            console.log("4st test case", data)
            expect(data.status).toEqual("Failure")
        })
    });

    // subsequently bidding
    it("subsequent bidding will failed", () => {
        // Set up client1 connection
        client1 = io.connect(socketUrl, options);
        client1.emit("bidPrice", {productId: "16c5198b-c38a-4062-9cd7-d3ed2fd2e597", bidPrice: 15})
        client1.on('prodStatus', (data) => {
            console.log("5st test case", data)
            expect(data.status).toEqual("Failure")
        })
    });

});
