<template>
    <div>
        <Navbar v-if="$route.name != 'login'" />
        <div :class="{'mt-16': $route.name != 'login'}">
            <slot />
        </div>
        <Toast />
    </div>
</template>