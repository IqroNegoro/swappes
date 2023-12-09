export const getUserById = async (id, options) => await useApi(`users/${id}`, {
    ...options,
    transform: res => res.data,
    default: () => {},
    key: "get-user-by-id"
})

export const getUserPosts = async (id, options) => await useApi(`users/${id}/posts`, {
    ...options,
    transform: res => res.data,
    default: () => [],
    lazy: true,
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

export const getUserFriends = async (id, options) => await useApi(`users/${id}/friends`, {
    transform: res => res.data,
    default: () => [],
    key: `get-${id}-friends`,
})

export const getAllUserFriends = async (id, options) => await useApi(`users/${id}/friends`, {
    ...options,
    transform: res => res.data,
    default: () => [],
    key: `get-all-${id}-friends`,
})

export const friendRequest = async id => await useApi(`users/${id}/friends`, {
    method: "POST",
    transform: res => res.data,
    immediate: false,
    key: `friend-request-${id}`
})

export const acceptFriendRequest = async id => await useApi(`users/${id}/friends`, {
    method: "PUT",
    transform: res => res.data,
    immediate: false,
    key: `accept-friend-request-${id}`
})

export const deleteFriend = async id => await useApi(`users/${id}/friends`, {
    method: "DELETE",
    transform: res => res.data,
    immediate: false,
    key: `delete-friend-${id}`
})

export const getBookmarks = async options => await useApi(`bookmarks`, {
    ...options,
    transform: res => res.data,
    default: () => [],
    lazy: true,
    key: "get-bookmarks"
})