<template>
    <div class="w-full flex flex-row gap-2 p-2 hover:bg-dark-secondary cursor-pointer">
        <img class="w-12 h-12 rounded-full object-cover object-center" :src="chat.user.avatar.url" :alt="chat.user.name">
        <div class="w-full truncate">
            <h1 class="font-semibold">{{ chat.user.name }}</h1>
            <div class="w-full flex flex-row justify-between gap-2 items-center text-sm">
                <div class="flex flex-row gap-2 items-center w-full truncate">
                    <p class="truncate">{{ chat.lastMessage?.content ?? "..." }}</p>
                </div>
                <span class="text-xs"> {{ moment(chat.updatedAt).format("LT") }} </span>
            </div>
        </div>
    </div>
</template>
<script setup>
import moment from "moment";
const { chat } = defineProps(["chat"]);
</script>