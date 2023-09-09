let baseURL = "http://localhost:3001/";
//testing purpose
if (process.client) {
    baseURL = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) ? 'http://192.168.236.87:3001/' : 'http://localhost:3001/';
    console.log(baseURL)
}
export const useApi = async (url, options) => await useFetch(url, {
    ...options,
    credentials: "include",
    headers: useRequestHeaders(["cookie"]),
    baseURL
})