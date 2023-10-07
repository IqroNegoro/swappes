export default defineNuxtRouteMiddleware(async (to, from) => {
    console.log(process.client, process.server)
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
        toast.value.push("Please log-in first!");
        user.$reset();
        return navigateTo("/login");
    }
    // refresh malah null token
    }
})