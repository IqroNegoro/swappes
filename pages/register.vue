<template>
    <div class="w-full h-screen flex justify-center items-center">
       <form class="shadow-xl w-full md:w-1/2 lg:w-1/4 h-screen md:h-3/4 px-4 flex gap-4 justify-center items-center flex-col relative overflow-hidden" @submit.prevent="handleRegister">
            <h1 class="font-semibold tracking-wider text-xl">Register To Swappes</h1>
            <input type="text" class="w-3/4 rounded-sm bg-black/10 placeholder:text-black placeholder:text-sm p-2" placeholder="Your name" v-model="name" autofocus>
            <input type="email" class="w-3/4 rounded-sm bg-black/10 placeholder:text-black placeholder:text-sm p-2" placeholder="Email" v-model="email">
            <input type="password" class="w-3/4 rounded-sm bg-black/10 placeholder:text-black placeholder:text-sm p-2" placeholder="Password" v-model="password">
            <button class="w-full bg-black/50 hover:bg-black/75 rounded-sm text-white py-2 disabled:bg-black/25 disabled:cursor-not-allowed" :disabled="pending" @click.prevent="handleRegister" type="submit" @submit.prevent="handleRegister">
                Register
            </button>
            <p>
                Already have account?
                <NuxtLink :to="{name: 'login'}" class="text-blue-500">
                    login
                </NuxtLink>
            </p>
            <div class="absolute bottom-0 left-0 w-full h-32 bg-black/50 triangle"></div>
       </form>
       <Toast />
    </div>
</template>
<script setup>
const name = ref("Emilico Chan");
const email = ref("emilico@gmail.com");
const password = ref("emilico");
const toast = useToast();
let {data,error,pending} = {}

const handleRegister = async () => {
    toast.value = [];
    ({ data, error, pending } = await register(name.value, email.value, password.value))

    if (error.value) {
        if (error.value.data) {
            if (error.value.data.message) {
                toast.value.push(error.value.data.message);
            }
            
            if (error.value.data.errors) {
                toast.value = error.value.data
            }
        } else {
            toast.value.push(`Something Went Wrong (code: ${error.value.statusCode})`)
        }
        return;
    }

    toast.value.push("Register success, please log-in");

    return navigateTo("/login");
}

if (!await refreshLogin()) navigateTo("/");

definePageMeta({
    layout: false
})

useHead({
    title: "Register To Swappess"
})
</script>