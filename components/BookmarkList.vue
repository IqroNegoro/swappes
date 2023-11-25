<template>
    <NuxtLink :to="{name: 'posts-id', params: {id: bookmark.post._id}}" class="group w-full p-2 flex flex-row justify-between items-center hover:bg-dark-secondary duration-300 rounded-md cursor-pointer truncate">
        <div class="flex flex-row justify-start items-center h-full gap-4">
            <div v-if="bookmark.post.images" class="w-24 h-24 md:w-48 md:h-36 rounded-md overflow-hidden grid gap-1" :class="{'grid-cols-1 grid-rows-1': bookmark.post.images.length == 1, 'grid-cols-2 grid-rows-1': bookmark.post.images.length == 2, 'grid-cols-2 grid-rows-2': bookmark.post.images.length == 3, 'grid-cols-2 grid-rows-2': bookmark.post.images.length == 4}">
                <img v-for="(images, i) in bookmark.post.images" :key="images.discordId" :src="images.images" alt="attachments" class="w-full h-full overflow-hidden cursor-pointer object-cover object-top" :class="{'aspect-square max-h-96': bookmark.post.images.length > 1, 'col-span-2 object-center': i == 0 && bookmark.post.images.length == 3}" loading="lazy">
            </div>
            <div v-else class="w-48 h-24 rounded-sm bg-dark-secondary"></div>
            <div class="flex flex-col justify-between gap-3 h-full">
                <div class="flex flex-col gap-2">
                    <h1 class="font-semibold truncate">
                    {{ bookmark.post.description }}
                    </h1>
                    <span class="text-sm flex items-center flex-row gap-2">
                        <i class="bx bx-time text-xl"></i>
                        {{ moment(bookmark.createdAt).fromNow() }}
                    </span>
                </div>
                <NuxtLink :to="{name: 'users-id', params: {id: bookmark.post?.user?._id}}" class="flex flex-row gap-4 justify-start items-center">
                    <img :src="bookmark.post?.user?.avatar?.url" :alt="bookmark.post?.user?.name" class="w-8 h-8 rounded-full aspect-square object-cover">
                    <p class="font-semibold"> {{ bookmark.post?.user?.name }} </p>
                </NuxtLink>
            </div>
        </div>
        <i class="bx bx-chevron-right text-3xl duration-300 -translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100"></i>
    </NuxtLink>
</template>
<script setup>
import moment from "moment";
const { bookmark } = defineProps(["bookmark"]);
</script>