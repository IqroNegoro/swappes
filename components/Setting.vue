<template>
    <div class="fixed bg-black/50 top-0 left-0 w-full h-screen flex justify-center items-center overflow-auto z-20">
        <div class="rounded-md w-full md:w-1/2 dark:bg-dark-primary dark:text-white bg-white flex flex-col p-4 relative">
            <div class="text-right flex justify-between items-center flex-row">
                <div></div>
                <h1 class="font-bold text-xl">Setting</h1>
                <button class="px-1 hover-bg rounded-full relative z-40" @click="isSetting = false">
                    <i class="bx bx-x text-3xl rounded-full"></i>
                </button>
            </div>
            <div class="min-h-[8rem] max-h-96 overflow-y-auto flex flex-col gap-2">
                <h1 class="font-semibold text-xl">Profile Picture</h1>
                <img :src="data.avatar?.url" alt="" class="w-48 h-48 aspect-square rounded-full self-center object-cover object-center">
                <h1 class="font-semibold text-xl">Profile Banner</h1>
                <img :src="data.banner?.url" alt="" class="rounded-md w-96 mx-auto object-cover object-center">
                <h1 class="font-semibold text-xl">Information</h1>
            </div>
        </div>
    </div>
</template>
<script setup>
const user = userStore();
const { data, pending, error, refresh } = await getUserById(user._id);
console.log(data.value)
const isSetting = settingStatus();
</script>