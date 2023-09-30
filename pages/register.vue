<template>
    <div class="dark:bg-dark dark:text-white w-full h-screen grid grid-cols-1 md:grid-cols-2 grid-rows-1">
        <div class="flex flex-col justify-between items-center md:items-start p-2">
            <div class="text-left">
                <p class="text-lg first-letter:text-4xl">Swappess</p>
            </div>
            <form class="flex flex-col gap-2 mx-auto md:w-3/4" @submit.prevent="handleRegister">
                <h1 class="font-bold max-md:text-center text-3xl tracking-wider">Yuk, Bikin Akun</h1>
                <p class="dark:text-white max-md:text-center text-[#667085] tracking-wide">Bikin akun dulu untuk melanjutkan</p>
                <div class="flex flex-col gap-2">
                    <p class="font-semibold">Nama</p>
                    <div class="flex flex-row justify-center rounded-md items-center w-full border dark:border-white/50 border-black/50 p-1">
                        <i class="bx bxs-user text-2xl px-1"></i>
                        <input type="text" class="w-full bg-transparent" placeholder="Enter Your Name" v-model="name">
                    </div>
                    <p class="font-semibold">Email</p>
                    <div class="flex flex-row justify-center rounded-md items-center w-full border dark:border-white/50 border-black/50 p-1">
                        <i class="bx bx-envelope text-2xl px-1"></i>
                        <input type="text" class="w-full bg-transparent" placeholder="Enter Your Email" v-model="email">
                    </div>
                    <p class="font-semibold">Password</p>
                    <div class="flex flex-row justify-center rounded-md items-center w-full border dark:border-white/50 border-black/50 p-1">
                        <i class="bx bx-lock text-2xl px-1"></i>
                        <input type="password" class="w-full bg-transparent" placeholder="Enter Your Password" v-model="password">
                    </div>
                </div>
                <button class="w-full bg-black/10 dark:bg-white/20 duration-150 dark:hover:bg-white/40 rounded-md p-2" type="submit" @submit.prevent="handleRegister" :disabled="pending">
                    Buat Akun
                </button>
                <p class="max-md:text-center" >Sudah punya akun? <NuxtLink :to="{name: 'login'}" class="font-semibold">Masuk Yuk</NuxtLink></p>
            </form>
            <div class="">
                <p class="text-xs">
                    &copy; Swappess 2023
                </p>
            </div>
        </div>
        <div class="max-md:hidden h-full w-full">
        </div>
        <Toast />
    </div>
</template>
<script setup>
const name = ref("Emilico Chan");
const email = ref("emilico@gmail.com");
const password = ref("emilico");
const toast = useToast();
let {data, error, pending} = {};

const handleRegister = async () => {
    toast.value = [];
    ({data, error, pending} = await register(name.value, email.value, password.value));

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