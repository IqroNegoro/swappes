<template>
    <ChatSkeleton v-if="pendingUser || pendingMessages" />
    <div v-else class="flex flex-col h-full w-full justify-center items-center">
        <div class="w-full px-4 py-2">
            <div class="flex flex-row justify-start items-center gap-2">
                <button class="flex justify-center items-center" @click="$emit('closeChat')">
                    <i class="bx bx-arrow-back text-2xl"></i>
                </button>
                <img class="w-12 h-12 rounded-full object-cover object-center" :src="userData.avatar?.url" :alt="userData.name">
                <h1>{{ userData.name }}</h1>
            </div>
        </div>
        <div ref="box" class="w-full h-full overflow-y-scroll light-scrollbar flex flex-col p-4 gap-4">
            <p class="self-center px-4 py-2 bg-dark-secondary rounded-full" v-if="!messages.length">Ready for memorable moment?</p>
            <ChatMessage v-else v-for="message in messages" :key="message._id" :message="message" :class="{'self-end': user._id == message.user, 'self-start': user._id != message.user}" />
        </div>
        <div class="relative w-full rounded-md shadow-sm p-4 gap-4 flex flex-col justify-center items-center flex-nowrap">
            <div class="self-start text-xs relative" v-if="image">
                <button class="absolute top-0 left-0 opacity-0 hover:opacity-100 bg-black/50 w-full h-full flex justify-center items-center transition-opacity duration-150" @click="image = null">
                    <i class="bx bx-trash"></i>
                </button>
                <img :src="renderImage(image)" alt="" class="w-16 h-16 aspect-square object-cover object-center rounded-md">
            </div>
            <div class="flex flex-row justify-center items-center flex-nowrap relative w-full">
                <div ref="divComment" contenteditable="true" placeholder="Write your comment..." class="min-h-[40px] max-h-48 overflow-y-auto cursor-pointer rounded-lg w-full text-left bg-black/10 px-4 py-2 font-light outline-none" @input="({target}) => content = target.innerText" @keydown.ctrl.enter="handlePostMessage" autofocus></div>
                <div class="flex">
                    <label for="imagesInput" class="cursor-pointer flex justify-center items-center px-1 text-xl">
                        <i class="bx bx-camera"></i>
                    </label>
                    <input ref="inputImage" type="file" name="image" accept=".jpg,.jpeg,.png,.webp" id="imagesInput" class="hidden" @input="handleInputFile">
                    <button class="flex justify-center items-center px-1 text-xl" @click="handlePostMessage">
                        <i class="bx" :class="{'bx-send': !content.trim(), 'bxs-send': content.trim()}"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const { chat } = defineProps(["chat"]);
const socket = useSocket();
const toast = useToast();
const user = userStore();
const content = ref("");
const divComment = ref(false);
const image = ref(null);
const inputImage = ref(undefined);
const box = ref(undefined);
const pendingSendMessage = ref(false);

const renderImage = file => URL.createObjectURL(file);

const { data: userData, pending: pendingUser, error: errorUser, refresh: refreshUser } = await getUserById(chat.user._id);
const { data: messages, pending: pendingMessages, error: errorMessages, refresh: refreshMessages } = await getMessages(chat._id);

watch(box, val => {
    if (val) {
        box.value.scrollTo(0, box.value.scrollHeight)
    }
});

const handleInputFile = ({target}) => {
    const allowed = ["png", "jpg", "jpeg", "webp"]
    if (!allowed.includes(target.files[0].type.split("/")[1])) {
        toast.value.push("Please Select An Photo!");
        image.value = '';
        target.files = []
        return;
    }
    
    image.value = target.files[0];
    target.files = []
}

const handlePostMessage = async () => {
    if (!(content.value.trim() || image.value) || pendingSendMessage.value) return;
    pendingSendMessage.value = true;
    let fd = new FormData();
    fd.append("content", content.value)
    fd.append("image", image.value)
    const { data, error } = await sendMessage(chat._id, fd);
    pendingSendMessage.value = false;
    if (error.value) {
        error.value.data.errors.forEach(v => {
            toast.value.push(v)
        })
    } else {
        if (!socket.value.connected) {
            messages.value.push(data.value.message)
        }
        divComment.value.innerHTML = "";
        content.value = "";
        image.value = "";
        inputImage.value.value = []
        box.value.scrollTo(0, box.value.clientHeight)
    }
}

onMounted(() => {
    socket.value.emit("join-chat", chat._id);
    socket.value.on("new-message", message => {messages.value.push(message)});
})

onUnmounted(() => {
    socket.value.emit("leave-chat", chat._id);
    socket.value.off("new-message")
})
</script>