export const useApi = async (url, options) => {
    const user = userStore();
    return await useFetch(url, {
    ...options,
    headers: {
        Authorization: `Bearer ${user.token}`
    },
    baseURL: 'http://localhost:3001/'
})}