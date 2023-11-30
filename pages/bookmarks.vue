<template>
    <div class="mt-2 w-full min-h-screen flex gap-8 p-4 flex-col dark:bg-dark-primary">
        <h1 class="dark:text-white gap-4 text-3xl flex-row">
            <i class="bx bx-bookmarks"></i>
            Bookmarks
        </h1>
        <div class="dark:text-white w-full flex flex-col gap-2">
            <BookmarkListSkeleton v-if="pendingBookmarks" />
            <div v-else-if="errorBookmarks" class="flex justify-center items-center flex-col gap-4">
                <i class="bx bx-error text-5xl"></i>
                <h1 class="text-3xl">Something Wrong</h1>
                <button class="rounded-sm dark:bg-dark-secondary px-3 py-1" @click="refreshBookmarks">
                    Try Again
                </button>
            </div>
            <div v-else-if="!bookmarkLists.length && !bookmarks.length">It's seems that you not bookmark anything, bookmarks now for see later~</div>
            <BookmarkList v-else v-for="bookmark in bookmarkLists" :key="bookmark._id" :bookmark="bookmark" />
            <div ref="fetchPoint"></div>
            <template v-if="bookmarks.length >= limit">
                <BookmarkListSkeleton v-for="bookmark in 6" :key="bookmark" />
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
        skip,
        limit
    }
});


watch(bookmarks, bookmarks => {
    bookmarkLists.value = [...bookmarkLists.value, ...bookmarks]
})

onMounted(() => {
    if (fetchPoint.value) {
        useScroll(fetchPoint.value, () => {
            if (bookmarkLists.value.length && bookmarks.value.length) {
                skip.value += limit.value;
            }
        })
    }
})

</script>