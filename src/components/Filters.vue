<template>
  <div class="filters-popup" ref="filtersPopup">
    <div class="filters-form">
      <div class="filter-field">
        <label><i class="fa fa-tasks"></i> Completion:</label>
        <select v-model="filters.completion">
          <option value="">All</option>
          <option v-for="status in completionOptions" :key="status" :value="status">{{ status }}</option>
        </select>
      </div>
      <div class="filter-field">
        <label><i class="fa fa-star"></i> Priority:</label>
        <select v-model="filters.priority">
          <option value="">All</option>
          <option v-for="priority in priorities" :key="priority" :value="priority">{{ priority }}</option>
        </select>
      </div>
      <div class="filter-field">
        <label><i class="fa-solid fa-calendar"></i>DueDate:</label>
        <input type="date" v-model="filters.dueDate">
      </div>
      <button class="apply-btn" @click="applyFilters">Apply</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Filters',
  data() {
    return {
      filters: {
        completion: '',
        priority: '',
        dueDate: ''
      },
      completionOptions: ['Pending', 'Completed'],
      priorities: ['Low', 'Medium', 'High'],
    }
  },
  methods: {
    applyFilters() {
      this.$emit('apply-filters', { ...this.filters });
    }
  },
}
</script>

<style scoped>
.filters-popup {
  background: #ECF0F1;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  padding: 24px 20px 16px 20px;
  min-width: 260px;
  max-width: 320px;
  z-index: 2000;
  position: relative;
  animation: popIn 0.18s;
}

@keyframes popIn {
  from {
    transform: scale(0.95);
    opacity: 0.7;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.filters-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.filter-field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-field label {
  min-width: 90px;
  font-weight: 500;
  color: #2da6c4;
  display: flex;
  align-items: center;
  gap: 5px;
}

.filter-field select {
  flex: 1;
  padding: 5px 8px;
  border-radius: 4px;
  border: 1px solid #bbb;
  font-size: 14px;
}

.filter-field input {
  flex: 1;
  padding: 5px 8px;
  border-radius: 4px;
  border: 1px solid #bbb;
  font-size: 14px;
}

.apply-btn {
  margin-top: 10px;
  background: #2da6c4;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 7px 0;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.18s;
}

.apply-btn:hover {
  background: #268ca5;
}
</style>