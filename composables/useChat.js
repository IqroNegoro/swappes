export const activeChat = (id = "") => useState("activeChat", () => id);

export const getChats = async id => await useApi(`chats`, {
    lazy: true,
    transform: res => res.data,
    default: () => [],
    key: `get-chats`
});

export const getMessages = async id => await useApi(`chats/${id}/messages`, {
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