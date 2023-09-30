// let baseURL = "http://localhost:3001/";
// //testing purpose
// if (process.client) {
//     baseURL = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) ? 'http://192.168.137.1:3001/' : 'http://localhost:3001/';
//     console.log(baseURL)
// }
// let baseURL = useRuntimeConfig().apiURL
export const useApi = async (url, options) => await useFetch(url, {
    ...options,
    credentials: "include",
    headers: useRequestHeaders(["cookie"]),
    baseURL: "https://api.swappes.my.id/"
})