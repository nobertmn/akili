<template>
    <div class="full-page-container">
        <slot></slot>
    </div>
</template>

<style scoped>
    .full-page-container{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        height: 100vh !important;
        width: 100vw !important;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        overflow-y: scroll;
    }
</style>