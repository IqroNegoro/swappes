<template>
    <div class="flex justify-center items-center flex-col w-full h-screen gap-4">
        <h1 class="text-7xl">{{ error.statusCode }}!</h1>
        <h1 v-if="error.statusCode != 500" class="text-7xl">{{ error.message }}!</h1>
        <h1 v-else>Something wrong, try again later</h1>
        {{ error.message }}
        <NuxtLink :to="user.authenticated ? '/' : '/login'" class="button">
            Back
        </NuxtLink>
    </div>
</template>
<script setup>
const user = userStore();
const { error } = defineProps({
    error: Object,
})

useHead({
    title: "Page doesn't exists | Swappes"
})
</script>