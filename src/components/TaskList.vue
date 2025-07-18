<template>
    <div id="tasklist">
        <div id="controllers">
        </div>


    </div>
</template>

<script>
import TaskItem from './TaskItem.vue';

export default {
    name: 'TaskList',
    components: {
        'taskitem': TaskItem,
    },
    props: {
        //based on the filter by homeView it will take props and list the task with that filter only
        filter: {
            type: Object,
            required: true,
        }
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