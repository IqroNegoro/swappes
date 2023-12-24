<template>
    <div class="fixed bg-black/50 top-0 left-0 w-full h-screen flex justify-center items-center overflow-auto z-20">
        <div class="rounded-md  w-full max-md:h-full md:w-1/2 dark:bg-dark-primary dark:text-white bg-white flex flex-col p-4 relative">
            <div v-if="pendingUpdate" class="absolute flex justify-center items-center top-0 left-0 w-full h-full bg-white/25">
                <i class="bx bx-loader-alt bx-spin text-5xl"></i>
            </div>
            <div class="text-right flex justify-between items-center flex-row">
                <div></div>
                <h1 class="font-bold text-xl">Setting</h1>
                <button class="px-1 hover-bg rounded-full relative z-40" @click="isSetting = false">
                    <i class="bx bx-x text-3xl rounded-full"></i>
                </button>
            </div>
            <div class="light-scrollbar h-full md:min-h-[8rem] md:max-h-[32rem] pr-1 overflow-y-auto flex flex-col gap-2">
                <h1 class="font-semibold text-xl">Profile Picture</h1>
                <div class="flex justify-center items-center">
                    <label for="avatar" class="cursor-pointer">
                        <div v-if="!avatar && !data.avatar?.url" class="rounded-full w-48 h-48 mx-auto bg-dark aspect-square"></div>
                        <img v-else-if="avatar" :src="renderImage(avatar)" alt="" class="w-48 h-48 aspect-square rounded-full self-center object-cover object-center">
                        <img v-else :src="data.avatar?.url" alt="" class="w-48 h-48 aspect-square rounded-full self-center object-cover object-center">
                    </label>
                    <input type="file" accept=".jpg,.jpeg,.webp,.png" id="avatar" class="hidden" @input="handleAvatarFilter">
                </div>
                <h1 class="font-semibold text-xl">Profile Banner</h1>
                <div class="flex justify-center items-center">
                    <label for="banner" class="cursor-pointer">
                        <div v-if="!banner && !data.banner?.url" class="rounded-md w-96 h-48 mx-auto bg-dark aspect-video"></div>
                        <img v-else-if="banner" :src="renderImage(banner)" alt="" class="rounded-md w-96 mx-auto object-cover object-center aspect-video">
                        <img v-else :src="data.banner?.url" alt="" class="rounded-md w-96 mx-auto object-cover object-center  aspect-video">
                    </label>
                    <input type="file" accept=".jpg,.jpeg,.webp,.png" id="banner" class="hidden" @input="handleBannerFilter">
                </div>
                <h1 class="font-semibold text-xl">Profile Information</h1>
                <div class="w-full flex justify-center items-center flex-col">
                    <h1 class="text-lg font-semibold">Name</h1>
                    <div contenteditable="true" class="outline-none px-2 mb-4 z-10 min-h-max" ref="nameInput" @input="({target}) => name = target.innerText">{{data.name}}</div>
                </div>
            </div>
            <div class="flex justify-center items-center pt-2">
                <button class="dark:disabled:bg-transparent disabled:cursor-not-allowed mx-auto w-1/2 py-2 text-white text-xl font-semibold dark:bg-dark-secondary dark:hover:bg-white/30 bg-black/50 hover:bg-black/75 transition-all duration-150 rounded-sm" @click="handleUpdate" :disabled="name == data.name && !(avatar || banner)">
                    Update
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
const user = userStore();
const isSetting = settingStatus();
const toast = useToast();
const name = ref(null);
const avatar = ref(null);
const banner = ref(null);
const nameInput = ref(undefined);

const { data, pending, error, refresh } = await getUserById(user._id);
name.value = data.value.name
const pendingUpdate = ref(false);

const renderImage = file => URL.createObjectURL(file);

const handleAvatarFilter = ({target}) => {
    if (!target.files.length) {
        avatar.value = null;
        return;
    };

    const allowed = ["png", "jpg", "jpeg", "webp"]
    if (!allowed.includes(target.files[0].type.split("/")[1])) {
        toast.value.push("Please Select An Photo!");
        target.files = "";
        avatar.value = null;
        return;
    }
    avatar.value = target.files[0];
}

const handleBannerFilter = ({target}) => {
    if (!target.files.length) {
        banner.value = null;
        return;
    };

    const allowed = ["png", "jpg", "jpeg", "webp"]
    if (!allowed.includes(target.files[0].type.split("/")[1])) {
        toast.value.push("Please Select An Photo!");
        target.files = "";
        banner.value = null;
        return;
    }
    banner.value = target.files[0];
}

const handleUpdate = async () => {
    if (name.value == data.value.name && !(avatar.value || banner.value)) return;
    pendingUpdate.value = true;
    const fd = new FormData();
    fd.append("name", name.value);
    fd.append("avatar", avatar.value);
    fd.append("banner", banner.value);
    const { data: updated, error } = await updateProfile(fd);

    pendingUpdate.value = false;
    if (error.value) {
        error.value.data.errors.forEach(v => toast.value.push(v))
        return;
    }
    user.$patch({
        ...updated.value
    });
    avatar.value = null;
    banner.value = null;
    data.value = {...data.value, ...updated.value}
    name.value = data.value.name;
    toast.value.push("Profile Updated");
}
</script>