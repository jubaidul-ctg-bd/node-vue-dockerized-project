<template>
    <div class="col">
        <div class="card">
            <h5 class="card-header">{{ product.name }}</h5>
            <div class="card-body">
                <h5 class="card-title">Price: {{ product.price }}</h5>
                <p class="card-text">Bid Price Limit: {{ product.bidingPriceLimit }}</p>
                <p class="card-text" v-if="bidStart">Bidding Started: {{ convertDate(product.startDateTime) }} {{ convertTime(product.startDateTime) }}</p>
                <p class="card-text" v-if="!bidStart">Bidding will start: {{ convertDate(product.startDateTime) }} {{ convertTime(product.startDateTime) }}</p>
<!--                <p class="card-text">Bidding Start Time: {{ convertTime(product.startDateTime) }}</p>-->
<!--                <p class="card-text">Bidding Duration: {{ convertDuration(product.duration) }} </p>-->

                <p class="card-text" v-if="currentTime">
                    Bidding Remaining Time: {{
                        currentTime ? `${currentTime.days ? currentTime.days + ' Days ' : ''}${("0" + currentTime.hours).slice(-2)}:${("0" + currentTime.minutes).slice(-2)}:${("0" + currentTime.seconds).slice(-2)}` : ""
                    }}
                </p>
                <p v-if="!currentTime">{{ currentMsg }}</p>


                <p class="card-text" :class="{ blink_me: blink, 'text-primary': blink, 'text-success': !blink }">
                    {{ winner() }}</p>
                <input type='number' class='form-control' v-model="bidPrice" placeholder='Enter Bid Amount' :disabled="!currentTime">
                <button
                    v-on:click="handleSubmit"
                    class="btn btn-primary"
                    style="margin-top: 20px"
                >
                    Bid
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>

import {ref, toRefs} from "vue"
import {socket, sendPrice, setupSocketConnection} from "../api/socketioService"
import {createToaster} from "@meforma/vue-toaster";

const toaster = createToaster();
const props = defineProps(["product"])
const {product} = toRefs(props)
const bidPrice = ref('')
const blink = ref(true)
const bidStart = ref(true)

const currentTime = ref('')
const currentMsg = ref('Bidding Time\'s Over!')

const countdown = () => {
    let t = new Date(product.value.startDateTime)
    if (t < new Date()) {
        t = t.setMinutes(t.getMinutes() + product.value.duration) - new Date()
        let seconds = Math.floor((t / 1000) % 60);
        let minutes = Math.floor((t / 1000 / 60) % 60);
        let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        let days = Math.floor(t / (1000 * 60 * 60 * 24));
        if (t > 0) {
            currentTime.value = {
                total: t,
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            };
            setTimeout(countdown, 1000);
        } else {
            currentTime.value = null;
        }
    } else {
        bidStart.value = false
        currentMsg.value = "Bidding Not Started Yet!"
    }

}

setTimeout(countdown, 1000);


if (!socket.value) {
    setupSocketConnection()
}

socket.value.on('prodStatus|' + product.value.productId, res => {
    console.log("res.Resp.data.price", res.Resp.data.price, product.value.price)
    if (res.Resp.Error) {
        toaster.error(res.Resp.message)
    } else {
        product.value.price = res.Resp.data.price
        toaster.success(res.Resp.message)
    }
})

const winner = () => {
    let date = new Date(product.value.startDateTime)
    date.setMinutes(date.getMinutes() + product.value.duration)
    if (date < new Date()) {
        blink.value = false
        return product.value.lastBidderName ? 'Winner: ' + product.value.lastBidderName : 'No one bid the product'
    } else {
        return 'Hidden'
    }
}


const convertDate = (time) => {
    let date = new Date(time)
    return date.toLocaleDateString()
}

const convertTime = (time) => {
    let date = new Date(time)
    let hour = date.getHours()
    let minute = date.getMinutes()
    if (hour === 12) {
        return String(hour + ':' + minute + ' AM')
    } else if (hour > 12) {
        hour = hour % 12
        return String(hour + ':' + minute + ' PM')
    } else {
        return String(hour + ':' + minute + ' AM')
    }
}

const convertDuration = (time) => {
    const day = Number(time / 1440).toFixed(0)
    const hour = Number((time % 1440) / 60).toFixed(0)
    const minute = Number(time % 60).toFixed(0)

    if (day > 0) {
        return String(day ? day + (day > 1 ? ' days ' : ' day ') : '' + hour ? hour + (hour > 1 ? ' Hours ' : ' Hours ') : '' + minute ? minute + (minute > 1 ? ' minutes ' : ' minute ') : '')
    } else if (hour > 0) {
        return String(hour ? hour + (hour > 1 ? ' Hours ' : ' Hour ') : '' + minute ? minute + (minute > 1 ? ' minutes ' : ' minute ') : '')
    } else {
        return String(minute ? minute + (minute > 1 ? ' minutes ' : ' minute ') : '')
    }
}


const handleSubmit = async () => {
    console.log('handleSubmit')
    if (bidPrice.value) {
        await sendPrice(product.value.productId, bidPrice.value)
    } else {
        toaster.error("Price field empty!")
    }
}

</script>

<style>
.blink_me {
    animation: blinker 1s linear infinite;
}

@keyframes blinker {
    50% {
        opacity: 0;
    }
}
</style>
