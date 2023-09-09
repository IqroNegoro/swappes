<template>
    <div class="flex flex-row gap-2">
        <NuxtLink class="text-sm font-semibold" :to="{name: 'users-id', params: {id: comment.user._id}}">
            <img :src="comment.user.avatar?.url" class="w-10 h-10 object-cover rounded-full">
        </NuxtLink>
        <div class="flex flex-col gap-1">
            <div class="dark:bg-dark-secondary rounded-md bg-black/10 px-2 py-1">
                <NuxtLink class="text-sm font-semibold" :to="{name: 'users-id', params: {id: comment.user._id}}">{{comment.user.name}}</NuxtLink>
                <p class="text-sm text-justify" v-html="comment.comment"></p>
            </div>
            <div class="flex gap-4 px-2">
                <button class="text-xs">Reply</button>
                <i class="bx bx-loader-alt bx-spin" v-if="pending"></i>
                <button class="text-xs" v-if="comment.user._id == user._id && !pending" @click="handleDeleteComment">Delete</button>
            </div>
        </div>
    </div>
</template>
<script setup>
const user = userStore();
const toast = useToast();
const socket = useSocket();

const { comment } = defineProps(["comment"]);
const emit = defineEmits(["deleteComment"]);

const { data, error, pending, execute } = await deleteComment(comment.post, comment._id)
pending.value = false;

const handleDeleteComment = async () => {
    pending.value = true;
    await execute();
    if (error.value) {
        toast.value.push("Something went wrong");
    } else {
        if (!socket.value.connected) {
            emit("deleteComment", comment._id)
        }
    }
    pending.value = false;
}
</script>