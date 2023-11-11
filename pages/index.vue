<template>
    <div class="grid grid-cols-1 grid-flow-row gap-2 dark:bg-dark-primary">
        <div class="rounded-md shadow-sm p-4 flex gap-4 dark:bg-dark-primary mt-2">
            <img :src="user.avatar?.url" alt="" class="rounded-full w-12 h-12 object-cover aspect-square">
            <button class="dark:text-white dark:bg-dark-secondary rounded-full w-full text-left bg-black/10 px-4 font-light outline-none" @click="createPostStatus = true">
                Create post...
            </button>
        </div>
        <button class="dark:bg-dark-secondary dark:text-white mx-auto w-1/2 py-2 text-white text-md font-semibold bg-black/50 hover:bg-black/75 transition-all duration-150 rounded-sm" :disabled="pending" @click="refresh">
            Refresh New Post
        </button>
        <!-- <div class="shadow-sm p-2 animate-pulse" v-if="postingStatus">
            <h1 class="dark:text-white">Posting...</h1>
        </div> -->
        <PostSkeleton v-if="pending" />
        <div v-else-if="error" class="flex flex-col justify-center gap-2 items-center py-3">
            <p class="dark:text-white">
                Something Went Wrong
            </p>
            <button @click="refresh" class="text-white bg-black/50 hover:bg-black/75 dark:bg-dark-secondary px-2 py-1 transition-all duration-300">Try Again</button>
        </div>
        <div v-else-if="!posts.length" class="flex justify-center dark:bg-dark-primary dark:text-white items-center flex-col bg-white shadow-md h-96">
            <i class='bx bx-check text-7xl'></i>
            <h1>It looks like you have been see all posts!</h1>
            <button @click="refresh" class="text-white bg-black/50 hover:bg-black/75 dark:bg-dark-secondary px-2 py-1 transition-all duration-300">Refresh</button>
        </div>
        <Post v-else v-for="post in posts" :key="post._id" :post="post" @delete-post="id => posts = posts.filter(v => v._id != id)" @like-post="likes => posts.find(v => v._id == likes._id).likes = likes.likes" @select-post="id => showSelectedPost = id" @edit-post="id => editPost = id" @bookmark-post="bookmark => posts.find(v => v._id == bookmark.post).bookmark = bookmark" @delete-bookmark-post="bookmark => posts.find(v => v.bookmark?._id == bookmark._id).bookmark = null" />
        <CreatePost v-if="createPostStatus" @new-post="post => posts.unshift(post)" @close-create-post-status="createPostStatus = false" />
        <EditPost v-if="editPost" :id="editPost" @updated-post="post => posts.findIndex(v => v._id == post._id) >= 0 ? posts.splice(posts.findIndex(v => v._id == post._id), 1, post) : ''" @close-edit-post="editPost = null" />
        <SelectedPost v-if="showSelectedPost" :id="showSelectedPost" @delete-post="id => {posts = posts.filter(v => v._id != id); showSelectedPost = null}" @close-selected-post="showSelectedPost = null" @edit-post="id => {editPost = id; showSelectedPost = null}" />
    </div>
</template>
<script setup>
const user = userStore();
const { data: posts, pending, error, refresh } = await getPosts();
console.log(posts.value)
const createPostStatus = ref(false);
const editPost = ref(null);
const showSelectedPost = ref(null);
// const postingStatus = ref(false);

useHead({
    title: "Swappes"
})
</script>