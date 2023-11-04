<template>
    <div class="flex flex-row gap-4 items-center">
        <NuxtLink :to="{name: 'users-id', params: {id: friend.user._id}}" class="flex flex-row gap-4 items-center">
            <img :src="friend.user.avatar?.url" class="w-14 h-14 rounded-full aspect-square object-cover object-center bg-black" alt="" />
            <div>
                <p class="font-semibold">{{ friend.user.name }}</p>
                <p class="text-sm">Friend Since <span class="font-semibold">{{ moment(friend.updatedAt).format("MMMM YYYY") }}</span></p>
            </div>
        </NuxtLink>
        <div class="ml-auto" v-if="user._id == id">
            <button class="bg-red-500 hover:bg-red-600 transition-all duration-150 text-xl rounded-sm text-white flex justify-center items-center p-2" @click="confirmUnfriend = true">
                <i class="bx bx-user-x"></i>
            </button>
        </div>
        <div class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/50 z-50 overscroll-none" v-if="confirmUnfriend">
            <div class="dark:bg-dark-primary dark:text-white rounded-md bg-white p-4 shadow-md w-max">
                <button class="ml-auto block px-1 rounded-full" @click="confirmUnfriend = false">
                    <i class="bx bx-x text-xl rounded-full"></i>
                </button>
                <p>Are you sure to unfriend {{friend.user.name}}?</p>
                <div class="flex flex-row justify-around gap-2 mt-2">
                    <button class="dark:hover:bg-dark dark:bg-dark-secondary transition-all duration-150 px-2 py-1 w-full rounded-sm" @click="handleUnfriend">Unfriend</button>
                    <button class="dark:hover:bg-dark dark:bg-dark-secondary transition-all duration-150 px-2 py-1 w-full rounded-sm" @click="confirmUnfriend = false">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import moment from "moment"
const user = userStore();
const toast = useToast();
const confirmUnfriend = ref(false);
const emit = defineEmits(["deletedFriend"]);
const { friend, id } = defineProps(["friend", "id"])
const { data: unfriend, error: errorUnfriend, pending: pendingUnfriend, execute: executeUnfriend } = await deleteFriend(friend.user._id);
const handleUnfriend = async () => {
    await executeUnfriend();
    if (errorUnfriend.value) {
        toast.value.push("Something wrong, try again");
        return;
    }
    emit("deletedFriend", unfriend.value)
}
</script>