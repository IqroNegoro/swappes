<template>
    <div class="bg-dark-secondary rounded-md max-w-[75%]">
        <img v-if="message.image" :src="message.image.url" alt="">
        <div class="relative pr-20 pl-4 py-2 max-md:text-sm">
            <p>{{message.content}}</p>
            <span class="absolute bottom-0 right-0 m-1 mr-4 text-xs">{{ moment(message.createdAt).format("LT") }}</span>
        </div>
    </div>
</template>
<script setup>
import moment from "moment";
const { message } = defineProps(["message"]);
</script>