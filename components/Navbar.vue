<template>
<div class="dark:bg-dark-primary dark:text-white fixed top-0 left-0 w-full h-16 shadow-md bg-white p-2 z-20 flex justify-between items-center px-4">
        <div>
            <NuxtLink :to="{name: 'index'}">Swappes</NuxtLink>
        </div>
        <div class="flex flex-row gap-2">
            <NuxtLink :to="{name: 'index'}" class="flex justify-center items-center text-3xl">
                <i class="bx bx-home"></i>
            </NuxtLink>
        </div>
        <div class="flex flex-row gap-2">
            <button class="relative" @click="showNotificationsMenu = !showNotificationsMenu" id="notificationMenu">
                <i class="bx bx-bell text-3xl"></i>
                <template v-if="showNotificationsMenu">
                    <div v-if="pendingNotification" class="absolute right-0 dark:bg-dark-primary dark:text-white rounded-md w-80 flex flex-col justify-center items-center p-4 gap-2">
                        <i class="bx bx-loader-alt bx-spin text-5xl"></i>
                    </div>
                    <div v-else-if="!notifications.length" class="absolute right-0 dark:bg-dark-primary dark:text-white rounded-md w-80 flex flex-col justify-center items-center p-4 gap-2">
                        <i class="bx bx-bell text-5xl"></i>
                        <p>There's no notifications</p>
                    </div>
                    <div class="light-scrollbar rounded-scrollbar flex flex-col gap-3 px-2 py-2 absolute right-0 dark:bg-dark-primary dark:text-white bg-white rounded-md w-80 max-h-[80vh] overflow-y-scroll shadow-md overscroll-contain" v-else>
                        <h1 class="font-black text-2xl text-left">Notifications</h1>
                        <NotificationList v-for="notification in notifications" :key="notification._id" :notification="notification" />
                        <!-- <div class="w-full p-1 relative flex flex-row items-center gap-2 rounded-md transition-transform duration-150 hover:bg-black/10 hover:-translate-y-2">
                            <img :src="user.avatar?.url" alt="" class="rounded-full w-12 h-12 object-cover">
                            <div class="text-left">
                                <h1 class="font-semibold">Iqro Negoro</h1>
                                <p class="line-clamp-3 break-words text-sm">
                                    send a friend request
                                </p>
                                <span class="text-xs tracking-wide font-semibold">{{ moment().fromNow() }}</span>
                                <div class="flex justify-between items-center gap-2">
                                    <button class="bg-blue-500 rounded-sm text-whitey py-1 px-2">
                                        Accept
                                    </button>
                                    <button class="dark:bg-dark-secondary rounded-sm text-white py-1 px-2">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div> -->
                    </div>
                </template>
            </button>
            <button class="relative" @click="showUserMenu = !showUserMenu" id="userMenu">
                <img v-if="user.avatar.url" :src="user.avatar.url" alt="" class="rounded-full w-12 h-12 object-cover">
                <div v-else class="rounded-full w-12 h-12 bg-black/10"></div>
                <div class="flex flex-col items-start absolute w-max p-2 right-0 dark:bg-dark-primary dark:text-white bg-white shadow-md rounded-md divide-y divide-black/10" v-if="user.authenticated && showUserMenu">
                    <NuxtLink :to="user._id ? {name: 'users-id', params: {id: user._id}} : {name: 'login'}" class="dark:text-inherit text-black py-2">
                        <i class='bx bx-user-circle'></i>
                        My Profiles
                    </NuxtLink>
                    <NuxtLink to="" class="dark:text-inherit text-black py-2">
                        <i class='bx bx-cog'></i>
                        Settings
                    </NuxtLink>
                    <button class="dark:text-inherit text-black pt-2" @click="logout">
                        <i class='bx bx-log-out'></i>
                        Log Out
                    </button>
                </div>
            </button>
        </div>
    </div>
</template>
<script setup>
const user = userStore();
const socket = useSocket();
const notification = useNotification();
const showNotificationsMenu = ref(false);
const showUserMenu = ref(false);

const {data: notifications, error: errorNotification, pending: pendingNotification, execute: executeNotification} = await getNotifications();

watch(showNotificationsMenu, async newVal => newVal && await executeNotification())

watch(computed(() => useRoute().name), () => showUserMenu.value = false);

onMounted(() => {
    const audioNotification = new Audio("/sfx/notification.mp3")
    socket.value.on("notification", newNotification => {
        console.log(newNotification)
        if (user._id != newNotification.from._id) {
            notification.value = newNotification;
            audioNotification.play();
        }
    });
})

onUnmounted(() => {
    socket.value.off("notification")
})
</script>