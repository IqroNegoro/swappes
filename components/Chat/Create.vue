<template>
    <div class="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex justify-center items-center">
        <div v-if="pending" class="dark:bg-dark-primary dark:text-white relative md:rounded-md w-full md:w-3/4 lg:w-1/2 h-full md:max-h-[85%] overflow-hidden bg-white flex flex-col justify-between p-4 items-center">
            <div class="flex flex-col gap-4 justify-center items-center">
                <div class="w-48 h-48 rounded-full skeleton"></div>
                <p class="skeleton w-full h-4"></p>
            </div>
            <div class="relative w-full rounded-md shadow-sm p-4 gap-4 flex justify-center items-center flex-nowrap">
                <div class="skeleton rounded-sm w-full h-8"></div>
            </div>
        </div>
        <div v-else ref="container" class="dark:bg-dark-primary dark:text-white relative md:rounded-md w-full md:w-3/4 lg:w-1/2 h-full md:max-h-[85%] overflow-hidden bg-white flex flex-col justify-between p-4 items-center">
            <button class="flex justify-center items-center absolute top-0 right-0 m-2 text-2xl" @click="$emit('closeCreateChat')">
                <i class="bx bx-x"></i>
            </button>
            <div class="flex flex-col justify-center items-center gap-2">
                <img :src="user.avatar?.url" :alt="user.name" class="w-48 h-48 object-center object-cover rounded-full" loading="lazy">
                <p class="font-semibold text-xl">{{user.name}}</p>
                <h1 class="text-center">Your profile and messages will be can see after send message</h1>
            </div>
            <div class="flex flex-col justify-center md:w-1/2 w-full">
                <div class="flex flex-row justify-center items-center gap-3 self-start">
                    <img :src="user.avatar?.url" alt="" class="rounded-full w-12 h-12 object-center object-cover">                
                    <p class="bg-dark-secondary p-2 rounded-md self-start">Cihuyyy</p>
                </div>
                <div v-if="messageSend" class="flex flex-row justify-center items-center gap-3 self-end">
                    <p class="bg-dark-secondary p-2 rounded-md self-end">{{ messageSend }}</p>
                    <img :src="avatar?.url" alt="" class="rounded-full w-12 h-12 object-center object-cover">                
                </div>
            </div>
            <div class="relative w-full rounded-md shadow-sm p-4 gap-4 flex justify-center items-center flex-nowrap">
                <div class="absolute top-0 left-0 w-full h-full bg-black/20 z-20" v-if="pendingSendMessage || messageSend"></div>
                <NuxtLink v-if="messageSend" :to="{name: 'chats'}" class="px-2 py-1 bg-dark-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    To the chats
                </NuxtLink>
                <div ref="divComment" contenteditable="true" placeholder="Write your messages..." class="min-h-[40px] max-h-48 overflow-y-auto cursor-pointer rounded-lg w-full text-left bg-black/10 px-4 py-2 font-light outline-none" @input="({target}) => content = target.innerText" @keydown.ctrl.enter="handlePostMessage" autofocus></div>
                <div class="flex">
                    <button class="flex justify-center items-center px-1 text-xl" @click="handlePostMessage" :disabled="pendingSendMessage">
                        <i class="bx" :class="{'bx-send': !content.trim(), 'bxs-send': content.trim()}"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const { id } = defineProps(["id"]);
const container = ref(undefined);
const divComment = ref(undefined);
const content = ref("");
const avatar = userStore().avatar;
const toast = useToast();
const messageSend = ref("");

const { data: chat, error: errorChat } = await checkChat(id);

if (!errorChat.value) {
    await navigateTo("/chats");
}

const { data: user, pending, error, refresh } = await getUserById(id, {lazy: true});

const pendingSendMessage = ref(false);
const handlePostMessage = async () => {
    if (pendingSendMessage.value || messageSend.value) return;
    pendingSendMessage.value = true;
    const { data, error } = await createChat({
        user: user.value._id,
        content: content.value,
    })
    pendingSendMessage.value = false;
    if (error.value) {
        toast.value.push("Something went wrong");
        return;        
    }
    messageSend.value = content.value;
    content.value = "";
    divComment.value.innerHTML = ""
    divComment.value.blur();
}
</script>
<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px)
}

</style>