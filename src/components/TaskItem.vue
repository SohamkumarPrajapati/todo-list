<template>
    <div class="taskitem">
        <div class="taskitem-main">
            <label class="circular-checkbox">
                <input type="checkbox" :checked="localTask.completed" @change="toggleCompletion" />
                <span class="checkmark"></span>
            </label>
            <span v-if="!editMode" class="task-title" @click="toggleDetails">{{ localTask.title }}</span>
            <input v-else class="task-title-input" v-model="editableTask.title" @click.stop :readonly="!editMode" />
            <div class="actions">
                <i v-if="!editMode" class="fa fa-pen-to-square edit-icon" @click="startEdit"></i>
                <i v-else class="fa fa-check update-icon" @click="updateTask"></i>
                <i class="fa fa-trash delete-icon" @click="deleteTask"></i>
            </div>
        </div>
        <div v-if="showDetails" class="taskitem-details">
            <div class="detail-row">
                <i class="fa fa-star"></i>
                <span v-if="!editMode">{{ localTask.priority }}</span>
                <select v-else v-model="editableTask.priority" class="edit-input">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            <div class="detail-row">
                <i class="fa fa-layer-group"></i>
                <span v-if="!editMode">{{ localTask.group }}</span>
                <input v-else v-model="editableTask.group" class="edit-input" @click.stop />
            </div>
            <div class="detail-row">
                <i class="fa fa-align-left"></i>
                <span v-if="!editMode">{{ localTask.description }}</span>
                <input v-else v-model="editableTask.description" class="edit-input" @click.stop />
            </div>
            <div class="detail-row">
                <i class="fa fa-calendar"></i>
                <span v-if="!editMode">{{ localTask.dueDate }}</span>
                <input v-else type="date" v-model="editableTask.dueDate" class="edit-input" @click.stop />
                <i class="fa fa-clock" style="margin-left: 16px;"></i>
                <span v-if="!editMode">{{ localTask.dueTime }}</span>
                <input v-else type="time" v-model="editableTask.dueTime" class="edit-input" @click.stop />
            </div>
        </div>
    </div>
</template>

<script>
import { updateTaskCompletion, updateTask, deleteTask as dbDeleteTask } from '../db/db.js';

export default {
    name: 'TaskItem',
    props: {
        task: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showDetails: false,
            editMode: false,
            localTask: { ...this.task },
            editableTask: {}
        }
    },
    watch: {
        task: {
            handler(newVal) {
                this.localTask = { ...newVal };
            },
            deep: true
        }
    },
    methods: {
        toggleDetails() {
            this.showDetails = !this.showDetails;
        },
        async toggleCompletion() {
            this.localTask.completed = !this.localTask.completed;
            await updateTaskCompletion(this.localTask.id, this.localTask.completed);
        },
        startEdit() {
            if (!this.showDetails) this.showDetails = true;
            this.editMode = true;
            this.editableTask = { ...this.localTask };
        },
        async updateTask() {
            const changed = Object.keys(this.editableTask).some(
                key => this.editableTask[key] !== this.localTask[key]
            );
            if (changed) {
                await updateTask({ ...this.editableTask, id: this.localTask.id });
                this.localTask = { ...this.editableTask };
                this.$emit('taskUpdated',this.localTask);
            }
            this.editMode = false;
        },
        async deleteTask() {
            await dbDeleteTask(this.localTask.id);
            this.$emit('delete', this.localTask);
        }
    }
}
</script>

<style scoped>
.taskitem {
    width: 100%;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(44, 62, 80, 0.07);
    margin-bottom: 14px;
    transition: box-shadow 0.18s;
    overflow: hidden;
    font-family: "Roboto", sans-serif;
}

.taskitem-main {
    display: flex;
    align-items: center;
    padding: 14px 18px;
    gap: 14px;
}

.circular-checkbox {
    display: flex;
    align-items: center;
    margin-right: 10px;
    position: relative;
    height: 22px;
    width: 22px;
}

.circular-checkbox input {
    opacity: 0;
    width: 0;
    height: 0;
}

.checkmark {
    height: 22px;
    width: 22px;
    background-color: #f1f1f1;
    border-radius: 50%;
    border: 2px solid #2da6c4;
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    transition: background 0.18s;
}

.circular-checkbox input:checked~.checkmark {
    background-color: #2da6c4;
    border-color: #2da6c4;
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.circular-checkbox input:checked~.checkmark:after {
    display: block;
}

.circular-checkbox .checkmark:after {
    left: 7px;
    top: 3px;
    width: 6px;
    height: 12px;
    border: solid #fff;
    border-width: 0 2.5px 2.5px 0;
    transform: rotate(45deg);
    content: "";
    position: absolute;
}

.task-title {
    flex: 1;
    font-size: 15px;
    font-weight: 500;
    color: #2c3e50;
    user-select: none;
    transition: color 0.18s;
    cursor: pointer;
}

.task-title:hover {
    color: #2da6c4;
}

.task-title-input {
    flex: 1;
    font-size: 17px;
    font-weight: 500;
    color: #2c3e50;
    background: transparent;
    border: none;
    outline: none;
    box-shadow: none;
    padding: 0;
    margin: 0;
}

.actions {
    display: flex;
    gap: 12px;
}

.edit-icon,
.update-icon,
.delete-icon {
    font-size: 18px;
    cursor: pointer;
    color: #bbb;
    transition: color 0.18s;
}

.edit-icon:hover,
.update-icon:hover {
    color: #2da6c4;
}

.delete-icon:hover {
    color: #e74c3c;
}

.taskitem-details {
    background: #f7fafc;
    border-bottom: 1px solid #e0e0e0;
    padding: 12px 28px 14px 48px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 15px;
    color: #444;
    margin-top: -2px;
}

.detail-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.detail-row i {
    color: #2da6c4;
    font-size: 16px;
}

.edit-input {
    background: transparent;
    border: none;
    outline: none;
    box-shadow: none;
    font-size: 15px;
    color: #444;
    padding: 0;
    margin: 0;
    min-width: 60px;
}
</style>