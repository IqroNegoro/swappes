export const login = async (email = '', password = '') => await useApi("login", {
    method: "POST",
    body: {
        email,
        password
    },
    key: "login"
})