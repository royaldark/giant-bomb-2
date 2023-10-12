<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import InlineList from './InlineList.vue';

export default defineComponent({
  components: {
    InlineList,
  },
  props: {
    game: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },
  methods: {
    pluralize(word: string, arity: number) {
      return arity == 1 ? word : `${word}s`
    }
  },
})
</script>

<template>
  <table class="details">
    <tr v-if="game.original_release_date">
        <td>Released</td>
        <td>{{ game.original_release_date.substring(0, 4) }}</td>
    </tr>
    <tr v-if="game.genres">
        <td>{{ pluralize("Genre", game.genres.length) }}</td>
        <td><InlineList :items="game.genres.map((g: any) => g.name)" /></td>
    </tr>
    <tr v-if="game.themes">
        <td>{{ pluralize("Theme", game.themes.length) }}</td>
        <td><InlineList :items="game.themes.map((t: any) => t.name)" /></td>
    </tr>
    <tr v-if="game.developers">
        <td>{{ pluralize("Developer", game.developers.length) }}</td>
        <td><InlineList :items="game.developers.map((d: any) => d.name)" /></td>
    </tr>
    <tr v-if="game.publishers">
        <td>{{ pluralize("Publisher", game.publishers.length) }}</td>
        <td><InlineList :items="game.publishers.map((p: any) => p.name)" /></td>
    </tr>
    <tr v-if="game.platforms">
        <td>{{ pluralize("Platform", game.platforms.length) }}</td>
        <td><InlineList :items="game.platforms.map((p: any) => p.name)" /></td>
    </tr>
  </table>
</template>

<style scoped>
td:first-child {
  font-weight: bold;
  padding-right: 0.5rem;
}
</style>