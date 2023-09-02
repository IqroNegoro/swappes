<template>
    <div class="">
        <Navbar />
        <div class="mt-16 pb-16">
            <slot />
        </div>
        <Toast v-if="toast.length" />
    </div>
</template>
<script setup>
const toast = useToast();
</script>