<template>
    <div class="flex flex-col lg:flex-row dark:bg-dark h-screen">
        <div class="w-full md:h-screen flex justify-center items-center relative lg:overflow-y-auto">
            <button @click="$router.back()" class="absolute top-0 left-0 m-2 px-1 flex justify-center items-center bg-dark-primary/50 hover:bg-dark-primary duration-150 transition-all hover:scale-105 rounded-full">
                <i class="bx bx-x dark:text-white text-2xl"></i>
            </button>
            <button class="absolute top-1/2 -translate-y-1/2 left-0 p-2 ml-1 flex justify-center items-center bg-dark-primary/50 hover:bg-dark-primary duration-150 transition-all hover:scale-105" v-if="post.images.length > 1" @click="indexImage == 0 ? indexImage = post.images.length - 1 : indexImage--">
                <i class='bx bxs-chevron-left text-xs md:text-3xl dark:text-white'></i>
            </button>
            <img :src="post.images[indexImage].images" :key="post.images[indexImage].discordId" alt="" class="max-w-full">
            <button class="absolute top-1/2 -translate-y-1/2 right-0 p-2 mr-1 flex justify-center items-center bg-dark-primary/50 hover:bg-dark-primary duration-150 transition-all hover:scale-105" v-if="post.images.length > 1" @click="indexImage == post.images.length - 1 ? indexImage = 0 : indexImage++">
                <i class='bx bxs-chevron-right text-xs md:text-3xl dark:text-white'></i>
            </button>
        </div>
        <div class="w-full lg:w-[28rem] h-full flex flex-col px-2 dark:bg-dark">
            <div class="flex flex-col w-full h-full pt-4 dark:text-white overflow-y-scroll overscroll-contain rounded-scrollbar gap-2" ref="postContainer">
                <div class="flex justify-between px-4">
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
                        <button class="text-2xl pt-1 px-2 rounded-full" :class="{'bg-black/10': showPostMenu}" @click="showPostMenu = !showPostMenu">
                            <i class='bx bx-dots-horizontal-rounded'></i>
                        </button>
                        <div v-if="showPostMenu" class="absolute dark:bg-dark-primary dark:dark:text-white top-full right-0 flex flex-col items-start w-48 bg-white z-10 rounded-lg shadow-md" @click="showPostMenu = false">
                            <button class="p-1 text-left font-semibold hover-bg w-full text-md flex justify-left rounded-lg items-center gap-2" v-if="user._id == post.user._id">
                                <i class='bx bx-pencil text-2xl'></i>
                                <p class="">
                                    Edit Post
                                </p>
                            </button>
                            <button class="p-1 text-left text-red-500 font-semibold hover-bg w-full text-md flex justify-left rounded-lg items-center gap-2" @click="handleDeletePost" v-if="user._id == post.user._id">
                                <i class="bx bx-trash text-2xl"></i>
                                <p class="">
                                    Delete Post
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="px-2 relative">
                    <p class="text-sm text-justify line-clamp-6 cursor-context-menu" ref="descriptionContainer" @click="handleOverflowing">
                        {{ post.description }}
                    </p>
                    <button class="text-sm text-blue-500" @click="handleOverflowing" v-if="isOverflowing && !showLess">
                        Read More...
                    </button>
                </div>
                <div class="px-2">
                    <i class="bx bx-like"></i> {{ post.likes.length }}
                    <i class="bx bx-chat"></i> {{ comments.length }}
                </div>
                <div class="flex flex-row justify-between p-2 dark:border-white/10 border-y border-black/10">
                    <button class="action-post" @click="handleLikePost">
                        <i class='bx bx-loader-alt bx-spin' v-if="pendingLike"></i>
                        <i class='bx bxs-like text-blue-500' v-else-if="post.likes.find(v => v._id == user._id)"></i>
                        <i class='bx bx-like' v-else></i>
                        <span>Like</span>
                    </button>
                    <button class="action-post">
                        <i class='bx bx-share bx-flip-horizontal'></i>
                        <span>Share</span>
                    </button>
                </div>
                <div v-if="pendingComments" class="flex flex-col justify-center items-center my-16 gap-2">
                    <i class="bx bx-loader-alt bx-spin text-5xl"></i>
                    <p>Load Comments...</p>
                </div>
                <div v-else-if="errorComments" class="flex flex-col justify-center items-center my-16 gap-2">
                    <i class='bx bx-error-circle text-5xl'></i>
                    <p>Something Wrong</p>
                    <button class="mx-auto p-2 dark:text-white text-md font-semibold dark:bg-dark-secondary bg-black/50 hover:bg-black/75 transition-all duration-150 rounded-sm" @click="refreshComments">
                        Try Again
                    </button>
                </div>
                <TransitionGroup appear tag="div" name="fade-up" class="p-4 flex flex-col gap-4" v-else-if="comments.length">
                    <Comment v-for="comment in comments" :comment="comment" :key="comment._id" @delete-comment="id => comments = comments.filter(v => v._id != id)" />
                    <!-- <div class="flex flex-row gap-2" v-for="comment in comments" :key="comment._id">
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
                                <button class="text-xs" v-if="comment.user._id == user._id" @click="handleDeleteComment">Delete</button>
                            </div>
                        </div>
                    </div> -->
                </TransitionGroup>
                <div v-else class="flex flex-col justify-center items-center my-16 gap-2">
                    <i class='bx bx-chat text-5xl'></i>
                    Be the first who comment on this post
                </div>
            </div>
            <div class="relative w-full rounded-md shadow-sm p-4 gap-4 flex justify-center items-center">
                <div class="absolute top-0 left-0 w-full h-full bg-black/20 z-20" v-if="pendingSendComment"></div>
                <img :src="user.avatar?.url" alt="" class="rounded-full w-8 h-8 object-cover">
                <div class="relative w-full">
                    <div ref="divComment" contenteditable="true" placeholder="Write your comment..." class="cursor-pointer rounded-lg w-full text-left bg-black/10 px-4 py-2 font-light outline-none dark:text-white" @input="({target}) => comment = target.innerText" @keydown.ctrl.enter="handlePostComment" autofocus></div>
                    <button class="absolute top-0 right-0 w-4 h-full flex justify-center items-center px-4" @click="handlePostComment">
                        <i class="bx bx-send dark:text-white"></i>
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

