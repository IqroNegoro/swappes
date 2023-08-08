export const userStore = defineStore("user", ({
    state: () => ({
        _id: '',
        name: '',
        email: '',
        token: '',
        authenticated: false
    })
}))