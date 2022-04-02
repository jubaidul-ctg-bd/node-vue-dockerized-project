import {io} from 'socket.io-client'
import {ref} from "vue";

const socket = ref()


class SocketioService {
    setupSocketConnection = () => {
        socket.value = io('http://localhost:4040', {
            transports: ['websocket'],
            auth: {
                token: localStorage.getItem('token')
            }
        })
        return socket.value
    }

    disconnect = () => {
        if (socket.value) {
            socket.value.disconnect()
        }
    }

    sendPrice = async (productId, price) => {
        socket.value.emit('bidPrice', {
            productId: productId,
            bidPrice: price,
        })
        let response
        await new Promise(resolve => {
            socket.value.on('prodStatus', data => {
                response = data
                resolve(response)
            })
        })
        return response
    }
}

export default new SocketioService()