export const login = async (email = '', password = '') => await useApi("login", {
    method: "POST",
    body: {
        email,
        password
    },
    key: "login"
})

export const refreshLogin = async () => {
    let { data, error } = await useApi("refresh", {
        method: "POST",
        key: "refresh"
    })
    if (error.value) return true;
    const user = userStore();
    user.$patch({
        ...data.value,
        authenticated: true
    });
    return false;
}