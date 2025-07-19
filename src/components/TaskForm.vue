<template>
    <div id="taskform">

        <div class="taskform-bottom">

            <div class="form-icons">
                <div class="icon-field full-width">
                    <i class="fa fa-heading"></i>
                    <input type="text" v-model="task.title" placeholder="Task Title" />
                </div>

                <div class="icon-field">
                    <i class="fa fa-calendar"></i>
                    <input type="date" v-model="task.dueDate" />
                </div>

                <div class="icon-field">
                    <i class="fa fa-clock"></i>
                    <input type="time" v-model="task.dueTime" />
                </div>

                <div class="icon-field">
                    <i class="fa fa-align-left"></i>
                    <input type="text" v-model="task.description" placeholder="Description" />
                </div>

                <div class="icon-field">
                    <i class="fa fa-layer-group"></i>
                    <input type="text" v-model="task.group" list="group-options" placeholder="Select or enter group" />
                    <datalist id="group-options">
                        <option v-for="group in groups" v-bind:value="group"></option>
                    </datalist>
                </div>

                <div class="icon-field">
                    <i class="fa fa-star"></i>
                    <select v-model="task.priority">
                        <option disabled value="">Select Priority</option>
                        <option v-for="priority in priorities" v-bind:value="priority">{{ priority }}</option>
                    </select>
                </div>



            </div>
            <button class="submit-button" @click="submitTask">Add Task</button>
        </div>
    </div>
</template>

<script>
import { addTask } from '../db/db.js';

export default {
    name: 'TaskForm',
    data() {
        return {
            task: {
                title: '',
                dueDate: '',
                dueTime: '',
                description: '',
                group: '',
                priority: '',
            },
            groups: ['Office', 'Family', 'Health'],
            priorities: ['Low', 'Medium', 'High'],
        }
    },
    methods: {
        async submitTask() {
            try {
                const id = await addTask(this.task);
                this.task.id = id;
                this.$emit('close');
                this.$emit('taskAdded', this.task);
            } catch (error) {
                console.error(error);
            }
        }
    },
    mounted() {
        if (!this.task.dueDate) {
            this.task.dueDate = new Date().toISOString().split('T')[0];
        }
        if (!this.task.dueTime) {
            this.task.dueTime = '09:00';
        }
    }

};
</script>

<style scoped>
#taskform {
    height: auto;
    width: 90%;
    max-width: 600px;
    background-color: #ECF0F1;
    border: 2px solid rgb(170, 170, 170);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
}


.full-width {
    flex: 1 1 100%;
}

.taskform-bottom {
    margin-top: 30px;
}

.form-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    font-family: "Roboto", sans-serif;
}

.icon-field input,
.icon-field select {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

.icon-field {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1 1 45%;
}

.icon-field i {
    color: #2da6c4;
    font-size: 18px;
    margin-right: 8px;
}

.submit-button {
    display: block;
    margin: 30px auto 0 auto;
    padding: 5px 10px;
    background-color: #2da6c4;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.submit-button:hover {
    background-color: #268ca5;
}



@media (max-width: 600px) {
    .icon-field {
        flex: 1 1 100%;
    }

    #taskform {
        padding: 16px;
    }

    .icon-field input,
    .icon-field select {
        font-size: 13px;
    }

    .icon-field i {
        font-size: 16px;
    }

    .close-btn {
        font-size: 20px;
    }
}
</style>
