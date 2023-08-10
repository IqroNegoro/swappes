<template>
    <div class="fixed top-0 left-0 w-full h-16 shadow-md bg-white p-2 z-20 flex justify-between items-center px-8">
        <div></div>
        <div></div>
        <NuxtLink :to="{name: 'users-id', params: {id: user._id}}">
            <img src="https://w0.peakpx.com/wallpaper/981/51/HD-wallpaper-video-game-arknights-irene-arknights.jpg" alt="" class="rounded-full w-12 h-12 object-cover">
        </NuxtLink>
    </div>
</template>
<script setup>
const user = userStore();
</script>