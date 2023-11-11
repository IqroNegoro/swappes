<template>
    <NuxtLayout>
        <NuxtPage />
        <Notification v-if="notification._id" />
        <Toast />
    </NuxtLayout>
</template>
<script setup>
const toast = useToast();
const notification = useNotification();
const user = userStore();
const socket = useSocket();

const handleStatus = e => {
    if (e.type === "offline") {
        toast.value.push("It looks like you are offline")
    } else {
        toast.value.push("Internet connection restored")
    }
}
onMounted(() => {
    window.addEventListener("offline", handleStatus)
    window.addEventListener("online", handleStatus)
    const audioNotification = new Audio("/sfx/notification.mp3")
    socket.value.on("notification", newNotification => {
        if (user._id != newNotification.from._id) {
            notification.value = newNotification;
            audioNotification.play();
        }
    });
})

onUnmounted(() => {
    window.removeEventListener("offline", handleStatus);
    window.removeEventListener("online", handleStatus);
    socket.value.off("notification");
})
</script>  
<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.1s;
}

.page-enter-from,
.page-leave-to {
    opacity: 0
}
</style>