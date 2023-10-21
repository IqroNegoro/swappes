export const roomsStore = defineStore("rooms", ({
    state: () => ({
        rooms: []
    }),
    actions: {
        join: function(id) {return this.rooms.indexOf(id) >= 0 ? "" : this.rooms.push(id)},
        has: function(id) {return this.rooms.indexOf(id) >= 0}
    }
}))