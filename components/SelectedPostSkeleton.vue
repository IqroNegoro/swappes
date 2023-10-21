<template>
    <div class="flex flex-col h-full">
        <div class="relative flex justify-center items-center py-4">
            <p class="skeleton w-48 h-6"></p>
        </div>
        <div class="flex flex-col h-full w-full overflow-y-scroll overflow-x-hidden overscroll-contain rounded-scrollbar gap-2">
            <div class="flex justify-between px-4 pt-2">
                <div class="flex gap-2">
                    <div alt="" class="rounded-full w-10 h-10 object-cover skeleton"></div>
                    <div class="flex flex-col gap-2">
                        <p class="skeleton w-48 h-3"></p>
                        <p class="skeleton w-32 h-3"></p>
                    </div>
                </div>
            </div>
            <div class="px-2 relative flex flex-col gap-3">
                <p class="skeleton w-48 h-2"></p>
                <p class="skeleton w-32 h-2"></p>
                <p class="skeleton w-48 h-2"></p>
                <p class="skeleton w-40 h-2"></p>
            </div>
            <div class="w-full h-80 skeleton rounded-sm"></div>
        </div>
        <div class="w-full rounded-md shadow-sm p-4 gap-4 flex justify-center items-center flex-nowrap">
            <div class="rounded-full w-8 h-8 object-cover skeleton"></div>
            <div class="min-h-[40px] max-h-48 rounded-lg w-full skeleton bg-black/10 px-4 py-2 font-light"></div>
        </div>
    </div>
</template>