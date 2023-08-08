<template>
    <div class="fixed bg-black/50 top-0 left-0 w-full h-screen flex justify-center items-center overflow-auto z-20">
        <div class="rounded-md w-full md:w-1/2 bg-white flex flex-col p-1 mt-96">
            <div class="text-right flex justify-between items-center flex-row p-2">
                <div></div>
                <h1 class="font-bold text-xl">Create Post</h1>
                <button class="px-1 hover-bg rounded-full" @click="$emit('closeCreatePostStatus')">
                    <i class="bx bx-x text-3xl rounded-full"></i>
                </button>
            </div>
            <div class="flex gap-2 p-4">
                <img src="https://w0.peakpx.com/wallpaper/981/51/HD-wallpaper-video-game-arknights-irene-arknights.jpg" alt="" class="rounded-full w-10 h-10 object-cover"> 
                <div>
                    <p class="text-sm font-bold">Iqro Negoro</p>
                    <i class="bx bx-world"></i>
                </div>
            </div>
            <div contenteditable="true" ref="textarea" class="outline-none px-2 z-10 min-h-[8rem]" @input="({target}) => description = target.innerText"></div>
            <div v-if="images.length" class="grid gap-1" :class="{'grid-cols-1 grid-rows-1': images.length == 1, 'grid-cols-2 grid-rows-1': images.length == 2, 'grid-cols-2 grid-rows-2': images.length == 3, 'grid-cols-2 grid-rows-2': images.length == 4}">
                <img v-for="(image, i) in images" :key="i" :src="image.src" :alt="image.name" class="w-full overflow-hidden aspect-square object-cover object-top" :class="{'col-span-2': i == 0 && image.length == 3}">
            </div>
            <label for="imagesInput" class="w-max m-4 rounded-sm bg-black/50 hover:bg-black/75 transition-all duration-150 py-1 px-2 text-white cursor-pointer">
                <i class='bx bxs-file-image'></i>
                Add Images Up To 4 Images
            </label>
            <input type="file" multiple name="images[]" accept=".jpg,.jpeg,.png,.webp" id="imagesInput" class="hidden" @input="handleInputFile">
            <button class="mx-auto w-1/2 py-2 text-white text-xl font-semibold bg-black/50 hover:bg-black/75 transition-all duration-150 rounded-sm" @click="handlePost">
                Post
            </button>
        </div>
    </div>
</template>
<script setup>
const emit = defineEmits(["newPost", "postingStatus", "closeCreatePostStatus"])
const toast = useToast();

const description = ref("");
const images = ref([]);

const handleInputFile = ({target}) => {
    if (target.files.length) {
        if (target.files.length > 4) {
            toast.value.push("Cannot select images more than 4!");
            target.value = "";
        }

        const allowed = ["png", "jpg", "jpeg", "webp"]
        for (let file of target.files) {
            if (!allowed.includes(file.type.split("/")[1])) {
                toast.value.push("Please Select An Photo!")
                target.value = "";
                return;
            }
        }

        images.value = useUrlImage(target.files);
    }
}

const handlePost = async () => {
    emit("postingStatus", true);
    const { data, pending, error, refresh } = await createPost({
        description
    });
    if (error.value) {
        toast.value = [...toast.value, "Something Went Wrong"];
    } else {
        console.log("aku enggak error");
        toast.value = [...toast.value, "Your post has been published"];
        emit("newPost", data.value.post);
    }
    emit("postingStatus", false);
    emit("closeCreatePostStatus");
}
</script>