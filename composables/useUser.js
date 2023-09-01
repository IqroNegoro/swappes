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
    body: avatar,
    key: "upload-user-avatar"
})