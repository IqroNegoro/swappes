<template>
    <div class="fixed bg-black/50 top-0 left-0 w-full h-full flex justify-center items-center z-20" @click="$emit('closeSelectedPost')">
        <Transition name="fade-up" appear mode="in-out">
            <div ref="container" class="dark:bg-dark-primary dark:text-white relative md:rounded-md w-full md:w-3/4 lg:w-1/2 h-full md:max-h-[85%] overflow-hidden bg-white flex flex-col" @click.stop>
                <div class="relative flex justify-center items-center py-4">
                    <p class="font-semibold">{{post.user.name}} post</p>
                    <button class="flex justify-center items-center absolute top-0 right-0 m-2 text-2xl" @click="$emit('closeSelectedPost')">
                        <i class="bx bx-x"></i>
                    </button>
                </div>
                <div class="flex flex-col w-full h-full overflow-y-scroll overflow-x-hidden overscroll-contain rounded-scrollbar gap-2" ref="postContainer">
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
                            <button class="text-2xl pt-1 px-2 rounded-full" :class="{'bg-black/10': showPostMenu}" @click="showPostMenu = !showPostMenu">
                                <i class='bx bx-dots-horizontal-rounded'></i>
                            </button>
                            <div v-if="showPostMenu" class="absolute dark:bg-dark-primary dark:text-white top-full right-0 flex flex-col items-start w-48 bg-white z-10 rounded-lg shadow-md" @click="showPostMenu = false">
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
                    <div class="grid gap-1" :class="{'grid-cols-1 grid-rows-1': post.images.length == 1, 'grid-cols-2 grid-rows-1': post.images.length == 2, 'grid-cols-2 grid-rows-2': post.images.length == 3, 'grid-cols-2 grid-rows-2': post.images.length == 4}">
                        <NuxtLink :to="{name: `posts-id`, params: {id: post._id}}" v-for="(images, i) in post.images" :key="images.discordId" :class="{'col-span-2': i == 0 && post.images.length == 3}">
                            <img :src="images.images" alt="attachments" class="w-full overflow-hidden" :class="{'aspect-square object-cover object-top': post.images.length > 1, 'col-span-2 h-64': i == 0 && post.images.length == 3}" loading="lazy">
                        </NuxtLink>
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
                        <button class="mx-auto p-2 text-white text-md font-semibold dark:bg-dark-secondary bg-black/50 hover:bg-black/75 transition-all duration-150 rounded-sm" @click="refreshComments">
                            Try Again
                        </button>
                    </div>
                    <TransitionGroup appear tag="div" name="fade-up" class="p-4 flex flex-col gap-4" v-else-if="comments.length">
                        <Comment v-for="comment in comments" :comment="comment" :key="comment._id" @delete-comment="comment => comment.replyId ? comments = comments.filter(v => v._id == comment.replyId).reply.filter(v => v._id != comment._id) : comments = comments.filter(v => v._id != comment._id)" />
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
                <div class="relative w-full rounded-md shadow-sm p-4 gap-4 flex justify-center items-center flex-nowrap">
                    <div class="absolute top-0 left-0 w-full h-full bg-black/20 z-20" v-if="pendingSendComment"></div>
                    <img :src="user.avatar?.url" alt="" class="rounded-full w-8 h-8 object-cover">
                    <div ref="divComment" contenteditable="true" placeholder="Write your comment..." class="min-h-[40px] max-h-48 overflow-y-auto cursor-pointer rounded-lg w-full text-left bg-black/10 px-4 py-2 font-light outline-none" @input="({target}) => comment = target.innerText" @keydown.ctrl.enter="handlePostComment" autofocus></div>
                    <div class="flex">
                        <label for="imagesInput" class="cursor-pointer flex justify-center items-center px-1 text-xl">
                            <i class="bx bx-camera"></i>
                        </label>
                        <input ref="inputImage" type="file" name="image" accept=".jpg,.jpeg,.png,.webp" id="imagesInput" class="hidden" @input="handleInputFile">
                        <button class="flex justify-center items-center px-1 text-xl" @click="handlePostComment">
                            <i class="bx bx-send"></i>
                        </button>
                    </div>
                </div>
                <div class="relative w-full flex justify-center items-center overscroll-contain" v-if="image">
                    <button class="absolute dark:bg-dark-primary dark:text-white top-0 right-0 flex justify-center items-center px-1 bg-white rounded-full m-1" @click="() => {image = ''; inputImage.value = ''}">
                        <i class="bx bx-x text-xl rounded-full"></i>
                    </button>
                    <img :src="renderImage(image)" class="w-32">
                </div>
            </div>
        </Transition>
    </div>
