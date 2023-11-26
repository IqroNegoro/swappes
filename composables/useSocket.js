import io from "socket.io-client";
const socket = ref(undefined);
export default () => {
    if (socket.value) return socket;
    if (process.client) {
        let baseURL = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) ? 'http://192.168.137.1:3001/' : 'http://localhost:3001/'
        if (process.env.NODE_ENV == "production") baseURL = "https://api.swappes.my.id/"
        // socket.value = io("https://api.swappes.my.id/", {
        // socket.value = io("http://localhost:3001/", {
        //     autoConnect: false,
        //     withCredentials: true
        // });
        socket.value = io(baseURL, {
            autoConnect: false,
            withCredentials: true
        });

        socket.value.on("disconnect", () => {
            console.log("njir dc");
            socket.value.connect();
        })
    }
    return socket;
}