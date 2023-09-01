export const userStore = defineStore("user", ({
    state: () => ({
        _id: undefined,
        name: undefined,
        email: undefined,
        avatar: {},
        authenticated: false
        // _id: '64cca1b6f3659d15b7681d53',
        // name: 'Iqro Negoro',
        // email: 'iqronegoro0@gmail.com',
        // authenticated: true
    })
}))