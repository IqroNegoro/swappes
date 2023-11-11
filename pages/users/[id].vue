<template>
<div class="w-full flex justify-center flex-col items-center">
    <div v-if="showFullBanner" class="fixed top-0 left-0 flex justify-center items-center w-full h-screen bg-black/50 z-50 cursor-pointer" @click="showFullBanner = false">
        <img v-if="userData.banner?.url && !banner" :src="userData.banner?.url">
        <img v-else-if="!banner" :src="userData.banner?.url">
        <img v-else :src="renderImage(banner)">
    </div>
        <div class="cursor-pointer rounded-b-md relative flex justify-center items-center flex-col w-full">
            <div v-if="!userData.banner?.url && !banner" class="w-full h-48 bg-gradient-to-b from-transparent to-white/25"></div>
            <img v-else-if="!banner" :src="userData.banner?.url" alt="banner" class="object-top object-cover w-full max-h-96">
            <img v-else :src="renderImage(banner)" alt="" class="object-top object-cover w-full max-h-96">
            <div v-if="userData.banner?.url || banner" class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/25" @click.self="showFullBanner = true"></div>
            <div class="absolute right-0 bottom-0 m-4 flex flex-col gap-2">
                <label for="bannerInput" v-if="user._id == userData._id && !banner" class="cursor-pointer text-white flex justify-center items-center gap-2 rounded-md bg-black/30 hover:bg-black/40 duration-150 p-2">
                    <i class="bx bx-camera"></i>
                    <p class="max-md:hidden">Upload Banner</p>
                </label>
                <div v-if="banner" class="flex gap-2 flex-col">
                    <button class="cursor-pointer text-white flex justify-center items-center gap-2 rounded-md bg-black/30 hover:bg-black/40 duration-150 p-2" @click="handleBanner" :disabled="pendingBanner">
                        <i v-if="pendingBanner" class='bx bx-loader-alt bx-spin'></i>
                        <i v-else class="bx bx-upload"></i>
                        <p class="max-md:hidden">Upload Banner</p>
                    </button>
                    <button class="cursor-pointer w-max text-white flex justify-center items-center gap-2 rounded-md bg-black/30 hover:bg-black/40 duration-150 p-2" @click="banner = null" :disabled="pendingBanner">
                        <i class="bx bx-x"></i>
                        <p class="max-md:hidden">Cancel</p>
                    </button>
                </div>
                <input type="file" accept=".jpg,.jpeg,.webp,.png" id="bannerInput" class="hidden" @input="handleBannerFilter">
            </div>
        </div>
        <div class="dark:bg-dark-primary dark:text-white w-full flex flex-col md:grid grid-cols-3 grid-rows-1 justify-between items-center bg-white gap-4 px-8">
            <div class="max-md:-translate-y-28 flex justify-center items-center text-center gap-4 font-semibold">
                <p>
                    {{ posts.length }} <br>
                    Posts
                </p>
                <p>
                    {{ userData.friends }} <br>
                    Friends
                </p>
            </div>
            <div class="-translate-y-28 z-10 max-md:order-first text-center">
                <div class="relative">
                    <img v-if="!avatar" :src="userData.avatar?.url" alt="" class="rounded-full w-48 h-48 object-cover mx-auto object-center bg-white">
                    <img v-else :src="renderImage(avatar)" class="rounded-full w-48 h-48 mx-auto object-cover object-center bg-white">
                    <label v-if="user._id == userData._id" for="avatarInput" class="w-48 h-48 bg-black/25 cursor-pointer opacity-0 hover:opacity-100 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex justify-center items-center rounded-full transition-all duration-150">
                        <i class="bx bxs-camera-plus text-white text-4xl"></i>
                    </label>
                    <input type="file" accept=".jpg,.jpeg,.webp,.png" id="avatarInput" class="hidden" @input="handleAvatarFilter">
                    <Transition name="upload">
                        <div v-if="avatar" class="absolute left-3/4 top-1/2 flex flex-col gap-2 max-md:text-xs">
                            <button class="rounded-md w-max bg-white dark:bg-dark-primary dark:text-white p-2 shadow-lg flex justify-center items-center gap-2 font-semibold" @click="handleAvatar" :disabled="pendingAvatar">
                                <div class="bg-[rgba(48,48,48)] px-1 pt-1 text-white text-3xl rounded-md">
                                    <i v-if="pendingAvatar" class='bx bx-loader-alt bx-spin'></i>
                                    <i v-else class="bx bx-upload"></i>
                                </div>
                                Upload Avatar
                            </button>
                            <button class="rounded-md w-max bg-white dark:bg-dark-primary dark:text-white p-2 shadow-lg flex justify-center items-center gap-2 font-semibold" @click="avatar = null" :disabled="pendingAvatar">
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
                <NuxtLink :to="{name: 'login'}" class="text-center flex justify-center items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/75 transition-all duration-300 text-white dark:bg-dark-secondary mx-auto rounded-md" v-if="!user.authenticated">
                    <i class="bx bx-user-plus text-2xl"></i> Add Friends
                </NuxtLink>
                <button class="disabled:cursor-not-allowed flex justify-center items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/75 transition-all duration-300 text-white mx-auto rounded-md dark:bg-dark-secondary" v-if="user.authenticated && user._id != userData._id && userData.isFriend == null" :disabled="pendingFriendReq" @click="handleFriendRequest">
                    <p class="flex justify-center items-center gap-2">
                        <i v-if="pendingFriendReq" class="bx bx-loader-alt bx-spin"></i>
                        <i v-else class="bx bx-user-plus text-2xl"></i>
                        Add Friends
                    </p>
                </button>
                <div class="flex flex-col gap-2">
                    <button class="disabled:cursor-not-allowed flex justify-center items-center gap-2 px-4 py-2 bg-blue/50 hover:bg-blue/75 transition-all duration-300 text-white mx-auto rounded-md dark:bg-blue-500 dark:hover:bg-blue-600" v-if="user.authenticated && user._id != userData._id && userData.isFriend?.status == 0 && userData.isFriend?.to == user._id" @click="handleAcceptFriendRequest">
                        <p class="flex justify-center items-center gap-2">
                            <i v-if="pendingAcceptFriend" class="bx bx-loader-alt bx-spin"></i>
                            <i v-else class="bx bx-user-check text-2xl"></i>
                            Accept Request
                        </p>
                    </button>
                    <button class="disabled:cursor-not-allowed flex justify-center items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/75 transition-all duration-300 text-white mx-auto rounded-md dark:bg-dark-secondary" v-if="user.authenticated && user._id != userData._id && userData.isFriend?.status == 0" @click="handleDeleteFriend">
                        <p class="flex justify-center items-center gap-2">
                            <i v-if="pendingDelFriend" class="bx bx-loader-alt bx-spin"></i>
                            <i v-else class="bx bx-user-x text-2xl"></i>
                            Cancel Request
                        </p>
                    </button>
                </div>
                <button class="disabled:cursor-not-allowed flex justify-center items-center gap-2 px-4 py-2 transition-all duration-300 text-white mx-auto rounded-md bg-blue-500 hover:bg-blue-600" v-if="user.authenticated && user._id != userData._id && userData.isFriend?.status == 1" @click="handleDeleteFriend">
                    <p class="flex justify-center items-center gap-2">
                        <i v-if="pendingDelFriend" class="bx bx-loader-alt bx-spin"></i>
                        <i v-else class="bx bx-user-check text-2xl"></i>Friend
                    </p>
                </button>
            </div>
        </div>
        <div class="dark:text-white dark:bg-dark w-full mt-4 rounded-md lg:w-1/2 grid grid-cols-1 grid-flow-row gap-2 bg-white">
            <div class="w-full mx-auto rounded-md shadow-sm p-4 dark:text-white dark:bg-dark-primary bg-white">
                <div class="flex p-2 justify-between">
                    <h1 class="text-xl font-semibold">Friends</h1>
                    <button class="text-lg font-semibold" v-if="friends.length" @click="showUserFriends = true">See All Friends</button>
                </div>
                <div class="grid grid-cols-3 grid-flow-row gap-4"  v-if="friends.length">
                    <NuxtLink :to="{name: 'users-id', params: {id: friend.user._id}}" v-for="friend in friends.slice(0,9)" :key="friend._id">
                        <img :src="friend.user.avatar?.url" alt="" class="rounded-md w-full aspect-square object-center object-cover">
                        <p>{{friend.user.name}}</p>
                    </NuxtLink>
                </div>
                <div v-else class="text-center">
                    <h1>This user doesn't have friends, be the first one!</h1>
                </div>
            </div>
            <div class="grid grid-cols-1 grid-flow-row gap-2 dark:bg-dark-primary">
                <div class="rounded-md shadow-sm p-4 flex gap-4 dark:bg-dark-primary mt-2" v-if="user.authenticated && user._id == userData._id">
                    <img :src="user.avatar?.url" alt="" class="rounded-full w-12 h-12 object-cover aspect-square">
                    <button class="dark:text-white dark:bg-dark-secondary rounded-full w-full text-left bg-black/10 px-4 font-light outline-none" @click="createPostStatus = true">
                        Create post...
                    </button>
                </div>
                <!-- <div class="shadow-sm p-2 animate-pulse" v-if="postingStatus">
                    <h1 class="dark:text-white">Posting...</h1>
                </div> -->
                <PostSkeleton v-if="pendingPosts" />
                <div v-else-if="errorPosts" class="flex flex-col justify-center gap-2 items-center py-3">
                    <p class="dark:text-white">
                        Something Went Wrong
                    </p>
                    <button @click="refreshPosts" class="text-white bg-black/50 hover:bg-black/75 dark:bg-dark-secondary px-2 py-1 transition-all duration-300">Try Again</button>
                </div>
                <div v-else-if="!posts.length" class="flex justify-center dark:bg-dark-primary dark:text-white items-center flex-col bg-white shadow-md h-96">
                    <i class='bx bx-check text-7xl'></i>
                    <h1>It looks like you have been see all posts!</h1>
                    <button @click="refreshPosts" class="text-white bg-black/50 hover:bg-black/75 dark:bg-dark-secondary px-2 py-1 transition-all duration-300">Refresh</button>
                </div>
                <Post v-else v-for="post in posts" :key="post._id" :post="post" @delete-post="id => posts = posts.filter(v => v._id != id)" @like-post="likes => posts.find(v => v._id == likes._id).likes = likes.likes" @select-post="id => showSelectedPost = id" @edit-post="id => editPost = id" />
            </div>
        </div>
        <CreatePost v-if="createPostStatus" @new-post="post => posts.unshift(post)" @close-create-post-status="createPostStatus = false" />
        <EditPost v-if="editPost" :id="editPost" @updated-post="post => posts.findIndex(v => v._id == post._id) >= 0 ? posts.splice(posts.findIndex(v => v._id == post._id), 1, post) : ''" @close-edit-post="editPost = null" />
        <SelectedPost v-if="showSelectedPost" :id="showSelectedPost" @close-selected-post="showSelectedPost = null" @edit-post="id => {editPost = id; showSelectedPost = null}" />
    </div>
