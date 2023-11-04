let baseURL = "http://localhost:3001/";
//testing purpose
if (process.client) {
    baseURL = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) ? 'http://192.168.1.47:3001/' : 'http://localhost:3001/';
}
if (process.env.NODE_ENV == "production") baseURL = "https://api.swappes.my.id/"
export const useApi = async (url, options) => await useFetch(url, {
    ...options,
    headers: useRequestHeaders(["cookie"]),
    credentials: "include",
    baseURL
})