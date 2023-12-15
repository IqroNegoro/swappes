<template>
    <div class="fixed bg-black/50 top-0 left-0 w-full h-screen flex justify-center items-center overflow-auto z-20">
        <div class="rounded-md w-full md:w-1/2 dark:bg-dark-primary dark:text-white bg-white flex flex-col gap-1 pb-2 relative">
            <div class="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-white/10 z-50" v-if="pending">
                <i class="bx bx-loader-alt bx-spin text-5xl"></i>
            </div>
            <div class="text-right flex justify-between items-center flex-row p-2">
                <div></div>
                <h1 class="font-bold text-xl">Share Post</h1>
                <button class="px-1 hover-bg rounded-full relative z-40" @click="$emit('closeShareStatus')">
                    <i class="bx bx-x text-3xl rounded-full"></i>
                </button>
            </div>
            <div class="flex gap-2 p-4">
                <img :src="user.avatar?.url" alt="" class="rounded-full w-10 h-10 object-cover"> 
                <div>
                    <p class="text-sm font-bold">{{ user.name }}</p>
                    <i class="bx bx-world"></i>
                </div>
            </div>
            <div class="min-h-[8rem] max-h-96 overflow-y-auto">
                <div contenteditable="true" ref="textarea" class="outline-none px-2 mb-4 z-10 min-h-[8rem]" @keydown.ctrl.enter="handlePost" @input="({target}) => description = target.innerText"></div>
                <SelectedPostSkeleton v-if="pendingPost" />
                <div v-else-if="errorPost" class="flex justify-center items-center flex-col gap-4 my-4">
                    <i class="bx bx-error-circle text-7xl"></i>
                    <h1>Something Wrong</h1>
                    <button class="rounded-sm dark:bg-dark-secondary px-3 py-1" @click="refreshPost">
                        Reload
                    </button>
                </div>
                <div v-else class="flex flex-col gap-4 border rounded-md">
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
            </div>
            <button class="dark:disabled:bg-transparent disabled:cursor-not-allowed mx-auto w-1/2 py-2 text-white text-xl font-semibold dark:bg-dark-secondary dark:hover:bg-white/30 bg-black/50 hover:bg-black/75 transition-all duration-150 rounded-sm" :disabled="pending" @click="handlePost">
                Share
            </button>
        </div>
    </div>
</template>
<script setup>
import moment from "moment";
const user = userStore();
const emit = defineEmits(["closeShareStatus"])
const { id } = defineProps(["id"]);
const toast = useToast();
const pending = ref(false);
const textarea = ref(null);
const description = ref("");

const isOverflowing = ref(false);
const showLess = ref(false);
const container = ref(false);
const descriptionContainer = ref(null);

const handleOverflowing = () => {
    descriptionContainer.value.classList.toggle("line-clamp-6");
    showLess.value = !showLess.value;
}

const { data: post, pending: pendingPost, error: errorPost, refresh: refreshPost } = await getPost(id, {
    lazy: true
})

const handlePost = async () => {
    if (pending.value) return;
    pending.value = true;

    const { data, error } = await createPost({
        description: description.value,
        share: post.value._id,
        isShare: true
    });

    pending.value = false;

    if (error.value) {
        toast.value.push("Something Went Wrong");
    } else {
        toast.value.push("Post shared");
        description.value = "";
        textarea.value.innerText = "";
        emit("closeShareStatus")
    }
}
</script>