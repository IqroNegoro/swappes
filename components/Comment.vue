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
                    <img :src="comment.image.image" alt="" class="w-48 rounded-sm">
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
        <TransitionGroup tag="div" name="fade-up" v-if="comment.reply?.length" class="flex flex-col gap-2 w-full pl-12">
            <Comment v-for="comment in comment.reply" :comment="comment" :key="comment._id" @delete-comment="id => comment = comment.filter(v => v._id != id)" />
        </TransitionGroup>
        <div class="relative w-full pl-12 rounded-md shadow-sm flex flex-col gap-1" v-if="reply">
            <div class="absolute top-0 left-0 w-full h-full bg-black/20 z-20" v-if="pendingSendReply"></div>
            <p class="text-xs">Replying to <span class="font-semibold"> {{ comment.user.name }} </span> </p>
            <div class="flex justify-center items-center flex-nowrap gap-4">
                <img :src="user.avatar?.url" alt="" class="rounded-full w-8 h-8 object-cover aspect-square">
                <div ref="replyComment" contenteditable="true" placeholder="Write your reply..." class="min-h-[40px] max-h-48 overflow-y-auto cursor-pointer rounded-lg w-full text-left bg-black/10 px-4 py-2 font-light outline-none" @keydown.ctrl.enter="handlePostReply" autofocus></div>
                <div class="flex">
                    <label for="imagesInput" class="cursor-pointer flex justify-center items-center px-1 text-xl">
                        <i class="bx bx-camera"></i>
                    </label>
                    <input ref="inputImage" type="file" name="image" accept=".jpg,.jpeg,.png,.webp" id="imagesInput" class="hidden" @input="handleInputFile">
                    <button class="flex justify-center items-center px-1 text-xl" @click="handlePostReply">
                        <i class="bx bx-send"></i>
                    </button>
                </div>
            </div>
            <div class="relative max-w-max" v-if="image">
                <button class="absolute dark:bg-dark-primary dark:text-white top-0 right-0 flex justify-center items-center px-1 bg-white rounded-full m-1" @click="() => {image = ''; inputImage.value = ''}">
                    <i class="bx bx-x text-xs rounded-full"></i>
                </button>
                <img class="pl-12 w-48 rounded-sm" :src="renderImage(image)" alt="">
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
const image = ref(null);
const inputImage = ref(undefined);
const pendingSendReply = ref(false);

const renderImage = file => URL.createObjectURL(file);

const handleInputFile = ({target}) => {
    const allowed = ["png", "jpg", "jpeg", "webp"]
    if (!allowed.includes(target.files[0].type.split("/")[1])) {
        toast.value.push("Please Select An Photo!");
        image.value = '';
        target.files = []
        return;
    }

    image.value = target.files[0];
}

const handlePostReply = async () => {
    if (!reply.value) return;
    pendingSendReply.value = true;
    const fd = new FormData();
    fd.append("comment", replyComment.value.innerText);
    fd.append("image", image.value)
    fd.append("replyId", comment.replyId ? comment.replyId : comment._id)
    const { data, error } = await commentPost(comment.post, fd);
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
<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px)
}

</style>