<template>
    <div id="tasklist">
        <div class="tasks-container">
            <taskitem v-for="task in tasks" :key="task.id" :task="task" @delete="removeTask"
                @taskUpdated="fetchTasks" />
        </div>
    </div>
</template>

<script>
import TaskItem from './TaskItem.vue';
import { getTasksByFilter, getFilters, getSorting } from '../db/db.js';

export default {
    name: 'TaskList',
    components: {
        'taskitem': TaskItem,
    },
    props: {
        group: {
            type: String,
            required: true,
        },
        taskListUpdateKey: {
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            tasks: [],
            filters: {
                completion: '',
                priority: '',
                dueDate: '',
            },
            sort: '',
        }
    },
    methods: {
        async fetchTasks() {
            this.filters = await getFilters(this.group);
            this.sort = await getSorting(this.group);
            let tasks = await getTasksByFilter(this.filters,this.group);
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
    },
    watch: {
        group: {
            handler: 'fetchTasks',
            immediate: true
        },
        sort: {
            handler: 'fetchTasks',
            immediate: true
        },
        taskListUpdateKey: {
            handler: 'fetchTasks',
            immediate: false
        }
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