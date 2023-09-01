export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = userStore();
    let whitelist = ["login", "register"];
    let whitelistPage = ["users-id"];
    console.log(whitelist.includes(to.name) || whitelist.includes(from.name))
    if (whitelist.includes(to.name) || whitelist.includes(from.name)) return;
    // if (!user.authenticated && whitelistPage.includes(to.name)) return;

    if (await refreshLogin()) {
        const user = userStore();
        const toast = useToast();
        toast.value.push("Please log-in first!");
        console.log("apa coba")
        user.$reset();
        return navigateTo("/login");
    }
})