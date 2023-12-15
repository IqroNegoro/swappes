export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client) {
        const socket = useSocket();
        const user = userStore();
        if (user.authenticated) {
            if (!socket.value?.connected) {
                socket.value?.connect();
                socket.value.emit("join", user._id)
            }
        } else {
            socket.value?.disconnect();
        }
    }
})