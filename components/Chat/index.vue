<template>
    <div class="flex flex-col h-full w-full justify-center items-center">
        <div v-if="pendingUser" class="w-full px-4 py-2">
            <div class="flex flex-row justify-start items-center gap-2">
                <div class="skeleton w-12 h-12 rounded-full"></div>
                <div class="skeleton w-48 h-4"></div>
            </div>
        </div>
        <div v-else class="w-full px-4 py-2 shadow-lg">
            <div class="flex flex-row justify-start items-center gap-2">
                <button class="flex justify-center items-center" @click="$emit('closeChat')">
                    <i class="bx bx-arrow-back text-2xl"></i>
                </button>
                <img class="w-12 h-12 rounded-full object-cover object-center" :src="userData.avatar?.url" :alt="userData.name">
                <h1>{{ userData.name }}</h1>
            </div>
        </div>
        <div ref="box" class="w-full h-full overflow-y-scroll light-scrollbar flex flex-col p-4 gap-4">
            <template v-if="messages.length >= limit">
                <div class="relative h-8 p-4 w-64 skeleton rounded-md" :class="{'self-start': i % 2 == 0, 'self-end': i % 2 == 1}" v-for="i in 8" :key="i"></div>
            </template>
            <div ref="fetchPoint" class=""></div>
            <p class="self-center px-4 py-2 bg-dark-secondary rounded-full" v-if="!messages.length && !messageLists.length && !pendingMessages">Ready for memorable moment?</p>
            <TransitionGroup v-else name="fade-up">
                <ChatMessage v-for="message in messageLists" :key="message._id" :message="message" :user="user" :class="{'self-end': user._id == message.user, 'self-start': user._id != message.user}" />
            </TransitionGroup>
        </div>
        <div class="relative w-full rounded-md shadow-sm p-4 gap-4 flex flex-col justify-center items-center flex-nowrap">
            <div class="self-start text-xs relative" v-if="image">
                <button class="absolute top-0 left-0 opacity-0 hover:opacity-100 bg-black/50 w-full h-full flex justify-center items-center transition-opacity duration-150" @click="image = null">
                    <i class="bx bx-trash"></i>
                </button>
                <img :src="renderImage(image)" alt="" class="w-16 h-16 aspect-square object-cover object-center rounded-md">
            </div>
            <div v-if="pendingUser" class="relative w-full rounded-md shadow-sm p-4 flex justify-center items-center">
                <div class="w-full h-6 rounded-sm skeleton"></div>
            </div>
            <div v-else class="flex flex-row justify-center items-center flex-nowrap relative w-full">
                <div class="absolute top-0 left-0 w-full h-full bg-black/20 z-20" v-if="pendingSendMessage"></div>
                <div ref="divComment" contenteditable="true" placeholder="Write your message..." class="min-h-[40px] max-h-48 overflow-y-auto cursor-pointer rounded-lg w-full text-left bg-black/10 px-4 py-2 font-light outline-none" @input="({target}) => content = target.innerText" @keydown.ctrl.enter="handlePostMessage"></div>
                <div class="flex">
                    <label for="imagesInput" class="cursor-pointer flex justify-center items-center px-1 text-xl">
                        <i class="bx bx-camera"></i>
                    </label>
                    <input ref="inputImage" type="file" name="image" accept=".jpg,.jpeg,.png,.webp" id="imagesInput" class="hidden" @input="handleInputFile">
                    <button class="flex justify-center items-center px-1 text-xl" @click="handlePostMessage">
                        <i v-if="pendingSendMessage" class="bx bx-loader-alt bx-spin"></i>
                        <i v-else class="bx" :class="{'bx-send': !content.trim(), 'bxs-send': content.trim()}"></i>
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

const skip = ref(0);
const limit = ref(20);
const fetchPoint = ref(null);
const messageLists = ref([]);

const renderImage = file => URL.createObjectURL(file);

const { data: userData, pending: pendingUser, error: errorUser, refresh: refreshUser } = await getUserById(chat.user._id);
const { data: messages, pending: pendingMessages, error: errorMessages, refresh: refreshMessages } = await getMessages(chat._id, {
    params: {
        skip,
        limit
    },
});

watch(messages, messages => {
    messageLists.value = [...messages.sort((a,b) => +new Date(a.createdAt) - +new Date(b.createdAt)), ...messageLists.value]
}, {
    immediate: true
})

watch(box, box => {
    if (box) {
    setTimeout(() => {
            box.scrollTo(0, 99999)
        }, 500)
    }
})

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
    const { data, error } = await sendMessage(chat._id ?? chat.user._id, fd);
    pendingSendMessage.value = false;
    if (error.value) {
        error.value.data.errors.forEach(v => {
            toast.value.push(v)
        })
    } else {
        if (!socket.value.connected) {
            messageLists.value.push(data.value.message)
        }
        divComment.value.innerHTML = "";
        content.value = "";
        image.value = "";
        inputImage.value.value = []
        await nextTick();
        box.value.scrollTo(0, 99999)
    }
}

onMounted(() => {
    socket.value.emit("join-chat", chat._id);
    socket.value.on("new-message", message => messageLists.value.push(message));
    socket.value.on("delete-message", message => messageLists.value = messageLists.value.filter(v => v._id != message._id));
    socket.value.on("readed-message", message => messageLists.value.find(v => v._id == message._id).isRead = true);
    useScroll(fetchPoint.value, () => {
        if (messageLists.value.length && messages.value.length >= limit.value && !pendingMessages.value) {
            skip.value += limit.value;
        }
    });
})

onUnmounted(() => {
    socket.value.emit("leave-chat", chat._id);
    socket.value.off("new-message")
    socket.value.off("delete-message")
    socket.value.off("readed-message");
})
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