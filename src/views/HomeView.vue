<template>
    <div id="homeview">
            <taskform></taskform>
            <tasklist></tasklist>
    </div>
</template>

<script>
import TaskForm from '../components/TaskForm.vue';
import TaskList from '../components/TaskList.vue';

export default {
    name: 'HomeView',
    components: {
        'taskform': TaskForm,
        'tasklist': TaskList,
    },
    data: function() {
        return {

        }
    },
    methods: {

    }
}
</script>

<style scoped>

</style>