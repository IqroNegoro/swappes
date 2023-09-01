export const getPosts = async () => await useApi("posts", {
    transform: res => res.data,
    default: () => [],
    key: "get-post"
})

export const createPost = async post => await useApi("posts", {
    method: "POST",
    body: post,
    key: "create-post",
})

export const deletePost = async id => await useApi(`posts/${id}`, {
    method: "DELETE",
    key: "delete-post"
})

export const getCommentsPost = async id => await useApi(`posts/${id}/comments`, {
    transform: res => res.data,
    default: () => [],
    key: "get-comment-post"
})

export const likePost = async id => await useApi(`posts/${id}/likes`, {
    method: "POST",
    transform: res => res.data,
    immediate: false,
    key: `like-post-${id}`
})

export const commentPost = async (id, comment) => await useApi(`posts/${id}/comments`, {
    method: "POST",
    body: comment,
    trasnform: res => res.data,
    key: `comment-post-${id}`
})