</template>
<script setup>
import moment from "moment";
const emit = defineEmits(["deletePost", "likePost", "closeSelectedPost"]);
const { post } = defineProps(["post"]);
const toast = useToast();
const user = userStore();
const socket = useSocket();
const rooms = roomsStore();
const container = ref(undefined);
const inputImage = ref(undefined);
const divComment = ref(undefined);
const image = ref(null);
const postContainer = ref(undefined);
const comment = ref('');

const { data: comments, error: errorComments, pending: pendingComments, refresh: refreshComments } = await getCommentsPost(post._id);
const { data: like, error: errorLike, pending: pendingLike, execute: executeLike } = await likePost(post._id);
pendingLike.value = false;

const pendingSendComment = ref(false);

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

const handleLikePost = async () => {
    await executeLike();
    if (errorLike.value) {
        toast.value.push("Something went wrong when liking post");
    } else {
        emit("likePost", like.value);
    }
}

const handleDeletePost = async () => {
    const { data, error } = await deletePost(post._id);
    if (error.value) {
        toast.value.push("Something Wrong");
    } else {
        toast.value.push("Success Delete Post");
        emit("deletePost", post._id)
        emit("closeSelectedPost")
    }
}

const handlePostComment = async () => {
    if (!comment.value) return;
    pendingSendComment.value = true;
    let fd = new FormData();
    fd.append("comment", comment.value)
    fd.append("image", image.value)
    fd.append("post", post)
    const { data, error } = await commentPost(post._id, fd);
    pendingSendComment.value = false;
    if (error.value) {
        error.value.data.errors.forEach(v => {
            toast.value.push(v)
        })
    } else {
        if (!socket.value.connected) {
            comments.value.push(data.value)
        }
        divComment.value.innerHTML = "";
        comment.value = "";
        image.value = "";
        inputImage.value.value = []
        rooms.rooms.push(post._id);
        postContainer.value.scrollTop = postContainer.value.scrollHeight
    }
}

const isOverflowing = ref(false);
const showLess = ref(false);
const showPostMenu = ref(false);
const descriptionContainer = ref(null);

const handleOverflowing = () => {
    descriptionContainer.value.classList.toggle("line-clamp-6");
    showLess.value = !showLess.value;
}

const escClick = ({code}) => {
    if (code == "Escape") emit("closeSelectedPost");
}

onMounted(() => {
    document.addEventListener("keydown", escClick)
    socket.value.emit("join-post", post._id);
    socket.value.on("new-comment", comment => comment.replyId ? comments.value.find(v => v._id == comment.replyId).reply.push(comment) : comments.value.push(comment));
    socket.value.on("delete-comment", comment => comment.replyId ? comments.value.find(v => v._id == comment.replyId).reply = comments.value.find(v => v._id == comment.replyId).reply.filter(v => v._id != comment._id) : comments.value = comments.value.filter(v => v._id != comment._id));

    if (descriptionContainer.value.clientHeight < descriptionContainer.value.scrollHeight) {
        isOverflowing.value = true;
    }
})

onUnmounted(() => {
    document.removeEventListener("keydown", escClick)
    if (!rooms.joined(post._id)) {
        socket.value.emit("leave-post", post._id);
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