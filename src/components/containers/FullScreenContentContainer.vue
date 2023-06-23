<template>
    <div class="full-screen-content-container">
        <slot></slot>
    </div>
</template>

<style scoped>
    .full-screen-content-container{
        flex-grow: 1;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }
</style>