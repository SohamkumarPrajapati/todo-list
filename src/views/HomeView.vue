<template>
    <div id="homeview">
        <div class="filters-btn-container">
            <div class="filters-btn" @click="filtersExpanded = true">
                <i class="fa-solid fa-filter"></i>
            </div>
        </div>
        <main>
            <div class="taskform-top" @click="formExpanded = true">
                <span class="plus-icon" ref="insertTaskIcon">+</span>
                <div id="taskInsertion">Add new Task</div>
            </div>
            <tasklist v-bind:filter="homeFilters"></tasklist>
        </main>
        <div v-if="formExpanded" class="taskform-overlay" @click="handleOverlayClick">
            <taskform ref="taskform" v-on:taskAdded="handleTaskAdded" v-on:close="formExpanded = false" />
        </div>
        <div v-if="filtersExpanded" class="filters-overlay" @click="handleFiltersOverlayClick">
            <filters ref="filters" :groups="groups" :priorities="priorities" @apply-filters="handleApplyFilters" />
        </div>
    </div>
</template>

<script>
import TaskForm from '../components/TaskForm.vue';
import TaskList from '../components/TaskList.vue';
import Filters from '../components/Filters.vue';

export default {
    name: 'HomeView',
    components: {
        'taskform': TaskForm,
        'tasklist': TaskList,
        'filters': Filters,
    },
    data: function () {
        return {
            formExpanded: false,
            filtersExpanded: false,
            homeFilters: {},
            groups: ['Office', 'Family', 'Health'],
            priorities: ['Low', 'Medium', 'High'],
        }
    },
    methods: {
        handleOverlayClick(e) {
            const taskFormEl = this.$refs.taskform && this.$refs.taskform.$el;
            if (taskFormEl && !taskFormEl.contains(e.target)) {
                this.formExpanded = false;
            }
        },
        handleFiltersOverlayClick(e) {
            const filtersEl = this.$refs.filters && this.$refs.filters.$el;
            if (filtersEl && !filtersEl.contains(e.target)) {
                this.filtersExpanded = false;
            }
        },
        handleApplyFilters(filters) {
            this.homeFilters = { ...filters };
            this.filtersExpanded = false;
        },
        handleTaskAdded(task) {
            // Update groups if new group is added
            if (task.group && !this.groups.includes(task.group)) {
                this.groups.push(task.group);
            }
        }
    }

}
</script>

<style scoped>
#homeview {
    height: 100vh;
    width: 100%;
    background-color: rgb(244, 246, 247);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.filters-btn-container {
    width: 80%;
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
}

.filters-btn {
    padding: 7px 14px;
    background: #2da6c4;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.18s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.filters-btn i {
    font-size: 20px;
}

.filters-btn:hover {
    background: #268ca5;
}

.filters-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.18);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1100;
}

#homeview main {
    height: 70%;
    width: 80%;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.taskform-top {
    height: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 10px;
    text-align: center;
    box-shadow: 3px 4px 8px rgba(0, 0, 0, 0.2);
}

.plus-icon {
    height: 20px;
    width: 20px;
    font-size: 24px;
    color: black;
    font-weight: 300;
    cursor: pointer;
}

#taskInsertion {
    height: 20px;
    width: 100%;
    text-align: left;
    padding-top: 7px;
    font-size: 16px;
    cursor: text;
    color: grey;
}

.taskform-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
</style>