<template>
    <div class="mt-2 w-full min-h-screen flex justify-start items-start gap-8 p-4 flex-col dark:bg-dark-primary">
        <h1 class="dark:text-white gap-4 text-3xl flex-row">
            <i class="bx bx-bookmarks"></i>
            Bookmarks
        </h1>
        <div class="dark:text-white w-full flex flex-col justify-center items-center gap-2">
            <div v-if="errorBookmarks" class="flex justify-center items-center flex-col gap-4">
                <i class="bx bx-error text-5xl"></i>
                <h1 class="text-3xl">Something Wrong</h1>
                <button class="rounded-sm dark:bg-dark-secondary px-3 py-1" @click="refreshBookmarks">
                    Try Again
                </button>
            </div>
            <template v-if="bookmarkLists.length">
                <BookmarkList v-for="bookmark in bookmarkLists" :key="bookmark._id" :bookmark="bookmark" />
            </template>
            <p v-else>It's seems that you not bookmark anything, bookmarks now for see later~</p>
            <div ref="fetchPoint"></div>
            <template v-if="pendingBookmarks || bookmarks.length">
                <BookmarkListSkeleton v-for="bookmark in 5" :key="bookmark" />
            </template>
        </div>
    </div>
</template>
<script setup>
const skip = ref(0);
const limit = ref(10);
const fetchPoint = ref(null);
const bookmarkLists = ref([]);

const { data: bookmarks, error: errorBookmarks, pending: pendingBookmarks, refresh: refreshBookmarks } = await getBookmarks({
    params: {
        limit,
        skip
    }
});

watch(bookmarks, bookmarks => {
    bookmarkLists.value = [...bookmarkLists.value, ...bookmarks]
})

onMounted(() => {
    if (fetchPoint.value) {
        useScroll(fetchPoint.value, () => {
            if (bookmarks.value.length) {
                skip.value += limit.value;
            }
        })
    }
})

</script>