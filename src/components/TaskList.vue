<template>
    <div id="tasklist">
        <div class="tasks-container">
            <taskitem
                v-for="task in tasks"
                :key="task.id"
                :task="task"
                @delete="removeTask"
            />
        </div>
    </div>
</template>

<script>
import TaskItem from './TaskItem.vue';
import { getTasksByFilter } from '../db/db.js';

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
    data() {
        return {
            tasks: [],
        }
    },
    watch: {
        filter: {
            handler: 'fetchTasks',
            deep: true,
            immediate: true
        }
    },
    methods: {
        async fetchTasks() {
            this.tasks = await getTasksByFilter(this.filter);
        },
        removeTask(task) {
            this.tasks = this.tasks.filter(t => t.id !== task.id);
        }
    },
    mounted() {
        this.fetchTasks();
    }
}
</script>

<style scoped>
#tasklist {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.tasks-container {
    flex: 1 1 auto;
    overflow-y: auto;
    max-height: 100%;
    margin-top: 20px;
}
</style>