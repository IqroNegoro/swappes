import io from "socket.io-client";
const socket = ref(undefined);
export default () => {
    if (socket.value) return socket;
    if (process.client) {
        const config = useRuntimeConfig().public;
        let baseURL = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) ? 'http://192.168.204.87:3001/' : 'http://localhost:3001/'
        if (process.env.NODE_ENV == "production") baseURL = "https://api.swappes.my.id/"
        socket.value = io(baseURL, {
            withCredentials: true
        });
        socket.value.disconnect();
    }
    return socket;
}