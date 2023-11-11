export const getPosts = async () => await useApi("posts", {
    transform: res => res.data,
    default: () => [],
    key: "get-posts",
})

export const getPost = async (id, options) => await useApi(`posts/${id}`, {
    ...options,
    transform: res => res.data,
    key: `get-post-${id}`
})

export const createPost = async post => await useApi("posts", {
    method: "POST",
    body: post,
    key: "create-post",
})

export const updatePost = async (id, body) => await useApi(`posts/${id}`, {
    method: "PUT",
    body,
    transform: res => res.data,
    key: `update-${id}-post`
})

export const deletePost = async id => await useApi(`posts/${id}`, {
    method: "DELETE",
    key: "delete-post",
    transform: res => res.data,
    immediate: false
})

export const getCommentsPost = async id => await useApi(`posts/${id}/comments`, {
    transform: res => res.data,
    default: () => [],
    lazy: true,
    key: `get-comment-post-${id}`
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
    transform: res => res.data,
    key: `comment-post-${id}`
})

export const deleteComment = async (id, commentId) => await useApi(`posts/${id}/comments/${commentId}`, {
    method: "DELETE",
    key: `delete-comment-${commentId}`,
    transform: res => res.data,
    immediate: false
})

export const bookmarkPost = async id => await useApi(`/bookmarks`, {
    method: "POST",
    body: {
        id
    },
    transform: res => res.data,
    immediate: false,
    key: "bookmark-post"
})

export const deleteBookmarkPost = async id => await useApi(`/bookmarks/${id}`, {
    method: "DELETE",
    transform: res => res.data,
    immediate: false,
    key: "bookmark-post"
})

export const copyLink = id => {
    let toast = useToast();
    let text = `${window.location.href}posts/${id}`
    navigator.clipboard.writeText(text);
    toast.value.push("Link post copied")
}