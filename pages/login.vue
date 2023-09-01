<template>
    <div class="w-full h-screen flex justify-center items-center">
       <form class="shadow-xl w-full md:w-1/2 lg:w-1/4 h-screen md:h-3/4 px-4 flex gap-4 justify-center items-center flex-col relative overflow-hidden" @submit.prevent="handleLogin">
            <h1 class="font-semibold tracking-wider text-xl">Login To Swappes</h1>
            <input type="email" class="w-3/4 rounded-sm bg-black/10 placeholder:text-black placeholder:text-sm p-2" placeholder="Email" v-model="email" autofocus>
            <input type="password" class="w-3/4 rounded-sm bg-black/10 placeholder:text-black placeholder:text-sm p-2" placeholder="Password" v-model="password">
            <button class="w-full bg-black/50 hover:bg-black/75 rounded-sm text-white py-2 disabled:bg-black/25 disabled:cursor-not-allowed" :disabled="pending" @click.prevent="handleLogin" type="submit" @submit.prevent="handleLogin">
                Log in
            </button>
            <p>
                Doesn't have account? 
                <NuxtLink :to="{name: 'register'}" class="text-blue-500">
                    register
                </NuxtLink>
                now!
            </p>
            <div class="absolute bottom-0 left-0 w-full h-32 bg-black/50 triangle"></div>
       </form>
       <Toast />
    </div>
</template>
<script setup>
const email = ref("iqronegoro0@gmail.com");
const password = ref("test123");
const user = userStore();
const toast = useToast();
let {data,error,pending} = {}

const handleLogin = async () => {
    toast.value = [];
    ({ data, error, pending } = await login(email.value, password.value))
    
    if (error.value) {
        if (error.value.data) {
            if (error.value.data.message) {
                toast.value.push(error.value.data.message);
            }
            
            if (error.value.data.errors) {
                error.value.data.errors.forEach(v => {
                    toast.value.push(v.msg);
                })
            }
        } else {
            toast.value.push(`Something Went Wrong (code: ${error.value.statusCode})`)
        }
        return;
    }

    user.$patch({
        ...data.value,
        authenticated: true
    })

    return navigateTo("/");
}

if (!await refreshLogin()) navigateTo("/");

definePageMeta({
    layout: false
})

useHead({
    title: "Login To Swappes"
})
</script>