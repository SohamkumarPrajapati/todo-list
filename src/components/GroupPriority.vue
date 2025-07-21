<template>
    <div class="groupPriority-popup">
        <button @click="setGroupPriority">Apply</button>
    </div>
</template>


<script>

export default {
    name: 'GroupPriority',
    data: function () {
        return {

        };
    },
    methods: {
        setGroupPriority() {
            this.$emit('apply-group-priority');
        }
    }
}
</script>


<style scoped>
.groupPriority-popup {
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
</style>