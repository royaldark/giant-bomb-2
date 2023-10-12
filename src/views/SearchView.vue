<script lang="ts">
import { defineComponent } from 'vue'
import { debounce } from 'radash'
import GiantBombClient from '../client'
import { giantBombApiKey } from '../constants'
import InlineList from '@/components/InlineList.vue'

export default defineComponent({
  components: {
    InlineList,
  },
  data() {
    return {
      client: new GiantBombClient(giantBombApiKey),
      hasSearched: false,
      loading: false,
      query: "",
      currentPage: 0,
      resultsPerPage: 10,
      loadedResults: 0,
      totalResults: 0,
      results: new Array<Record<string, any>>(),
      requestCounter: -1,
    }
  },
  created() {
    this.searchDebounced = debounce({ delay: 500 }, this.search.bind(this))
  },
  methods: {
    async search() {
      if (this.query.length < 1) {
        return
      }

      const currentCounter = ++this.requestCounter

      try {
        this.loading = true;

        const response = await this.client.search({
          query: this.query,
          limit: this.resultsPerPage,
        })

        if (this.requestCounter != currentCounter) {
          // Prevent out-of-order results. If there is any newer request, cancel
          // what we're doing and defer to the newer response.
          return
        }

        this.loadedResults = response.number_of_page_results;
        this.totalResults = response.number_of_total_results;
        this.currentPage = 1;
        this.results = response.results;
        this.hasSearched = true;
      } finally {
        if (this.requestCounter == currentCounter) {
          this.loading = false;
        }
      }
    },
    async loadNextPage() {
      const response = await this.client.search({
        query: this.query,
        limit: this.resultsPerPage,
        page: this.currentPage + 1,
      })

      this.loadedResults += response.limit;
      this.totalResults += response.number_of_total_results;
      this.currentPage = this.currentPage + 1;
      this.results.push(...response.results);
    },

    // It feels gross to have this stub here, but it makes TypeScript happy.
    // There is probably a better way to handle this.
    searchDebounced() {},
  },
})
</script>

<template>
  <main>
    <input type="text" placeholder="Search..." v-model="query" v-on:input="searchDebounced"/>

    <section v-if="loading">
      Searching...
    </section>

    <section v-if="!loading && hasSearched" class="results">
      <div class="result-count">
        <span v-if="loadedResults == totalResults">
          {{ totalResults }} result{{ totalResults == 1 ? '' : 's' }}
        </span>

        <span v-else>
          Showing {{ loadedResults }} of {{ totalResults }} results
        </span>
      </div>

      <div v-for="result in results" :key="result.id" class="result">
        <div class="result--left-side">
          <img v-if="result.image" :src="result.image.icon_url" :alt="result.name + ' Cover Art'">
        </div>

        <div class="result--right-side">
          <div class="result--title">
            {{ result.name }}
            <span v-if="result.original_release_date">({{ result.original_release_date.substring(0, 4) }})</span>
          </div>

          <div v-if="result.platforms">
            Available on:
            <InlineList
              :items="result.platforms.map((p: any) => p.abbreviation)"
              :labels="result.platforms.map((p: any) => p.name)" />
          </div>

          <div>{{ result.deck }}</div>

          <RouterLink :to="'/checkout/' + result.guid">Rent Game</RouterLink>
        </div>
      </div>

      <a v-on:click="loadNextPage">
        <button v-if="loadedResults < totalResults" class="next-page-button">
          <div>Load {{ resultsPerPage }} More Results</div>
        </button>
      </a>
    </section>
  </main>
</template>

<style scoped>
input[type="text"] {
  width: 100%;
  border: none;
  border-bottom: 2px solid black;
  font-size: 1.5rem;
  outline: none;
  padding: 0.25rem;
}

.result-count {
  font-weight: bold;
  padding: 1rem;
  background-color: #f5f5f5;
}

.results {
  margin-top: 1rem;
}

.result {
  display: grid;
  grid-template-columns: max-content auto;
  column-gap: 1rem;
  padding: 0.5rem 1rem;
}

.result:nth-child(odd) {
  background-color: lightgray;
}

.result--left-side {
  align-self: center;
}

.result--title {
  font-weight: bold;
  font-size: 1.25rem;
}

.next-page-button {
  padding: 0 1rem;
  width: 100%;
  height: 3rem;
  display: grid;
  align-items: center;
  justify-items: left;
  font-size: 1.25rem;
  cursor: pointer;
  color: black;
  background-color: #f5f5f5;
  margin: auto;
  transition-duration: 0.4s;
  border: none;
}

.next-page-button:hover {
  background-color: #ffcba4;
}
</style>