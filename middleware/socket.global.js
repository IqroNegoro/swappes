export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client) {
        let whitelist = ["login", "register"];
        if (whitelist.includes(to.name)) return;
        const socket = useSocket();
        if (!socket.value.connected) {
            socket.value.connect();
        }
    }
})