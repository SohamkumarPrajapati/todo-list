<template>
    <div id="homeview">
        <main>
            <div class="taskform-top" @click="formExpanded = true">
                <button class="plus-fab" ref="insertTaskIcon">
                    <i class="fa fa-plus"></i>
                </button>
                <div id="taskInsertion">Add new Task</div>
            </div>
            <div class="accordians">
                <div v-for="group in groups" :key="group">
                    <div class="accordion-header" @click="toggleAccordion(group)">
                        <div>
                            <i class="fa fa-layer-group"></i>
                            {{ group }}
                        </div>
                        <div>
                            <div v-if="isAccordionOpen(group)" class="sort-btn" @click.stop="toggleSortSelect(group)">
                                <i class="fa-solid fa-sort"></i>
                            </div>
                            <select v-if="sortSelectOpen === group && isAccordionOpen(group)" class="sort-select"
                                v-model="groupSorts[group]" @change="closeSortSelect" @click.stop>
                                <option value="priority">Priority</option>
                                <option value="duedate">Due Date</option>
                            </select>
                            <div v-if="isAccordionOpen(group)" class="filters-btn" @click.stop="openFilters(group)">
                                <i class="fa-solid fa-filter"></i>
                            </div>
                            <span v-if="!isAccordionOpen(group)">
                                <i class="fa-solid fa-chevron-down"></i>
                            </span>
                        </div>
                    </div>
                    <div v-show="isAccordionOpen(group)">
                        <tasklist :filter="getGroupFilter(group)" :sort="groupSorts[group]" />
                    </div>
                </div>
            </div>
        </main>
        <div v-if="formExpanded" class="taskform-overlay" @click="handleOverlayClick">
            <taskform ref="taskform" v-on:taskAdded="handleTaskAdded" v-on:close="formExpanded = false" />
        </div>
        <div v-if="filtersExpanded" class="filters-overlay" @click="handleFiltersOverlayClick">
            <filters ref="filters" @apply-filters="handleApplyFilters" />
        </div>
    </div>
</template>

<script>
import TaskForm from '../components/TaskForm.vue';
import TaskList from '../components/TaskList.vue';
import Filters from '../components/Filters.vue';
import { getAllGroups } from '../db/db';

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
            groups: [],
            openAccordions: [],
            groupSorts: {}, // { groupName: 'priority' | 'duedate' }
            sortSelectOpen: null, // group name for which select is open
            groupFilters: {}, // { groupName: { ...filterObj } }
            filterGroupOpen: null // group name for which filter is open
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
            if (this.filterGroupOpen) {
                this.$set(this.groupFilters, this.filterGroupOpen, { ...filters });
                this.filtersExpanded = false;
                this.filterGroupOpen = null;
            }
        },
        handleTaskAdded(task) {
            if (task.group && !this.groups.includes(task.group)) {
                this.groups.push(task.group);
            }
        },
        toggleAccordion(group) {
            if (this.openAccordions.includes(group)) {
                this.openAccordions = this.openAccordions.filter(g => g !== group);
            } else {
                this.openAccordions.push(group);
            }
        },
        isAccordionOpen(group) {
            return this.openAccordions.includes(group);
        },
        toggleSortSelect(group) {
            if (this.sortSelectOpen) {
                this.sortSelectOpen = null;
            }
            else {
                this.sortSelectOpen = group;
            }
        },
        closeSortSelect() {
            this.sortSelectOpen = null;
        },
        openFilters(group) {
            this.filtersExpanded = true;
            this.filterGroupOpen = group;
        },
        getGroupFilter(group) {
            return { ...this.groupFilters[group], group };
        },
    },
    async created() {
        this.groups = await getAllGroups();
    }

}
</script>

<style scoped>
.sort-select {
    position: absolute;
    right: 32px;
    top: 32px;
    z-index: 20;
    background: #fff;
    border: 1px solid #2da6c4;
    border-radius: 6px;
    font-size: 15px;
    padding: 4px 10px;
    box-shadow: 0 2px 8px rgba(44, 62, 80, 0.13);
    outline: none;
    color: #268ca5;
    min-width: 110px;
    cursor: pointer;
}

.sort-select:focus {
    border-color: #268ca5;
}

#homeview {
    height: 100vh;
    width: 100%;
    background-color: rgb(244, 246, 247);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.filters-btn {
    color: #2c9ebb;
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
    position: sticky;
    top: 0;
    z-index: 10;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 18px;
    background: #eaf6fa;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(44, 62, 80, 0.07);
    margin-bottom: 18px;
    border: 1px solid #d0e6ee;
}

.plus-fab {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    width: 25px;
    border-radius: 20%;
    background: linear-gradient(135deg, #2da6c4 60%, #268ca5 100%);
    color: #fff;
    border: none;
    font-size: 22px;
    box-shadow: 0 2px 8px rgba(44, 62, 80, 0.10);
    cursor: pointer;
    transition: background 0.18s, box-shadow 0.18s;
    outline: none;
}

.plus-fab:hover,
.plus-fab:focus {
    background: linear-gradient(135deg, #268ca5 60%, #2da6c4 100%);
    box-shadow: 0 4px 16px rgba(44, 62, 80, 0.13);
}

.plus-fab i {
    font-size: 15px;
    pointer-events: none;
}

#taskInsertion {
    height: 20px;
    width: 100%;
    text-align: left;
    padding-top: 2px;
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

.accordians {
    margin-top: 24px;
    overflow-y: auto;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.accordians::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

.accordion-header {
    background: #eaf6fa;
    color: #268ca5;
    font-size: 17px;
    font-weight: 500;
    padding: 14px 22px;
    border-radius: 10px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background 0.18s, color 0.18s;
    border: 1px solid #d0e6ee;
    border-bottom: none;
    margin-bottom: 0;
}

.accordion-header:hover {
    background: #d0e6ee;
    color: #2da6c4;
}

.accordion-header div {
    position: relative;
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.accordians>div {
    margin-bottom: 18px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(44, 62, 80, 0.07);
    background: #fff;
    overflow: hidden;
    border: 1px solid #d0e6ee;
}

.accordians>div .accordion-header {
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid #d0e6ee;
}

.accordians>div .accordion-header[aria-expanded="true"] {
    background: #2da6c4;
    color: #fff;
}

.accordians>div>div[style*="display: block"],
.accordians>div>div[style*="display: flex"] {
    animation: fadeInAccordion 0.25s;
}

@keyframes fadeInAccordion {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>