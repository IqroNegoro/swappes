export const userStore = defineStore("user", ({
    state: () => ({
        _id: undefined,
        name: undefined,
        email: undefined,
        avatar: {},
        banner: {},
        authenticated: false
    })
}))