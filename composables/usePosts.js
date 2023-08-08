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