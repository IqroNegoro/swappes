<template>
    <div class="w-full flex justify-center flex-col items-center bg-black/5">
        <div class="rounded-b-md relative flex justify-center items-center flex-col w-full h-72 bg-cover bg-top bg-no-repeat bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.75)),url('https://www.hdwallpapers.in/download/irene_female_anime_hd_arknights-HD.jpg')]"></div>
        <div class="w-full flex flex-col md:grid grid-cols-3 grid-rows-1 justify-between items-center bg-white gap-4 px-8">
            <div class="max-md:-translate-y-28 flex justify-center items-center text-center gap-4 font-semibold">
                <p>
                    {{ posts.posts.length }} <br>
                    Posts
                </p>
                <p>
                    0 <br>
                    Comments
                </p>
                <p>
                    0 <br>
                    Friends
                </p>
            </div>
            <div class="-translate-y-28 max-md:order-first text-center">
                <div class="relative">
                    <img v-if="!avatar" :src="userData.avatar.url" alt="" class="rounded-full w-48 h-48 object-cover mx-auto object-center bg-white">
                    <img v-else :src="renderImage(avatar)" class="rounded-full w-48 h-48 mx-auto object-cover object-center bg-white">
                    <label v-if="user._id == userData._id" for="avatarInput" class="w-48 h-48 bg-black/25 cursor-pointer opacity-0 hover:opacity-100 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex justify-center items-center rounded-full transition-all duration-150">
                        <i class="bx bxs-camera-plus text-white text-4xl"></i>
                    </label>
                    <input type="file" accept=".jpg,.jpeg,.webp,.png" id="avatarInput" class="hidden" @input="handleAvatarFilter">
                    <Transition name="upload">
                        <div v-if="avatar" class="absolute left-3/4 top-1/2 flex flex-col gap-2 max-md:text-xs">
                            <button class="rounded-md w-max bg-white p-2 shadow-lg flex justify-center items-center gap-2 font-semibold" @click="handleAvatar" :disabled="pendingAvatar">
                                <div class="bg-[rgba(48,48,48)] px-1 pt-1 text-white text-3xl rounded-md">
                                    <i v-if="pendingAvatar" class='bx bx-loader-alt bx-spin'></i>
                                    <i v-else class="bx bx-upload"></i>
                                </div>
                                Upload Avatar
                            </button>
                            <button class="rounded-md w-max bg-white p-2 shadow-lg flex justify-center items-center gap-2 font-semibold" @click="avatar = null" :disabled="pendingAvatar">
                                <div class="bg-[rgba(48,48,48)] px-1 pt-1 text-white text-3xl rounded-md">
                                    <i class="bx bx-x"></i>
                                </div>
                                Cancel
                            </button>
                        </div>
                    </Transition>
                </div>
                <h1 class="text-xl mt-8 ">{{userData.name}}</h1>
            </div>
            <div class="max-md:-translate-y-28">
                <NuxtLink :to="{name: 'login'}" class="text-center flex justify-center items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/75 transition-all duration-300 text-white mx-auto rounded-md" v-if="!user.authenticated">
                    <i class="bx bx-user-plus text-2xl"></i> Add Friends
                </NuxtLink>
                <button class="flex justify-center items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/75 transition-all duration-300 text-white mx-auto rounded-md" v-if="user.authenticated && user._id != userData._id">
                    <i class="bx bx-user-plus text-2xl"></i> Add Friends
                </button>
            </div>
        </div>
        <div class="w-full lg:w-1/2 grid grid-cols-1 grid-flow-row gap-2 bg-white mt-4">
            <div class="w-full rounded-md shadow-sm p-4 flex gap-4 bg-white" v-if="user.authenticated && user._id == userData._id">
                <img :src="user.avatar?.url" alt="" class="rounded-full w-12 h-12 object-cover">
                <button class="rounded-full w-full text-left bg-black/10 px-4 font-light outline-none" @click="createPostStatus = true">
                    Create post...
                </button>
            </div>
            <div class="shadow-sm p-2 animate-pulse" v-if="postingStatus">
                <h1>Posting...</h1>
            </div>
            <h1 class="text-xl ml-4 font-semibold mt-4">Posts</h1>
            <PostSkeleton v-if="pendingPosts" />
            <div v-else-if="errorPosts" class="flex flex-col justify-center items-center">
                Something Went Wrong
                <button @click="refreshPosts" class="text-white bg-black/50 hover:bg-black/75 px-2 py-1 transition-all duration-300">Try Again</button>
            </div>
            <div v-else-if="!posts.posts.length" class="flex justify-center items-center flex-col bg-white shadow-md h-96">
                <i class='bx bx-check text-7xl'></i>
                <h1>It looks like you have been see all posts!</h1>
                <button @click="refreshPosts" class="text-white bg-black/50 hover:bg-black/75 px-2 py-1 transition-all duration-300">Refresh</button>
            </div>
            <Post v-else v-for="post in posts.posts" :key="post._id" :post="post" @delete-post="id => posts.posts = posts.posts.filter(v => v._id != id)" @like-post="likes => posts.posts.find(v => v._id == likes._id).likes = likes.likes"  />
            <CreatePost v-show="createPostStatus" @new-post="post => posts.posts.unshift(post)" @close-create-post-status="createPostStatus = false" @posting-status="status => postingStatus = status" />
        </div>
    </div>
</template>
<script setup>
const { id } = useRoute().params;
const user = userStore();
const toast = useToast();

const createPostStatus = ref(false);
const postingStatus = ref(false);
const avatar = ref(null);

const renderImage = file => URL.createObjectURL(file);

const { data: userData, error: userError, pending: pendingUser, refresh: refreshUser } = await getUserById(id);

console.log(userData.value)
if (!userData.value) {
    throw createError({statusCode: 404, statusMessage: "User Doesnt Exist"});
}

const { data: posts, error: errorPosts, pending: pendingPosts, refresh: refreshPosts } = await getUserPosts(id);

const pendingAvatar = ref(false);

console.log(userData.value, posts.value)

const handleAvatarFilter = ({target}) => {
    if (!target.files.length) {
        avatar.value = "";
        return;
    };

    const allowed = ["png", "jpg", "jpeg", "webp"]
    if (!allowed.includes(target.files[0].type.split("/")[1])) {
        toast.value.push("Please Select An Photo!");
        avatar.value = null;
        return;
    }
    avatar.value = target.files[0];
}

const handleAvatar = async () => {
    pendingAvatar.value = true;
    let formData = new FormData();
    formData.append("avatar", avatar.value);
    const { data, error, pending } = await uploadAvatar(formData);
    pendingAvatar.value = pending.value
    console.log(data.value, error.value, pendingAvatar.value)
    if (error.value) {
        console.log(error.value)
        toast.value.push("Cannot upload avatar");
        return;
    }

    userData.value.avatar = data.value.data
    user.$patch({
        avatar: data.value.data
    })
    avatar.value = null;

    toast.value.push("Profile images changed");
}

definePageMeta({
    layout: "full",
})

useHead({
    title: !userData.value ? "Not Found" : `${userData.value.name} in Swappes`
})
</script>
<style scoped>
.upload-enter-active,
.upload-leave-active {
    transition: all 0.25s ease
}

.upload-leave-to,
.upload-enter-from {
    @apply opacity-0 translate-y-4
}
.upload-enter-to {
    @apply opacity-100 translate-y-0
}

</style>