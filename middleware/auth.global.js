export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.client) {
        document.documentElement.classList.add("dark")
    }
    if (process.server) {
        let whitelist = ["login", "register"];
        let whitelistPage = ["users-id"];
        if (whitelist.includes(to.name) || whitelist.includes(from.name)) return;
        if (await refreshLogin()) {
        const user = userStore();
        const toast = useToast();
        const socket = useSocket();
        toast.value.push("Please log-in first!");
        if (socket.value) {
            socket.value.disconnect();
        }
        user.$reset();
        return navigateTo("/login");
    }
    }
})