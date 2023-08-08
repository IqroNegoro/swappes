<template>
    <div class="w-full shadow-md bg-white flex justify-center flex-col gap-2 py-1" v-if="post">
        <div class="flex justify-between px-4 pt-2">
            <div class="flex gap-2">
                <img src="https://w0.peakpx.com/wallpaper/981/51/HD-wallpaper-video-game-arknights-irene-arknights.jpg" alt="" class="rounded-full w-10 h-10 object-cover"> 
                <div>
                    <p class="text-sm font-bold">{{ post.user.name }}</p>
                    <p class="text-xs">{{ moment(post.createdAt).fromNow() }} &bull; <i class='bx bx-world'></i></p>
                </div>
            </div>
            <div class="relative">
                <button class="text-2xl" :class="{'bg-black/10': showPostMenu}" @click="showPostMenu = !showPostMenu">
                    <i class='bx bx-dots-horizontal-rounded'></i>
                </button>
                <div v-if="showPostMenu" class="absolute top-full right-0 flex flex-col items-start w-48 bg-white z-10 rounded-lg shadow-md" @click="showPostMenu = false">
                    <button class="p-1 text-left font-semibold hover-bg w-full text-md flex justify-left rounded-lg items-center gap-2">
                        <i class='bx bx-pencil text-2xl'></i>
                        <p class="">
                            Edit Post
                        </p>
                    </button>
                    <button class="p-1 text-left text-red-500 font-semibold hover-bg w-full text-md flex justify-left rounded-lg items-center gap-2" @click="handleDeletePost">
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
            <img v-for="(images, i) in post.images" :key="images.discordId" :src="images.images" alt="attachments" class="w-full overflow-hidden aspect-square object-cover object-top" :class="{'col-span-2': i == 0 && post.images.length == 3}">
        </div>
        <div class="flex flex-row justify-between p-2 border-y border-black/10">
            <button class="action-post">
                <i class='bx bx-like'></i>
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
    </div>
</template>
<script setup>
import moment from "moment";
const emit = defineEmits(["deletePost"]);
const { post } = defineProps(["post"]);
console.log(post.images);
const toast = useToast();

const handleDeletePost = async () => {
    const { data, error } = await deletePost(post._id);
    if (error.value) {
        console.log(error.value)
        toast.value = [...toast.value, "Something Wrong"];
    } else {
        toast.value = [...toast.value, "Success Delete Post"];
        emit("deletePost", post._id)
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

onMounted(() => {
    if (descriptionContainer.value.clientHeight < descriptionContainer.value.scrollHeight) {
        isOverflowing.value = true;
    }
})
</script>