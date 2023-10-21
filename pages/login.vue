<template>
    <div class="dark:bg-dark dark:text-white w-full h-screen grid grid-cols-1 md:grid-cols-2 grid-rows-1">
        <div class="flex flex-col justify-between items-center md:items-start p-2">
            <div class="text-left">
                <p class="text-lg first-letter:text-4xl">Swappes</p>
            </div>
            <form class="flex flex-col gap-2 mx-auto md:w-3/4" @submit.prevent="handleLogin">
                <h1 class="font-bold max-md:text-center text-3xl tracking-wider">Mari Masuk</h1>
                <p class="dark:text-white max-md:text-center text-[#667085] tracking-wide">Yuk, masuk dengan akun mu untuk melanjutkan</p>
                <div class="flex flex-col gap-2">
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
                <ul v-if="errorLogin" class="list-disc">
                    <li v-for="(error, i) in errorLogin" :key="i">
                        {{ error }}
                    </li>
                </ul>
                <button class="disabled:cursor-not-allowed flex justify-center items-center w-full bg-black/10 dark:bg-white/20 duration-150 dark:hover:bg-white/40 rounded-md p-2" type="submit" @submit.prevent="handleLogin" :disabled="pending">
                    <i v-if="pending" class='bx bx-loader-alt bx-spin' ></i>
                    <p v-else>
                        Masuk
                    </p>
                </button>
                <p class="max-md:text-center" >Belum punya akun nya? <NuxtLink :to="{name: 'register'}" class="font-semibold">Bikin Yuk</NuxtLink></p>
            </form>
            <div class="">
                <p class="text-xs">
                    &copy; Swappes 2023
                </p>
            </div>
        </div>
        <div class="max-md:hidden h-full w-full">
        </div>
        <Toast />
    </div>
</template>
<script setup>
const NODE_ENV = process.env.NODE_ENV
const email = ref(NODE_ENV === "production" ? "" : "iqronegoro0@gmail.com");
const password = ref(NODE_ENV === "production" ? "" : "iqronegoro");
const user = userStore();
const pending = ref(false);
const errorLogin = ref()

const handleLogin = async () => {
    if (!email.value || !password.value) return;

    pending.value = true;
    errorLogin.value = "";

    const {data, error} = await login(email.value, password.value);

    if (error.value) {
        pending.value = false
        errorLogin.value = error.value.data.errors
        return;
    }

    user.$patch({
        ...data.value,
        authenticated: true
    })

    return navigateTo("/");
    pending.value = false;
}

if (!await refreshLogin()) navigateTo("/");

definePageMeta({
    layout: false
})

useHead({
    title: "Login To Swappes"
})
</script>