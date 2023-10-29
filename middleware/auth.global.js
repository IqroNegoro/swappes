export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.client) {
        document.documentElement.classList.add("dark")
        return;
    }
    let whitelist = ["login", "register"];
    console.log(process.client, process.server)
    console.log(to.name, from.name)
    if (whitelist.includes(to.name) || whitelist.includes(from.name)) return;
    if (await refreshLogin()) {
        const user = userStore();
        const socket = useSocket();
        if (socket.value) {
            socket.value.disconnect();
        }
        user.$reset();
        return navigateTo("/login");
    }
})