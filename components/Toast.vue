<template>
    <div class="fixed bottom-0 left-0 m-4 flex flex-col gap-4 z-[99]">
        <div class="dark:bg-dark-primary dark:text-white rounded-md bg-white p-4 shadow-md w-max" :style="{'z-index': i}" v-for="(message, i) in toast" :key="i">
            <button class="ml-auto block px-1 rounded-full" @click="toast = toast.filter((v, ii) => ii != i)">
                <i class="bx bx-x text-xl rounded-full"></i>
            </button>
            <p class="font-semibold mr-12">{{ message }}</p>
        </div>
    </div>
</template>
<script setup>
const toast = useToast();
</script>