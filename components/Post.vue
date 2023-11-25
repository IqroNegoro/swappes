<template>
    <div class="w-full rounded-md shadow-md dark:bg-dark-primary dark:text-white bg-white flex justify-center flex-col gap-2 py-1" v-if="post">
        <div class="flex justify-between px-4 pt-2">
            <div class="flex gap-2">
                <NuxtLink :to="{name: 'users-id', params: {id: post.user._id}}">
                    <img :src="post.user.avatar?.url" alt="" class="rounded-full w-10 h-10 object-cover"> 
                </NuxtLink>
                <div>
                    <NuxtLink :to="{name: 'users-id', params: {id: post.user._id}}" class="text-sm font-bold">{{ post.user.name }}</NuxtLink>
                    <p class="text-xs">{{ moment(post.createdAt).fromNow() }} &bull; <i class='bx bx-world'></i></p>
                </div>
            </div>
            <div class="relative">
                <button class="text-2xl p-2 rounded-full flex justify-center items-center" :class="{'bg-black/10 dark:bg-white/10': showPostMenu}" @click="showPostMenu = !showPostMenu">
                    <i class='bx bx-dots-horizontal-rounded'></i>
                </button>
                <div v-if="showPostMenu" class="absolute dark:bg-dark-primary dark:text-white top-full right-0 flex flex-col items-start w-48 bg-white z-10 rounded-sm shadow-md" @click.self="showPostMenu = false">
                    <button class="dark:hover:dark-hover p-1 text-left font-semibold hover-bg w-full text-md flex justify-left rounded-lg items-center gap-2" v-if="user._id == post.user._id" @click="$emit('editPost', post._id)">
                        <i class='bx bx-pencil text-2xl'></i>
                        <p class="">
                            Edit Post
                        </p>
                    </button>
                    <button class="dark:hover:dark-hover p-1 text-left font-semibold hover-bg w-full text-md flex justify-left rounded-lg items-center gap-2" @click="handleBookmarkPost" v-if="!post.bookmark">
                        <i v-if="pendingBookmark" class="bx bx-loader-alt bx-spin"></i> 
                        <i v-else class="bx bx-bookmark text-2xl"></i> 
                        <p>
                            Bookmark
                        </p>
                    </button>
                    <button v-else class="dark:hover:dark-hover p-1 text-left font-semibold hover-bg w-full text-md flex justify-left rounded-lg items-center gap-2" @click="handleDeleteBookmarkPost">
                        <i class='bx bx-loader-alt bx-spin' v-if="pendingDelBookmark"></i>
                        <i v-else class="bx bxs-bookmark text-2xl"></i> 
                        <p>
                            Bookmark
                        </p>
                    </button>
                    <button class="dark:hover:dark-hover p-1 text-left font-semibold hover-bg w-full text-md flex justify-left rounded-lg items-center gap-2" @click="copyLink(post._id)">
                        <i class="bx bx-link text-2xl"></i> 
                        <p>
                            Copy Link
                        </p>
                    </button>
                    <button class="dark:hover:dark-hover p-1 text-left text-red-500 font-semibold hover-bg w-full text-md flex justify-left rounded-lg items-center gap-2" @click="confirmDeletePost = true" v-if="user._id == post.user._id">
                        <i class="bx bx-trash text-2xl"></i>
                        <p class="">
                            Delete Post
                        </p>
                    </button>
                </div>
            </div>
        </div>
        <div class="px-2 relative">
            <p class="text-sm text-justify line-clamp-6 cursor-context-menu whitespace-pre-line" ref="descriptionContainer" @click="handleOverflowing">
                {{ post.description }}
            </p>
            <button class="text-sm text-blue-500" @click="handleOverflowing" v-if="isOverflowing && !showLess">
                Read More...
            </button>
        </div>
        <div class="grid gap-1" :class="{'grid-cols-1 grid-rows-1': post.images.length == 1, 'grid-cols-2 grid-rows-1': post.images.length == 2, 'grid-cols-2 grid-rows-2': post.images.length == 3, 'grid-cols-2 grid-rows-2': post.images.length == 4}">
            <img v-for="(images, i) in post.images" :key="images.discordId" :src="images.images" alt="attachments" class="w-full overflow-hidden cursor-pointer object-cover object-top" :class="{'aspect-square max-h-96': post.images.length > 1, 'col-span-2 object-center': i == 0 && post.images.length == 3}" loading="lazy" @click="$emit('selectPost', post._id)">
        </div>
        <div class="px-2">
            <i class="bx bx-like"></i> {{ post.likes.length }}
            <i class="bx bx-chat"></i> {{ post.totalComments }}
        </div>
        <div class="flex flex-row justify-between p-2 border-y dark:border-white/10 border-black/10">
            <button class="action-post" @click="handleLikePost">
                <i class='bx bx-loader-alt bx-spin' v-if="pendingLike"></i>
                <i class='bx bxs-like text-blue-500' v-else-if="post.likes.find(v => v == user._id)"></i>
                <i class='bx bx-like' v-else></i>
                <span>Like</span>
            </button>
            <button class="action-post" @click="$emit('selectPost', post._id)">
                <i class='bx bx-chat'></i>
                <span>Comment</span>
            </button>
            <button class="action-post">
                <i class='bx bx-share bx-flip-horizontal'></i>
                <span>Share</span>
            </button>
        </div>
        <div class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/50 z-50 overscroll-none" v-if="confirmDeletePost">
            <div class="dark:bg-dark-primary dark:text-white rounded-md bg-white p-4 shadow-md w-max">
                <button class="ml-auto block px-1 rounded-full" @click="confirmDeletePost = false">
                    <i class="bx bx-x text-xl rounded-full"></i>
                </button>
                <p>Are you sure to delete this post?</p>
                <div class="flex flex-row justify-around gap-2 mt-2">
                    <button class="dark:hover:bg-dark dark:bg-dark-secondary transition-all duration-150 px-2 py-1 w-full rounded-sm" @click="handleDeletePost">Delete</button>
                    <button class="dark:hover:bg-dark dark:bg-dark-secondary transition-all duration-150 px-2 py-1 w-full rounded-sm" @click="confirmDeletePost = false">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import moment from "moment";
