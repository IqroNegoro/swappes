export const getUserById = async id => await useApi(`users/${id}`, {
    transform: res => res.data,
    default: () => {},
    key: "get-user-by-id"
})

export const getUserPosts = async id => await useApi(`users/${id}/posts`, {
    transform: res => res.data,
    default: () => [],
    key: "get-user-posts"
})

export const uploadAvatar = async avatar => await useApi(`users/avatar`, {
    method: "POST",
    transform: res => res.data,
    default: () => [],
    body: avatar,
    key: "upload-user-avatar"
})

export const uploadBanner = async banner => await useApi(`users/banner`, {
    method: "POST",
    transform: res => res.data,
    default: () => [],
    body: banner,
    key: "upload-user-banner"
})

export const addFriendRequest = async id => {
    
}