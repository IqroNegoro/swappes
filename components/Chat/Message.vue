<template>
    <div ref="point" class="flex flex-row gap-2 max-w-[75%] group">
        <button v-if="user._id == message.user" class="self-center group-hover:opacity-100 group-hover:select-all opacity-0 select-none" @click="execute" :disabled="pending">
            <i v-if="pending" class="bx bx-loader-alt bx-spin"></i>
            <i v-else class="bx bx-trash"></i>
        </button>
        <div class="relative bg-dark-secondary rounded-md w-full">
            <img v-if="message.image" :src="message.image.url" :alt="message.content" class="rounded-md">
            <div v-if="message.content" class="relative pr-24 pl-4 py-2 max-md:text-sm">
                <p>{{message.content}}</p>
            </div>
                <div class="absolute bottom-0 right-0 m-1 mr-4 flex justify-center items-center gap-1">
                    <span class="text-xs">{{ moment(message.createdAt).format("LT") }}</span>
                </div>
        </div>
    </div>
</template>
<script setup>
import moment from "moment";
const { message, user } = defineProps(["message", "user"]);
const socket = useSocket();

const point = ref(undefined);

const { data, pending, error, execute } = await deleteMessage(message.chat, message._id);
pending.value = false;
</script>