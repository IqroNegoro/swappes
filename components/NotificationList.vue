<template>
    <div class="flex flex-row w-full">
        <NuxtLink :to="{name: 'posts-id', params: {id: notification.post?._id}}" class="p-1 dark:hover:dark-hover w-full relative flex flex-row justify-start items-center gap-2 rounded-md transition-transform duration-150 hover:bg-black/10" v-if="notification.type == 'comment'">
            <div class="absolute top-0 right-0 text-xs bg-blue-500 m-1 rounded-full w-2 h-2"></div>
            <img :src="notification.from?.avatar?.url" alt="" class="rounded-full w-12 h-12 object-cover object-center aspect-square">
            <div class="text-left">
                <h1 class="text-sm font-semibold">{{ notification.from?._id == user._id ? "You" : notification.from.name }} {{ notification.to?.length > 0 ? `and ${notification.to?.length - 1} others` : "" }}</h1>
                <p class="line-clamp-3 break-words text-sm">
                    {{ notification.content }} <span class="font-semibold">{{notification.post?.description}}</span>
                </p>
                <span class="text-xs tracking-wide font-semibold">{{ moment(notification.updatedAt).fromNow() }}</span>
            </div>
        </NuxtLink>
        <NuxtLink :to="{name: 'users-id', params: {id: notification.from?._id}}" class="p-1 dark:hover:dark-hover w-full relative flex flex-row justify-start items-center gap-2 rounded-md transition-transform duration-150 hover:bg-black/10" v-if="notification.type == 'friend'">
            <div class="absolute top-0 right-0 text-xs bg-blue-500 m-1 rounded-full w-2 h-2"></div>
            <img :src="notification.from?.avatar?.url" alt="" class="rounded-full w-12 h-12 object-cover object-center aspect-square">
            <div class="text-left w-full">
                <p class="text-sm">
                    <span class="font-semibold">
                        {{notification.from?.name}}
                    </span>
                    {{ notification.content }}
                </p>
                <span class="text-xs tracking-wide font-semibold">{{ moment(notification.updatedAt).fromNow() }}</span>
            </div>
        </NuxtLink>
    </div>
</template>
<script setup>
import moment from "moment";
const { notification } = defineProps(["notification"]);
const user = userStore();
</script>