<template>
    <div class="fixed bg-black/50 top-0 left-0 w-full h-screen flex justify-center items-center overflow-auto z-20">
        <div class="rounded-md w-full md:w-1/2 bg-white flex flex-col p-1 relative">
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
                    <div v-if="showPostMenu" class="absolute top-full right-0 flex flex-col items-start w-48 bg-white z-10 rounded-lg shadow-md" @click="showPostMenu = false">
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
                <img v-for="(images, i) in post.images" :key="images.discordId" :src="images.images" alt="attachments" class="w-full overflow-hidden" :class="{'aspect-square object-cover object-top': post.images.length > 1, 'col-span-2': i == 0 && post.images.length == 3}" loading="lazy">
            </div>
            <div class="px-2">
                <i class="bx bx-like"></i> {{ post.likes.length }}
                <i class="bx bx-chat"></i> 0
            </div>
            <div class="flex flex-row justify-between p-2 border-y border-black/10">
                <button class="action-post" @click="handleLikePost">
                    <i class='bx bx-loader-alt bx-spin' v-if="pendingLike"></i>
                    <i class='bx bx-like' v-else></i>
                    <span>Like</span>
                </button>
                <button class="action-post">
                    <i class='bx bx-chat'></i>
                    <span>Comment</span>
                </button>
                <button class="action-post">
                    <i class='bx bx-share bx-flip-horizontal'></i>
                    <span>Share</span>
                </button>
            </div>
            <div class="w-full rounded-md shadow-sm p-4 gap-4 bg-white flex justify-center items-center">
            <img :src="user.avatar?.url" alt="" class="rounded-full w-8 h-8 object-cover">
                <div class="relative w-full">
                    <div contenteditable="true" placeholder="Write your comment..." class="cursor-pointer rounded-lg w-full text-left bg-black/10 px-4 py-2 font-light outline-none"></div>
                    <button class="absolute top-0 right-0 w-4 h-full flex justify-center items-center px-4" @click="console.log('test')">
                        <i class="bx bx-send"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import moment from "moment";
const { post } = defineProps(["post"]);
const user = userStore();

</script>