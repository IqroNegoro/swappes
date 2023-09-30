<template>
    <div class="h-screen w-full dark:bg-dark">
        <Navbar />
        <div class="dark:bg-dark grid grid-rows-1 grid-cols-1 lg:grid-cols-[1fr,2fr,1fr] mt-16">
            <div class="max-lg:hidden"></div>
            <slot />
            <div class="max-lg:hidden"></div>
        </div>
        <Notification v-if="notification._id" />
        <Toast v-if="toast.length" />
    </div>
</template>
<script setup>
const toast = useToast();
const notification = useNotification();
</script>
