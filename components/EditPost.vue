<template>
    <div class="fixed bg-black/50 top-0 left-0 w-full h-screen flex justify-center items-center overflow-auto z-20" @click.self="$emit('closeCreatePostStatus')">
        <div class="rounded-md w-full md:w-1/2 dark:bg-dark-primary dark:text-white bg-white flex flex-col p-1 relative">
            <SelectedPostSkeleton v-if="pendingPost" />
            <template v-else>
                <div class="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-white/10 z-50" v-if="pending">
                    <i class="bx bx-loader-alt bx-spin text-5xl"></i>
                </div>
                <div class="text-right flex justify-between items-center flex-row p-2">
                    <div></div>
                    <h1 class="font-bold text-xl">Edit Post</h1>
                    <button class="px-1 hover-bg rounded-full relative z-40" @click="$emit('closeEditPost')">
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
                <div class="min-h-[8rem] max-h-96 overflow-y-auto overscroll-contain">
                    <div contenteditable="true" ref="textarea" class="outline-none px-2 mb-4 z-10 min-h-[8rem]" @input="({target}) => description = target.innerText">{{post.description}}</div>
                    <div v-if="totalImages" class="grid gap-1 rounded-xl overflow-hidden" :class="{'grid-cols-1 grid-rows-1': totalImages == 1, 'grid-cols-2 grid-rows-1': totalImages == 2, 'grid-cols-2 grid-rows-2': totalImages == 3, 'grid-cols-2 grid-rows-2': totalImages == 4}">
                        <div class="relative" v-for="(image, i) in oldImages" :key="i" :class="{'col-span-2': i == 0 && totalImages == 3}">
                            <button class="absolute dark:bg-dark-primary dark:text-white top-0 right-0 flex justify-center items-center px-1 bg-white rounded-full m-1" @click="oldImages.splice(i, 1)">
                                <i class="bx bx-x text-xl rounded-full"></i>
                            </button>
                            <img :src="image.images" :alt="image.name" class="w-full" :class="{'aspect-square object-cover object-top': totalImages > 1}" draggable="false">
                        </div>
                        <div class="relative" v-for="(image, i) in newImages" :key="i" :class="{'col-span-2': i + oldImages.length == 0 && totalImages == 3}">
                            <button class="absolute dark:bg-dark-primary dark:text-white top-0 right-0 flex justify-center items-center px-1 bg-white rounded-full m-1" @click="newImages.splice(i, 1)">
                                <i class="bx bx-x text-xl rounded-full"></i>
                            </button>
                            <img :src="renderImage(image)" class="w-full" :class="{'aspect-square object-cover object-top': totalImages > 1}" draggable="false">
                        </div>
                    </div>
                </div>
                <label for="imagesInput" class="flex justify-center text-2xl items-center w-max m-4 rounded-sm dark:bg-dark-secondary dark:hover:bg-white/30 bg-black/50 hover:bg-black/75 transition-all duration-150 py-1 px-2 text-white cursor-pointer">
                    <i class='bx bxs-camera'></i>
                </label>
                <input type="file" multiple name="newImages[]" accept=".jpg,.jpeg,.png,.webp" id="imagesInput" class="hidden" @input="handleInputFile">
                <button class="dark:disabled:bg-transparent disabled:cursor-not-allowed mx-auto w-1/2 py-2 text-white text-xl font-semibold dark:bg-dark-secondary dark:hover:bg-white/30 bg-black/50 hover:bg-black/75 transition-all duration-150 rounded-sm" :disabled="pending || !(description || totalImages)" @click="handleUpdate">
                    Update
                </button>
            </template>
        </div>
    </div>
</template>
<script setup>
const emit = defineEmits(["updatedPost", "closeEditPost"])
const { id } = defineProps(["id"])
const user = userStore();
const toast = useToast();
const oldImages = ref([]);
const newImages = ref([]);

const pending = ref(false);

const { data: post, pending: pendingPost, error: errorPost, refresh: refreshPost } = await getPost(id, {
    lazy: true
});

const totalImages = computed(() => oldImages.value.length + newImages.value.length)

const textarea = ref(null);
const description = ref("");

const renderImage = file => URL.createObjectURL(file);

watch(post, (newVal, oldVal) => {
    description.value = newVal.description
    oldImages.value = newVal.images
})

const handleInputFile = ({target}) => {
    let files = [...target.files];
    if (files.length) {
        if (files.length + oldImages.value.length > 4) {
            toast.value.push("Cannot select images more than 4!");
            files.splice(files.length - oldImages.value.length);
        }

        const allowed = ["png", "jpg", "jpeg", "webp"]
        for (let file in files) {
            if (!allowed.includes(files[file].type.split("/")[1])) {
                toast.value.push("Please Select An Photo!");
                files = [];
                newImages.value = [];
                return;
            }
        }

        newImages.value = files;
    }
}

const handleUpdate = async () => {
    if (pending.value || !(description.value || totalImages.value)) return;
    pending.value = true;
    let formData = new FormData();
    formData.append("description", description.value);
    formData.append("oldImages", JSON.stringify(oldImages.value));
    for (let file of newImages.value) {
        formData.append("images", file);
    }

    const { data, error } = await updatePost(post.value._id, formData);
    if (error.value) {
        toast.value.push("Something Went Wrong");
    } else {
        toast.value.push("Your post has been updated");
        emit("updatedPost", data.value);
        newImages.value = [];
        description.value = "";
        textarea.value.innerText = "";
        emit("closeEditPost")
    }
    pending.value = false;
}
</script>