<template>
    <div class="flex flex-col gap-2 w-full" ref="container">
        <div class="flex flex-row gap-2">
            <NuxtLink :to="{name: 'users-id', params: {id: comment.user._id}}">
                <img :src="comment.user.avatar?.url" class="w-10 h-10 object-cover rounded-full">
            </NuxtLink>
            <div class="flex flex-col gap-1">
                <div class="dark:bg-dark-secondary rounded-md bg-black/10 px-2 py-1">
                    <NuxtLink class="text-xs md:text-sm font-semibold" :to="{name: 'users-id', params: {id: comment.user._id}}">{{comment.user.name}}</NuxtLink>
                    <p class="text-xs md:text-sm text-justify" v-html="comment.comment"></p>
                </div>
                <div v-if="comment.image">
                    <img :src="comment.image.image" alt="" class="w-48">
                </div>
                <div class="flex gap-4 px-2">
                    <span class="text-xs">
                        {{ moment(comment.createdAt).fromNow() }}
                    </span>
                    <button class="text-xs" @click="reply = !reply">Reply</button>
                    <i class="bx bx-loader-alt bx-spin" v-if="pending"></i>
                    <button class="text-xs" v-if="comment.user._id == user._id && !pending" @click="handleDeleteComment">Delete</button>
                </div>
            </div>
        </div>
        <div v-if="comment.reply?.length" class="flex flex-col gap-2 w-full pl-12">
            <Comment v-for="comment in comment.reply" :comment="comment" :key="comment._id" @delete-comment="id => comment = comment.filter(v => v._id != id)" />

            <!-- <div class="flex flex-row gap-2" v-for="comment in comment.reply" :key="comment._id">
                <NuxtLink :to="{name: 'users-id', params: {id: comment.user._id}}">
                    <img :src="comment.user.avatar?.url" class="w-8 h-8 object-cover rounded-full">
                </NuxtLink>
                <div class="flex flex-col gap-1">
                    <div class="dark:bg-dark-secondary rounded-md bg-black/10 px-2 py-1">
                        <NuxtLink class="text-xs font-semibold" :to="{name: 'users-id', params: {id: comment.user._id}}">{{comment.user.name}}</NuxtLink>
                        <p class="text-xs text-justify" v-html="comment.comment"></p>
                    </div>
                    <div class="flex gap-4 px-2">
                        <span class="text-xs">
                            {{ moment(comment.createdAt).fromNow() }}
                        </span>
                        <button class="text-xs" @click="reply = !reply">Reply</button>
                        <i class="bx bx-loader-alt bx-spin" v-if="pending"></i>
                        <button class="text-xs" v-if="comment.user._id == user._id && !pending" @click="handleDeleteComment">Delete</button>
                    </div>
                </div>
            </div> -->
        </div>
        <div class="w-full flex flex-col pl-12 px-2 gap-2" v-if="reply">
            <p class="text-xs">Replying to {{ comment.user.name }} </p>
            <div class="relative w-full rounded-md shadow-sm gap-4 flex justify-center items-center">
                <div class="absolute top-0 left-0 w-full h-full bg-black/20 z-20" v-if="pendingSendReply"></div>
                <img :src="user.avatar?.url" alt="" class="rounded-full w-8 h-8 object-cover">
                <div class="relative w-full">
                    <div ref="replyComment" contenteditable="true" placeholder="Write your reply..." class="cursor-pointer rounded-lg w-full text-left bg-black/10 px-4 py-2 font-light outline-none" @input="({target}) => reply = target.innerText" @keydown.ctrl.enter="handlePostReply" autofocus></div>
                    <button class="absolute top-0 right-0 w-4 h-full flex justify-center items-center px-4" @click="handlePostReply">
                        <i class="bx bx-send"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import moment from "moment";
const user = userStore();
const toast = useToast();
const socket = useSocket();

const { comment } = defineProps(["comment"]);
const emit = defineEmits(["deleteComment"]);
const container = ref(undefined);
const replyComment = ref(undefined);
const reply = ref(false);
const pendingSendComment = ref(false);
const pendingSendReply = ref(false);

const handlePostReply = async () => {
    if (!reply.value) return;
    pendingSendReply.value = true;
    const { data, error } = await commentPost(comment.post, {
        comment: reply.value,
        images: "",
        replyId: comment.replyId ? comment.replyId : comment._id
    });
    pendingSendReply.value = false;
    if (error.value) {
        error.value.data.errors.forEach(v => {
            toast.value.push(v)
        })
    } else {
        if (!socket.value.connected) {
            // comments.value.push(reply)
        }
        replyComment.value.innerHTML = "";
        reply.value = "";
    }
}

const { data, error, pending, execute } = await deleteComment(comment.post, comment._id)
pending.value = false;

const handleDeleteComment = async () => {
    pending.value = true;
    await execute();
    if (error.value) {
        toast.value.push("Something went wrong");
    } else {
        if (!socket.value.connected) {
            emit("deleteComment", data.value)
        }
    }
    pending.value = false;
}
</script>