<template>
    <div class="flex flex-row gap-2">
        <NuxtLink class="text-sm font-semibold" :to="{name: 'users-id', params: {id: comment.user._id}}">
            <img :src="comment.user.avatar?.url" :alt="comment.user.name" class="w-10 h-10 object-cover rounded-full">
        </NuxtLink>
        <div class="rounded-md bg-black/10 px-2 py-1">
            <NuxtLink class="text-sm font-semibold" :to="{name: 'users-id', params: {id: comment.user._id}}">{{comment.user.name}}</NuxtLink>
            <p class="text-sm text-justify" v-html="comment.comment"></p>
        </div>
    </div>
</template>
<script setup>
const { comment } = defineProps(["comment"]);
const emit = defineEmits([])
</script>