import {io} from 'socket.io-client'
import {ref} from "vue";

export const socket = ref()

export const setupSocketConnection = () => {
    socket.value = io('http://localhost:4040', {
        transports: ['websocket'],
        auth: {
            token: localStorage.getItem('token')
        }
    })
    return socket.value
}

export const disconnect = () => {
    if (socket.value) {
        socket.value.disconnect()
    }
}

export const sendPrice = async (productId, price) => {
    socket.value.emit('bidPrice', {
        productId: productId,
        bidPrice: price,
    })
}
