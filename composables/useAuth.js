export const register = async (name = '', email = '', password = '') => await useApi("register", {
    method: "POST",
    body: {
        name,
        email,
        password
    },
    key: "register",
});

export const login = async (email = '', password = '') => await useApi("login", {
    method: "POST",
    body: {
        email,
        password
    },
    key: "login",
})

export const logout = async () => {
    let { data, error } = await useApi("logout", {
        method: "DELETE",
        key: "logout"
    });
    
    const toast = useToast();
    
    if (error.value) {
        toast.value.push(`Something Went Wrong, ${error.value.statusCode}`)
        return;
    }
    
    const socket = useSocket();
    const user = userStore();
    user.$reset();
    socket.value?.disconnect();
    toast.value.push("Logout Success")
    return navigateTo("/login");
};