export const getNotifications = async () => await useApi(`notifications`, {
    transform: res => res.data,
    default: () => [],
    immediate: false,
    key: "get-notifications"
})

export default () => useState("notifications", () => ({}));