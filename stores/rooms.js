export const roomsStore = defineStore("rooms", ({
    state: () => ({
        rooms: []
    }),
    actions: {
        joined: function(id) {return this.rooms.indexOf(id) >= 0}
    }
}))