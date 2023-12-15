<template>
    <div ref="container" class="dark:text-white fixed top-0 left-0 h-full w-full flex flex-row max-md:snap-x max-md:snap-mandatory max-md:overflow-x-scroll md:grid md:grid-rows-1 md:grid-cols-[minmax(0,1fr),minmax(0,2fr)] dark:bg-dark-primary">
        <div class="flex flex-col max-md:w-full max-md:shrink-0 max-md:snap-center">
            <div class="p-4 flex justify-start items-center w-full gap-4">
                <NuxtLink :to="{name: 'index'}" class="text-2xl flex justify-center items-center">
                    <i class="bx bx-arrow-back"></i>
                </NuxtLink>
                <h1 class="font-semibold text-2xl">Chats</h1>
            </div>
            <div class="flex flex-col overflow-y-auto h-full light-scrollbar">
                <template v-if="pendingChats">
                    <ChatListSkeleton v-for="i in 10" :key="i"  />
                </template>
                <div v-if="!chats.length">
                    <h1 class="text-center">Start send message with someone!</h1>
                </div>
                <ChatList v-else v-for="chat in chats" :key="chat._id" :chat="chat" :user="user" @click="selectedChat = chat" />
            </div>
        </div>
        <div v-if="!selectedChat" class="max-md:w-full max-md:shrink-0 max-md:snap-center flex flex-col justify-center items-center">
            <i class="bx bx-conversation text-7xl"></i>
            <p>Select someone to start chat</p>
        </div>
        <Chat v-else :chat="selectedChat" @close-chat="selectedChat = undefined" class="max-md:w-full max-md:shrink-0 max-md:snap-center" />
    </div>
</template>
<script setup>
const user = userStore();
const selectedChat = ref(undefined);
const socket = useSocket();
const container = ref(undefined);

const { data: chats, pending: pendingChats, error: errorChat, refresh: refreshChat } = await getChats();

onMounted(() => {
    const audio = new Audio("/sfx/messages.mp3");
    socket.value.on("new-chat", async chat => {
        const old = chats.value.find(v => v._id == chat._id);
        if (old) {
            old.lastMessage = chat.lastMessage;
            old.updatedAt = chat.updatedAt;
            chats.value = chats.value.sort(v => v.updatedAt);
            if (chat.lastMessage.user != user._id) audio.play();
        } else {
            await refreshChat();
            audio.play();
        }
    });
    socket.value.on("delete-latest-message", message => chats.value.find(v => v._id == message.chat && v.lastMessage.message?._id == message._id) ? chats.value.find(v => v._id == message.chat && v.lastMessage.message._id == message._id).lastMessage.message = null : "");
});

onUnmounted(() => {
    socket.value.off("new-chat");
    socket.value.off("delete-latest-message")
})

definePageMeta({
    layout: "",
})

useHead({
    title: "Chats"
})
</script>