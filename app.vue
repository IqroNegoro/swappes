<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
<script setup>
const toast = useToast();
const handleStatus = e => {
    console.log(e.type)
    toast.value.push("It looks like you are offline")
}
onMounted(() => {
    window.addEventListener("offline", handleStatus)
    window.addEventListener("online", handleStatus)
    console.log("aku mounted!")
})

onUnmounted(() => {
    window.removeEventListener("offline", handleStatus)
    window.removeEventListener("online", handleStatus)
})
</script>  
<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.5s;
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
    transform: translateY(1rem);
    filter:blur(4px);
}
</style>