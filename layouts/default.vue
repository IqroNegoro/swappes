<template>
    <div>
        <Navbar v-if="$route.name != 'login'" />
        <div :class="{'mt-16': $route.name != 'login'}" class="grid grid-rows-1 grid-cols-1 lg:grid-cols-[1fr,2fr,1fr] mt-16">
            <div class="max-lg:hidden"></div>
            <slot />
            <div class="max-lg:hidden"></div>
        </div>
        <Toast />
    </div>
</template>