<template>
    <div id="homeview">
        <main>
            <div class="taskform-top" @click="formExpanded = true">
                <span class="plus-icon" ref="insertTaskIcon">+</span>
                <div id="taskInsertion">Add new Task</div>
            </div>

            <tasklist v-bind:filter="homeFilters"></tasklist>
        </main>

        <div v-if="formExpanded" class="taskform-overlay" @click="handleOverlayClick">
            <taskform ref="taskform" v-on:close="formExpanded = false" />
        </div>

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
    data: function () {
        return {
            formExpanded: false,
            homeFilters: {

            }
        }
    },
    methods: {
        handleOverlayClick(e) {
            const taskFormEl = this.$refs.taskform && this.$refs.taskform.$el;
            if (taskFormEl && !taskFormEl.contains(e.target)) {
                this.formExpanded = false;
            }
        },
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
    cursor: text;
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
    padding-top: 7px;
    font-size: 16px;
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