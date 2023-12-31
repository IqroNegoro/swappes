<template>
    <div class="grid grid-cols-1 grid-flow-row gap-2">
        <div class="rounded-md shadow-sm p-4 flex gap-4 dark:bg-dark-primary mt-2">
            <img v-if="user.avatar?.url" :src="user.avatar?.url" alt="" class="rounded-full w-12 h-12 object-cover aspect-square">
            <div v-else class="rounded-full w-10 h-10 bg-dark-secondary"></div>
            <button class="dark:text-white dark:bg-dark-secondary rounded-full w-full text-left bg-black/10 px-4 font-light outline-none" @click="createPostStatus = true">
                Create post...
            </button>
        </div>
        <div v-if="error" class="flex flex-col justify-center gap-2 items-center py-3">
            <p class="dark:text-white">
                Something Went Wrong
            </p>
            <button @click="refresh" class="text-white bg-black/50 hover:bg-black/75 dark:bg-dark-secondary px-2 py-1 transition-all duration-300">Try Again</button>
        </div>
        <div v-else-if="!pending && !postsList.length && !posts.length" class="flex justify-center dark:bg-dark-primary dark:text-white items-center flex-col bg-white shadow-md h-96">
            <i class='bx bx-check text-7xl'></i>
            <h1>It looks like you have been see all posts!</h1>
            <button @click="refresh" class="text-white bg-black/50 hover:bg-black/75 dark:bg-dark-secondary px-2 py-1 transition-all duration-300">Refresh</button>
        </div>
        <Post v-else v-for="post in postsList" :key="post._id" :post="post" @delete-post="id => postsList = postsList.filter(v => v._id != id)" @like-post="likes => postsList.find(v => v._id == likes._id).likes = likes.likes" @select-post="id => showSelectedPost = id" @edit-post="id => editPost = id" @bookmark-post="bookmark => postsList.find(v => v._id == bookmark.post).bookmark = bookmark" @delete-bookmark-post="bookmark => postsList.find(v => v.bookmark?._id == bookmark._id).bookmark = null" @share-post="id => sharePost = id" />
        <div ref="fetchPoint"></div>
        <PostSkeleton v-show="posts.length >= limit || pending" />
        <LazyCreatePost v-if="createPostStatus" @new-post="post => postsList.unshift(post)" @close-create-post-status="createPostStatus = false" />
        <LazyEditPost v-if="editPost" :id="editPost" @updated-post="post => postsList.findIndex(v => v._id == post._id) >= 0 ? postsList.splice(postsList.findIndex(v => v._id == post._id), 1, {...post, share: postsList.find(v => v._id == post._id).share}) : ''" @close-edit-post="editPost = null" />
        <LazySelectedPost v-if="showSelectedPost" :id="showSelectedPost" @delete-post="id => {posts = postsList.filter(v => v._id != id); showSelectedPost = null}" @close-selected-post="showSelectedPost = null" @like-post="likes => postsList.find(v => v._id == likes._id).likes = likes.likes" @edit-post="id => {editPost = id; showSelectedPost = null}" @bookmark-post="bookmark => postsList.find(v => v._id == bookmark.post).bookmark = bookmark" @delete-bookmark-post="bookmark => postsList.find(v => v.bookmark?._id == bookmark._id).bookmark = null" @share-post="id => sharePost = id" @update-comment="post => postsList.find(v => v._id == post._id).comments = post.comments" />
        <LazySharePost v-if="sharePost" :id="sharePost" @close-share-status="sharePost = null" />
    </div>
</template>
<script setup>
const user = userStore();
const skip = ref(0);
const limit = ref(10);
const fetchPoint = ref(undefined);
const postsList = ref([]);
const createPostStatus = ref(false);
const editPost = ref(null);
const showSelectedPost = ref(null);
const sharePost = ref(null);

const { data: posts, pending, error, refresh } = await useFetch("posts", {
    params: {
        skip,
        limit
    },
    default: () => [],
    transform: res => res.data,
    lazy: true,
    headers: useRequestHeaders(["cookie"]),
    credentials: "include",
    baseURL: process.env.NODE_ENV === "production" ? "https://api.swappes.my.id/" : "http://localhost:3001/"
});

watch(posts, posts => {
    postsList.value = [...postsList.value, ...posts]
});

onMounted(() => {
    useScroll(fetchPoint.value, () => {
        if (postsList.value.length && posts.value.length >= limit.value && !pending.value) {
            skip.value += limit.value;
        }
    })
})

useHead({
    title: "Swappes"
})
</script>