</template>
<script setup>
const { id } = useRoute().params;
const user = userStore();
const toast = useToast();

const showUserFriends = ref(false);
const createPostStatus = ref(false);
const editPost = ref(null);
const showSelectedPost = ref(null);
// const postingStatus = ref(false);
const avatar = ref(null);
const banner = ref(null);

const showFullBanner = ref(false);

const renderImage = file => URL.createObjectURL(file);

const { data: userData, error: userError, pending: pendingUser, refresh: refreshUser } = await getUserById(id);
if (!userData.value) {
    throw createError({statusCode: 404, statusMessage: "User Doesnt Exist"});
}

const { data: posts, error: errorPosts, pending: pendingPosts, refresh: refreshPosts } = await getUserPosts(id);
const { data: friends, error: errorFriends, pending: pendingFriends, refresh: refreshFriends } = await getUserFriends(id)
const { data: friendReq, error: errorFriendReq, pending: pendingFriendReq, execute: executeFriendReq } = await friendRequest(id)
const { data: acceptFriend, error: errorAcceptFriend, pending: pendingAcceptFriend, execute: executeAcceptFriend } = await acceptFriendRequest(id)
const { data: delFriend, error: errorDelFriend, pending: pendingDelFriend, execute: executeDelFriend } = await deleteFriend(id);

