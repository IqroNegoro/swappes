<template>
    <div class="fixed top-0 left-0 w-full h-16 shadow-md bg-white p-2 z-20 flex justify-between items-center px-4">
        <div>
            <h1>Swappes</h1>
        </div>
        <div>
            <NuxtLink :to="{name: 'index'}" class="text-3xl">
                <i class="bx bx-home"></i>
            </NuxtLink>
        </div>
        <button class="relative" @click="showUserMenu = !showUserMenu">
            <img v-if="user.avatar.url" :src="user.avatar.url" alt="" class="rounded-full w-12 h-12 object-cover">
            <div v-else class="rounded-full w-12 h-12 bg-black/10"></div>
            <div class="flex flex-col items-start absolute w-max p-2 -translate-x-6 -left-full top-full bg-white shadow-md rounded-md divide-y divide-black/10" v-if="user.authenticated && showUserMenu">
                <NuxtLink :to="user._id ? {name: 'users-id', params: {id: user._id}} : {name: 'login'}" class="text-black py-2">
                    <i class='bx bx-user-circle'></i>
                    My Profiles
                </NuxtLink>
                <NuxtLink to="" class="text-black py-2">
                    <i class='bx bx-cog'></i>
                    Settings
                </NuxtLink>
                <button class="text-black pt-2" @click="logout">
                    <i class='bx bx-log-out'></i>
                    Log Out
                </button>
            </div>
        </button>
    </div>
</template>
<script setup>
const user = userStore();
const showUserMenu = ref(false);
watch(computed(() => useRoute().name), () => showUserMenu.value = false);
</script>