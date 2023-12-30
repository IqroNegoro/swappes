export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.client) {
        document.documentElement.classList.add("dark")
    }
    
    let { data, error } = await useApi("info", {
        key: "info",
    })

    const user = userStore();
    const socket = useSocket();

    if (error.value) {
        if (process.env.NODE_ENV === "development") {
            console.log("error", error.value)
        }
        user.$reset();
        socket.value?.disconnect();
        if (to.name != "login" && from.name != "login") return await navigateTo("/login");
    }

    if (data.value) {
        if (process.env.NODE_ENV === "development") {
            console.log("data", data.value)
        }
        user.$patch({
            ...data.value,
            authenticated: true
        });
        if (to.name == "login") return await navigateTo("/");
    }
})