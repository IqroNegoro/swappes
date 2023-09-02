import io from "socket.io-client";
export default () => {
    if (process.client) {
        return io(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) ? 'http://192.168.137.1:3001/' : 'http://localhost:3001/', {
            autoConnect: false,
            withCredentials: true
        });
    }
}