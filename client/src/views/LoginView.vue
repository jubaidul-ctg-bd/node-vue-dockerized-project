<template>
    <form @submit.prevent="handleSubmit">
        <div class="container" style="margin-top: 20px">
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-6">
                    <h3>Login</h3>
                    <div class='form-group'>
                        <label>Email </label>
                        <input type='email' class='form-control' v-model="email" placeholder='Email'>
                    </div>
                    <div class='form-group'>
                        <label>Password </label>
                        <input type='password' class='form-control' v-model="password" placeholder='Password'>
                    </div>
                    <div>
                        <button class='btn btn-primary btn-block login-btn' >Login</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<script setup>
import { setupSocketConnection } from "../api/socketioService"
import axios from 'axios';
import {ref} from "vue";
import {useRouter} from 'vue-router'
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster();
const router = useRouter()

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
    console.log("hey am here")
    if (email.value && password.value) {
        try {
            let response = (await axios.post('http://localhost:8080/api/v1/login', {
                email: email.value,
                password: password.value
            })).data
            localStorage.setItem('token', response.Resp.data.token)
            // localStorage.setItem('userId', response.Resp.data.userId)
            // localStorage.setItem('userName', response.Resp.data.userName)
            await router.push('/')
            setupSocketConnection()
        } catch (error) {
            toaster.error(error)
        }
    } else {
        toaster.error("Email or password is missing")
    }
}

</script>

<style>
    .form-group {
        margin-bottom: 10px;
    }
</style>
