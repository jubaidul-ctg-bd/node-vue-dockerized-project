<template>
    <main id='app'>
        <div class="float-left">
            <button
                v-on:click="logOut()"
                class="btn btn-danger"
                style="margin-top: 10px"
            >
                Log Out
            </button>
        </div>
        <section class="row row-cols-1 row-cols-md-3 g-4" style="margin-top: 20px">
            <section v-for="product in products">
                <Product :product="product"/>
            </section>
        </section>
    </main>
</template>

<script setup>
import {ref, onMounted} from "vue"
import Product from '../components/Product.vue'
import axios from 'axios'
import {useRouter} from 'vue-router'

const products = ref([]);
const router = useRouter()

axios.get('http://localhost:8080/api/v1/products', {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
}).then((response) => {
    products.value = response.data.Resp.data
}).catch(error => {
    router.push('/login')
})

const logOut = () => {
    localStorage.clear()
    router.push('/login')
}

</script>
