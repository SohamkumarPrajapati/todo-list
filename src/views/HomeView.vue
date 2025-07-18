<template>
    <div id="homeview">
        <main>
            <div class="taskform-top" @click="formExpanded = true">
                <span class="plus-icon" ref="insertTaskIcon">+</span>
                <div id="taskInsertion">Add new Task</div>
            </div>

            <tasklist></tasklist>
        </main>

        <div v-if="formExpanded" class="taskform-overlay" @click="handleOverlayClick">
            <taskform ref="taskform" @close="formExpanded = false" />
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
        }
    },
    methods: {
        handleOverlayClick(e) {
            const taskFormEl = this.$refs.taskform && this.$refs.taskform.$el;
            if (taskFormEl && !taskFormEl.contains(e.target)) {
                this.formExpanded = false;
            }
        }
    }

}
</script>

<style scoped>
#homeview {
    height: 100vh;
    width: 100%;
    background-color: rgb(206, 209, 212);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#homeview main {
    height: 70%;
    width: 80%;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.taskform-top {
    height: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: text;
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