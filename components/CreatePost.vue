<template>
    <div class="fixed bg-black/50 top-0 left-0 w-full h-screen flex justify-center items-center overflow-auto z-20" @click.self="$emit('closeCreatePostStatus')">
        <div class="rounded-md w-full md:w-1/2 dark:bg-dark-primary dark:text-white bg-white flex flex-col p-1 relative">
            <div class="absolute top-0 left-0 w-full h-full bg-white/50 z-30" v-if="pending"></div>
            <div class="text-right flex justify-between items-center flex-row p-2">
                <div></div>
                <h1 class="font-bold text-xl">Create Post</h1>
                <button class="px-1 hover-bg rounded-full relative z-40" @click="$emit('closeCreatePostStatus')">
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
                <div contenteditable="true" ref="textarea" class="outline-none px-2 z-10 min-h-[8rem]" @input="({target}) => description = target.innerText"></div>
                <div v-if="images.length" class="grid gap-1 rounded-xl overflow-hidden" :class="{'grid-cols-1 grid-rows-1': images.length == 1, 'grid-cols-2 grid-rows-1': images.length == 2, 'grid-cols-2 grid-rows-2': images.length == 3, 'grid-cols-2 grid-rows-2': images.length == 4}">
                    <div class="relative" v-for="(image, i) in images" :key="i" :class="{'col-span-2': i == 0 && images.length == 3}">
                        <button class="absolute top-0 right-0 px-1 bg-white rounded-full m-1" @click="images.splice(i, 1)">
                            <i class="bx bx-x text-xl rounded-full"></i>
                        </button>
                        <img :src="renderImage(image)" :alt="image.name" class="w-full" :class="{'aspect-square object-cover object-top': images.length > 1}" draggable="false">
                    </div>
                </div>
            </div>
            <label for="imagesInput" class="w-max m-4 rounded-sm dark:bg-dark-secondary dark:hover:bg-white/30 bg-black/50 hover:bg-black/75 transition-all duration-150 py-1 px-2 text-white cursor-pointer">
                <i class='bx bxs-file-image'></i>
                Add Images Up To 4 Images
            </label>
            <input type="file" multiple name="images[]" accept=".jpg,.jpeg,.png,.webp" id="imagesInput" class="hidden" @input="handleInputFile">
            <button class="mx-auto w-1/2 py-2 text-white text-xl font-semibold dark:bg-dark-secondary dark:hover:bg-white/30 bg-black/50 hover:bg-black/75 transition-all duration-150 rounded-sm" :disabled="pending" @click="handlePost">
                Post
            </button>
        </div>
    </div>
</template>
<script setup>
const user = userStore();
const emit = defineEmits(["newPost", "postingStatus", "closeCreatePostStatus"])
const toast = useToast();
let { data, pending, error, refresh } = {};
const textarea = ref(null);
const description = ref("");
const images = ref([]);

const renderImage = file => URL.createObjectURL(file);

const handleInputFile = ({target}) => {
    let files = [...target.files];
    if (files.length) {
        if (files.length > 4) {
            toast.value.push("Cannot select images more than 4!");
            files.splice(4, files.length - 1);
        }

        const allowed = ["png", "jpg", "jpeg", "webp"]
        for (let file in files) {
            if (!allowed.includes(files[file].type.split("/")[1])) {
                toast.value.push("Please Select An Photo!");
                files = [];
                images.value = [];
                return;
            }
        }

        images.value = files;
    }
}

const handlePost = async () => {
    toast.value.push("Posting your post...");
    emit("closeCreatePostStatus");
    emit("postingStatus", true);
    let formData = new FormData();
    formData.append("description", description.value);
    for (let file of images.value) {
        formData.append("images", file)
    }
    ({ data, pending, error, refresh } = await createPost(formData));
    if (error.value) {
        toast.value.push("Something Went Wrong");
    } else {
        toast.value.push("Your post has been published");
        emit("newPost", data.value.post);
        images.value = [];
        description.value = "";
        textarea.value.innerText = "";
    }
    emit("postingStatus", false);
}
</script>