<template>
    <div class="partial-full-screen-content-container">
        <slot></slot>
    </div>
</template>

<style scoped>
    .partial-full-screen-content-container{
        /* flex-grow: 1; */
        /* min-height: calc(100vh - 30px); */
        height: auto;
        width: 100vw;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }
</style>