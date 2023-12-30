export default async (url, options) => {
    const config = useRuntimeConfig().public;
    let baseURL = config.devApiUrl;
    if (process.env.NODE_ENV == "production") baseURL = config.apiUrl

    return await useFetch(url, {
        ...options,
        headers: useRequestHeaders(["cookie"]),
        credentials: "include",
        baseURL
    });
} 