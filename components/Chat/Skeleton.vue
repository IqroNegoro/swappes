<template>
    <div class="flex flex-col h-full w-full justify-center items-center">
        <div class="w-full px-4 py-2">
            <div class="flex flex-row justify-start items-center gap-2">
                <div class="skeleton w-12 h-12 rounded-full"></div>
                <div class="skeleton w-48 h-4"></div>
            </div>
        </div>
        <div class="w-full h-full flex overflow-y-auto justify-end flex-col p-4 gap-4">
            <div class="relative h-8 w-64 skeleton rounded-md" :class="{'self-start': i % 2 == 0, 'self-end': i % 2 == 1}" v-for="i in 8" :key="i">
            </div>
        </div>
        <div class="relative w-full rounded-md shadow-sm p-4 flex justify-center items-center">
            <!-- <div ref="divComment" contenteditable="true" placeholder="Write your comment..." class="min-h-[40px] max-h-48 overflow-y-auto cursor-pointer rounded-lg w-full text-left bg-black/10 px-4 py-2 font-light outline-none" @input="({target}) => message = target.innerText" @keydown.ctrl.enter="handlePostComment" autofocus></div> -->
            <div class="w-full h-6 rounded-sm skeleton"></div>
        </div>
    </div>
</template>