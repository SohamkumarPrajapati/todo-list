<template>
    <header id="main-header">
        <div>{{ title }}</div>
        <div id="userIcon"></div>
    </header>
</template>



<script>
export default {
    name: 'Header',
    data: function() {
        return {
            title: 'To Do',
        }
    }
}
</script>

<style>
</style>