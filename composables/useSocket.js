import io from "socket.io-client";
const socket = ref(undefined);
export default () => {
    if (socket.value) return socket;
    if (process.client) {
        socket.value = io(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) ? 'http://192.168.26.87:3001/' : 'http://localhost:3001/', {
            autoConnect: false,
            withCredentials: true
        });
    }
    return socket;
}