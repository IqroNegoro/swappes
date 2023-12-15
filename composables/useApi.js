let baseURL = "http://localhost:3001/";
if (process.client) {
    baseURL = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) ? 'http://192.168.204.87:3001/' : 'http://localhost:3001/';
}
if (process.env.NODE_ENV == "production") baseURL = "https://api.swappes.my.id/"

export default async (url, options) => await useFetch(url, {
    ...options,
    headers: useRequestHeaders(["cookie"]),
    credentials: "include",
    baseURL,
});