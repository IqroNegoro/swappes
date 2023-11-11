<template>
    <div class="fixed top-0 left-0 bg-black/50 w-full h-full z-50" @click.self="$emit('closeUserFriends')">
        <Transition name="fade-right" appear>
            <div class="w-full flex flex-col md:w-1/2 lg:w-1/3 h-full dark:bg-dark-primary bg-white dark:text-white">
                <div class="px-4 flex flex-row justify-between items-center">
                    <p class="md:text-xl text-sm">
                        {{ name }} Friend's
                    </p>
                    <button class="hover:bg-dark-secondary rounded-full py-1 px-2 transition-all duration-150 right-0 m-4 flex justify-center items-center" @click="$emit('closeUserFriends')">
                        <i class="bx bx-x text-xl"></i>
                    </button>
                </div>
                <div class="flex flex-col gap-4 px-4 pb-2 h-full overflow-y-auto overscroll-contain light-scrollbar">
                    <TransitionGroup name="fade-up" appear v-if="friendLists.length">
                        <FriendList v-for="friend in friendLists" :key="friend._id" :friend="friend" :id="id" @deleted-friend="friend => friendLists = friendLists.filter(v => v._id != friend._id)" />
                    </TransitionGroup>
                    <h1 v-if="!friends.length && !friendLists.length && !pendingFriends"> This user doesnt have friends, be the first! </h1>
                    <div ref="fetchPoint"></div>
                    <template v-if="friends.length">
                        <FriendListSkeleton v-for="fren in 5" :key="fren" />
                    </template>
                </div>
            </div>
        </Transition>
    </div>
</template>
<script setup>
const { id, name } = defineProps(["id", "name"]);
const limit = ref(20);
const skip = ref(0);
const fetchPoint = ref(null);
const friendLists = ref([]);
const { data: friends, error: errorFriends, pending: pendingFriends, refresh: refreshFriends } = await getAllUserFriends(id, {
    params: {
        limit,
        skip
    },
});

onMounted(() => {
    if (fetchPoint.value) {
        useScroll(fetchPoint.value, () => {
            if (friends.value.length) {
                skip.value += 20
                friendLists.value = [...friendLists.value, ...friends.value]
            }
        })
    }
})

    
</script>
<style scoped>
.fade-right-enter-active,
.fade-right-leave-active {
    transition: all 0.25s ease
}

.fade-right-leave-to,
.fade-right-enter-from {
    @apply opacity-0 -translate-x-full
}
.fade-right-enter-to {
    @apply opacity-100 translate-x-0
}

.fade-up-enter-active,
.fade-up-leave-active {
    transition: all 0.25s ease;
    transition-delay: 0.25s;
}

.fade-up-leave-to,
.fade-up-enter-from {
    @apply opacity-0 translate-y-4
}
.fade-up-enter-to {
    @apply opacity-100 translate-y-0
}
</style>