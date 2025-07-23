<template>
    <div id="tasklist">
        <div class="tasks-container">
            <taskitem
                v-for="task in tasks"
                :key="task.id"
                :task="task"
                @delete="removeTask"
                @taskUpdated="fetchTasks"
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
        },
        sort: {
            type: String,
            default: '',
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
            let tasks = await getTasksByFilter(this.filter);
            if (this.sort === 'priority') {
                const priorityOrder = { High: 1, Medium: 2, Low: 3 };
                tasks = tasks.slice().sort((a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4));
            } else if (this.sort === 'duedate') {
                tasks = tasks.slice().sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });
            }
            this.tasks = tasks;
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