const emit = defineEmits(["selectPost", "deletePost", "likePost", "bookmarkPost", "deleteBookmarkPost"]);
const { post } = defineProps(["post"]);
const toast = useToast();
const user = userStore();
const socket = useSocket();
const rooms = roomsStore();
const showPostMenu = ref(false);
const divComment = ref(undefined);
const comment = ref('');
const confirmDeletePost = ref(false);

const { data: delPost, error: errorDelPost, pending: pendingDelPost, execute: executeDelPost } = await deletePost(post._id);
const { data: like, error: errorLike, pending: pendingLike, execute: executeLike } = await likePost(post._id);
const { data: bookmark, error: errorBookmark, pending: pendingBookmark, execute: executeBookmark } = await bookmarkPost(post._id);
const { data: delBookmark, error: errorDelBookmark, pending: pendingDelBookmark, execute: executeDelBookmark } = await deleteBookmarkPost(post._id);
pendingDelPost.value = false;
pendingLike.value = false;
pendingBookmark.value = false;
pendingDelBookmark.value = false;

const handleLikePost = async () => {
    await executeLike();
    if (errorLike.value) {
        toast.value.push("Something went wrong when liking post");
    } else {
        emit("likePost", like.value);
    }
}

const handleBookmarkPost = async () => {
    await executeBookmark();
    if (errorBookmark.value) {
        toast.value.push("Cannot bookmark post");
        return;
    }
    emit("bookmarkPost", bookmark.value)
}

const handleDeleteBookmarkPost = async () => {
    await executeDelBookmark();
    if (errorDelBookmark.value) {
        toast.value.push("Cannot bookmark post");
        return;
    }
    emit("deleteBookmarkPost", delBookmark.value)
}

const handleDeletePost = async () => {
    await executeDelPost();
    if (errorDelPost.value) {
        toast.value.push("Something Wrong");
    } else {
        toast.value.push("Success Delete Post");
        emit("deletePost", delPost.value._id)
    }
}

const isOverflowing = ref(false);
const showLess = ref(false);
const descriptionContainer = ref(null);

const handleOverflowing = () => {
    descriptionContainer.value.classList.toggle("line-clamp-6");
    showLess.value = !showLess.value;
}

onMounted(() => {
    if (descriptionContainer.value.clientHeight < descriptionContainer.value.scrollHeight) {
        isOverflowing.value = true;
    }
})
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