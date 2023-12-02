export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.client) {
        document.documentElement.classList.add("dark")
        return;
    }
    let whitelist = ["login", "register"];
    if (whitelist.includes(to.name) || whitelist.includes(from.name)) return;
    if (await refreshLogin()) {
        const user = userStore();
        const socket = useSocket();
        user.$reset();
        if (socket.value.connected) {
            socket.value.disconnect();
        }
        return navigateTo("/login");
    }
})