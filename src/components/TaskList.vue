<template>
    <div id="tasklist">


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