const pendingAvatar = ref(false);
const pendingBanner = ref(false);
pendingFriendReq.value = false;
pendingAcceptFriend.value = false;
pendingDelFriend.value = false;

const handleFriendRequest = async () => {
    await executeFriendReq();
    if (errorFriendReq.value) {
        toast.value.push("Something wrong, try again");
        return;
    }
    userData.value.isFriend = friendReq.value
}

const handleAcceptFriendRequest = async () => {
    await executeAcceptFriend();
    if (errorAcceptFriend.value) {
        toast.value.push("Something wrong, try again");
        return;
    }
    userData.value.isFriend.status = acceptFriend.value
}

const handleDeleteFriend = async () => {
    await executeDelFriend();
    if (errorDelFriend.value) {
        toast.value.push("Something wrong, try again");
        return;
    }
    userData.value.isFriend = null
}

const handleAvatarFilter = ({target}) => {
    if (!target.files.length) {
        avatar.value = null;
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

const handleBannerFilter = ({target}) => {
    if (!target.files.length) {
        banner.value = null;
        return;
    };

    const allowed = ["png", "jpg", "jpeg", "webp"]
    if (!allowed.includes(target.files[0].type.split("/")[1])) {
        toast.value.push("Please Select An Photo!");
        banner.value = null;
        return;
    }
    banner.value = target.files[0];
}

const handleBanner = async () => {
    pendingBanner.value = true;
    let formData = new FormData();
    formData.append("banner", banner.value);
    const { data, error, pending } = await uploadBanner(formData);
    pendingBanner.value = pending.value
    if (error.value) {
        toast.value.push("Cannot upload banner");
        return;
    }

    userData.value.banner = data.value
    user.$patch({
        banner: data.value
    })
    banner.value = null;

    toast.value.push("Banner images changed");
}

const handleAvatar = async () => {
    pendingAvatar.value = true;
    let formData = new FormData();
    formData.append("avatar", avatar.value);
    const { data, error, pending } = await uploadAvatar(formData);
    pendingAvatar.value = pending.value
    if (error.value) {
        toast.value.push("Cannot upload avatar");
        return;
    }

    userData.value.avatar = data.value
    user.$patch({
        avatar: data.value
    })
    avatar.value = null;

    toast.value.push("Profile images changed");
}

definePageMeta({
    layout: "full",
})

useSeoMeta({
    title: `${userData.value.name} in Swappes`,
    ogTitle: `${userData.value.name} in Swappes`,
    twitterTitle: `${userData.value.name} in Swappes`,
    description: `See ${userData.value.name} in Swappes`,
    ogDescription: `See ${userData.value.name} in Swappes`,
    twitterDescription: `See ${userData.value.name} in Swappes`,
    ogType: "website",
    ogSiteName: "Swappes",
    applicationName: "Swappes",
    twitterCard: "app",
    twitterImage: userData.value.avatar?.url,
    ogImage: userData.value.avatar?.url
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