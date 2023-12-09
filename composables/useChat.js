export const getChats = async id => await useApi(`chats`, {
    lazy: true,
    transform: res => res.data,
    default: () => [],
    key: `get-chats`
});

export const getMessages = async (id, options) => await useApi(`chats/${id}/messages`, {
    ...options,
    lazy: true,
    transform: res => res.data,
    default: () => [],
    key: `get-${id}-messages`
});

export const createChat = async body => await useApi(`/chats`, {
    method: "POST",
    body,
    transform: res => res.data,
    key: "create-chats"
});

export const checkChat = async id => await useApi(`/chats/${id}`, {
    key: "get-chat"
})

export const sendMessage = async (id, content) => await useApi(`chats/${id}/messages`, {
    method: "POST",
    body: content,
    transform: res => res.data,
    key: `message-chat-${id}`
})

export const deleteMessage = async (id, messageId) => await useApi(`chats/${id}/messages/${messageId}`, {
    method: "DELETE",
    transform: res => res.data,
    immediate: false,
    key: `delete-message-${messageId}`
})