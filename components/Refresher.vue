<template>
    <div class="fixed top-4 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full w-8 h-8 flex justify-center items-center" ref="refreshIndicator">
        <i class="bx bx-refresh animate-spin"></i>
    </div>
</template>
<script setup>
const { refresh } = defineProps(["refresh"]);
const refreshIndicator = ref(null);

let pos = {
    elY: 0,
    y: 0
}

const handleMouseUp = () => {
    refreshIndicator.value.style.top = `${pos.elY}px`
    pos.y = 0;
    document.removeEventListener("mousemove", handleMoveMouse)
    document.removeEventListener("mouseup", handleMouseUp)
}

const handleMoveMouse = e => {
    refreshIndicator.value.style.top = `${pos.elY + (e.clientY - pos.y)}px`
}

const handleClick = e => {
    // pos.elY = refreshIndicator.value.getBoundingClientRect().top;
    console.log(refreshIndicator.value.style.top,refreshIndicator.value.getBoundingClientRect())
    // pos.y = e.clientY
    // document.addEventListener("mousemove", handleMoveMouse)
    // document.addEventListener("mouseup", handleMouseUp)
}
onMounted(() => {
    document.addEventListener("mousedown", handleClick)
});

onUnmounted(() => {
    document.removeEventListener("mousedown", handleClick)
})
</script>