export const activeChat = (id = "") => useState("activeChat", () => id);

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