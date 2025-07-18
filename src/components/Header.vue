<template>
    <header id="mainheader">
        <div id="titleHeader">
            <div id="logo"></div>
            <div id="title">{{ title }}</div>
        </div>
        <div id="userIcon"></div>
    </header>
</template>



<script>
export default {
    name: 'Header',
    data: function () {
        return {
            title: 'To Do',
        }
    }
}
</script>

<style>
#mainheader {
    height: 40px;
    background-color: rgb(45, 196, 151);
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#titleHeader {
    display: flex;
    justify-content: center;
    align-items: center;
}

#logo {
    height: 30px;
    width: 40px;
    background-image: url('../assets/images/logo.png');
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 5px;
}

#title {
    color: antiquewhite;
    font-size: larger;
    font-family: "Roboto", sans-serif;
    font-weight: bold;
    padding-left: 10px;
}

#userIcon {
    height: 20px;
    width: 50px;
    background-image: url('../assets/images/user-solid.svg');
    background-repeat: no-repeat;
    background-position: center;
}
</style>