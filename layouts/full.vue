<template>
    <div class="min-h-screen w-full dark:bg-dark">
        <Navbar />
        <div class="mt-16">
            <slot />
        </div>
        <Toast v-if="toast.length" />
    </div>
</template>
<script setup>
const toast = useToast();
</script>