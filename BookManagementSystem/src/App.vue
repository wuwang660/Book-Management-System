<script setup></script>

<template>
    <div id="app">
        <!-- 根据路由自动渲染 Login 或 BookManagement -->
        <router-view />
    </div>
</template>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    #app {
        font-family: SimSun;
        min-height: 100vh;
        background: #f0f2f5;
    }
</style>
