<template>
    <Transition name="pop-down" appear mode="in-out">
        <div class="fixed top-4 md:top-0 md:left-0 flex flex-row gap-4 z-[99] rounded-md bg-white p-2 shadow-md w-max max-md:-translate-x-1/2 left-1/2 max-md:mt-3 md:m-4 dark:bg-dark-secondary dark:hover:bg-dark-secondary dark:text-white hover:bg-slate-200 transition-all duration-300 cursor-pointer">
            <div class="flex flex-row gap-3 items-center">
                <img :src="notification.from?.avatar?.url" class="rounded-full w-12 h-12 object-center object-cover" alt="">
                <div>
                    <p class="text-xs md:text-base">
                        <span class="font-semibold">
                            {{ notification.from.name }}
                        </span>
                        {{ notification.content }}
                    </p>
                    <span class="text-slate-500 text-xs dark:text-white/75 font-semibold">{{ moment(notification.createdAt).fromNow() }}</span>
                </div>
            </div>
            <button class="self-start rounded-full -translate-y-1" @click="notification = {}">
                <i class="bx bx-x text-xl rounded-full"></i>
            </button>
        </div>
    </Transition>
</template>
<script setup>
import moment from "moment";
const notification = useNotification();
</script>
<style scoped>
.pop-down-enter-active,
.pop-down-leave-active {
  transition: all 0.5s ease;
}

.pop-down-enter-from,
.pop-down-leave-to {
  opacity: 0;
  transform: translateY(-20px)
    }

</style>