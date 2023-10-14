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
            <button class="relative dark:bg-dark-secondary px-2 rounded-full" @click="showNotificationsMenu = !showNotificationsMenu" id="notificationMenu">
                <i class="bx bxs-bell text-3xl"></i>
                <!-- <div v-if="showNotificationsMenu" class="absolute right-0 dark:bg-dark-primary dark:text-white rounded-md w-80 flex flex-col justify-center items-center p-4 gap-2">
                    <div v-if="pendingNotification">
                        <i class="bx bx-loader-alt bx-spin text-5xl"></i>
                    </div>
                    <div v-else-if="!notifications.length">
                        <i class="bx bx-bell text-5xl"></i>
                        <p>There's no notifications</p>
                    </div>
                    <div class="light-scrollbar rounded-scrollbar flex flex-col gap-3 px-2 py-2 absolute top-0 right-0 dark:bg-dark-primary dark:text-white bg-white rounded-md w-80 max-h-[80vh] overflow-y-scroll shadow-md overscroll-contain" v-else>
                        <h1 class="font-black text-2xl text-left">Notifications</h1>
                        <NotificationList v-for="notification in notifications" :key="notification._id" :notification="notification" />
                    </div>
                </div> -->
                <div v-if="showNotificationsMenu" class="absolute p-3 flex justify-center items-center top-full right-0 dark:bg-dark-primary dark:text-white rounded-md w-80 min-h-fit max-h-96">
                    <i v-if="pendingNotification" class="bx bx-loader-alt bx-spin text-5xl"></i>
                    <div v-else-if="errorNotification" class="flex flex-col gap-3">
                        <i class='bx bx-error-circle text-5xl'></i>
                        <p>Something Wrong</p>
                        <button class="px-2 py-1 dark:text-white dark:bg-dark-secondary" @click.stop="executeNotification"> Try Again </button>
                    </div>
                    <div v-else-if="!notifications.length">
                        <i class="bx bx-bell text-5xl"></i>
                        <p>There's no notifications</p>
                    </div>
                    <div v-else class="light-scrollbar rounded-scrollbar flex flex-col gap-3 px-2 py-2 absolute top-0 right-0 dark:bg-dark-primary dark:text-white bg-white rounded-md w-80 max-h-[80vh] overflow-y-scroll shadow-md overscroll-contain">
                        <h1 class="font-black text-2xl text-left dark:text-white">Notifications</h1>
                        <NotificationList v-for="notification in notifications" :key="notification._id" :notification="notification" />
                    </div>
                </div>
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
const notification = useNotification();
const showNotificationsMenu = ref(false);
const showUserMenu = ref(false);

const {data: notifications, error: errorNotification, pending: pendingNotification, execute: executeNotification} = await getNotifications();

watch(showNotificationsMenu, async newVal => newVal && await executeNotification())

watch(computed(() => useRoute().name), () => showUserMenu.value = false);
</script>