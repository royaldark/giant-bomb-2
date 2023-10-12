<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  export default defineComponent({
    props: {
      items: {
        type: Array as PropType<string[]>,
        required: true,
      },
      labels: Array as PropType<string[]>,
    },
  })
</script>

<template>
  <span v-for="(item, idx) in items" :key="idx" :title="labels?.[idx]">{{ item }}</span>
</template>

<style scoped>
  span {
    padding-left: 0.5rem;
    cursor: default;
  }

  span:first-child {
    padding-left: 0;
  }

  span:after {
    content: " \00b7"; 
  }

  span:last-child:after {
    content: ""; 
  }
</style>