<template>
    <div class="flex flex-col gap-4 border rounded-md mx-2">
        <div class="flex items-center gap-2 px-1">
            <NuxtLink :to="{name: 'users-id', params: {id: post.user._id}}">
                <img :src="post.user.avatar?.url" alt="" class="rounded-full w-8 h-8 object-cover"> 
            </NuxtLink>
            <div>
                <NuxtLink :to="{name: 'users-id', params: {id: post.user._id}}" class="text-sm font-bold">{{ post.user.name }}</NuxtLink>
                <p class="text-xs">{{ moment(post.createdAt).fromNow() }} &bull; <i class='bx bx-world'></i></p>
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
            <div v-for="(images, i) in post.images" :key="images.discordId" :class="{'col-span-2': i == 0 && post.images.length == 3}">
                <img :src="images.images" alt="attachments" class="w-full overflow-hidden" :class="{'aspect-square object-cover object-top': post.images.length > 1, 'col-span-2 h-64': i == 0 && post.images.length == 3}" loading="lazy">
            </div>
        </div>
    </div>
</template>
<script setup>
import moment from "moment";
const { post } = defineProps(["post"]);
const descriptionContainer = ref(undefined);
const showLess = ref(false);
const isOverflowing = ref(false);

const handleOverflowing = () => {
    descriptionContainer.value.classList.toggle("line-clamp-6");
    showLess.value = !showLess.value;
}

onMounted(() => {
    if (descriptionContainer.value?.clientHeight < descriptionContainer.value?.scrollHeight) {
        isOverflowing.value = true;
    }
})
</script>