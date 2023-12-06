import {callWithNuxt} from "#app";
let baseURL = "http://localhost:3001/";
if (process.client) {
    baseURL = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) ? 'http://192.168.137.1:3001/' : 'http://localhost:3001/';
}
if (process.env.NODE_ENV == "production") baseURL = "https://api.swappes.my.id/"

const refreshToken = async () => await $fetch("refresh", {
    method: "POST",
    headers: useRequestHeaders(["cookie"]),
    credentials: "include",
    baseURL
});

const fetching = async (url, options) => await useFetch(url, {
    ...options,
    headers: useRequestHeaders(["cookie"]),
    credentials: "include",
    baseURL
});

export const useApi = async (url, options) => {
    const request = await fetching(url, options);

    if (request.error?.value?.statusCode === 401) {
        setTimeout(async () => {
            await refreshToken();
            return await fetching(url, options);
            // return await fetching(url, options)
        })
    }
    // if (request.error?.value) {
    // };

    return request;
}