const { id } = useRoute().params;

const { data: post, pending, error, refresh } = await getPost(id);
const { data: comments, error: errorComments, pending: pendingComments, refresh: refreshComments } = await getCommentsPost(id);
const { data: like, error: errorLike, pending: pendingLike, execute: executeLike } = await likePost(id);
pendingLike.value = false;

const indexImage = ref(0);
const postContainer = ref(undefined);
const descriptionContainer = ref(undefined);
const divComment = ref(undefined);
const comment = ref("");
const rooms = roomsStore();

const isOverflowing = ref(false);
const showPostMenu = ref(false);
const pendingSendComment = ref(false);

const handleLikePost = async () => {
    await executeLike();
    if (errorLike.value) {
        toast.value.push("Something went wrong when liking post");
    } else {
        post.value.likes = like.value.likes
    }
}

const handlePostComment = async () => {
    if (!comment.value) return;
    pendingSendComment.value = true;
    const { data, error } = await commentPost(id, {
        comment: comment.value,
        images: "",
        post
    });
    pendingSendComment.value = false;
    if (error.value) {
        error.value.data.errors.forEach(v => {
            toast.value.push(v)
        })
    } else {
        if (!socket.value.connected) {
            comments.value.push(comment)
        }
        divComment.value.innerHTML = "";
        comment.value = "";
        rooms.rooms.push(id);
        postContainer.value.scrollTop = postContainer.value.scrollHeight
    }
}

definePageMeta({
    layout: ""
})

useSeoMeta({
    title: `${post.value.user.name}`,
    ogTitle: `${post.value.user.name}`,
    twitterTitle: `${post.value.user.name}`,
    description: post.value.description,
    ogDescription: post.value.description,
    twitterDescription: post.value.description,
    ogType: "website",
    ogSiteName: "Swappes",
    applicationName: "Swappes",
    twitterCard: "app",
    twitterImage: post.value.images[0]?.images,
    ogImage: post.value.images[0]?.images
})

useHead({
    title: `${post.value.description} | ${post.value.user.name} post | Swappes`
})

onMounted(() => {
    if (!rooms.joined(id)) {
        socket.value.emit("join-post", id);
    }
    socket.value.on("new-comment", comment => comment.replyId ? comments.value.find(v => v._id == comment.replyId).reply.push(comment) : comments.value.push(comment));
    socket.value.on("delete-comment", comment => comment.replyId ? comments.value.find(v => v._id == comment.replyId).reply = comments.value.find(v => v._id == comment.replyId).reply.filter(v => v._id != comment._id) : comments.value = comments.value.filter(v => v._id != comment._id));

    if (descriptionContainer.value.clientHeight < descriptionContainer.value.scrollHeight) {
        isOverflowing.value = true;
    }
})

onUnmounted(() => {
    if (!rooms.joined(id)) {
        socket.value.emit("leave-post", id);
    }
    socket.value.off("new-comment");
    socket.value.off("delete-comment");
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