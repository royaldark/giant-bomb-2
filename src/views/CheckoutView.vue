<script lang="ts">
import { defineComponent } from 'vue';
import { DateTime, Duration } from 'luxon';
import GiantBombClient from '@/client'
import { giantBombApiKey } from '@/constants'
import GameDetails from '@/components/GameDetails.vue';

interface PurchaseOption {
  description: string,
  duration: Duration,
  price: string,
}

interface CheckoutData {
  loading: boolean,
  guid: string,
  client: GiantBombClient,
  stage: "initial" | "confirm" | "complete",
  game?: Record<string, any>,
  purchaseOptions: PurchaseOption[],
  selectedOption?: PurchaseOption,
  returnDate?: DateTime,
}

export default defineComponent({
  components: {
    GameDetails,
  },
  data(): CheckoutData {
    return {
      loading: true,
      guid: this.$route.params.guid as string,
      client: new GiantBombClient(giantBombApiKey),
      stage: "initial",
      purchaseOptions: [
        {
          description: "1 Day",
          duration: Duration.fromObject({ days : 1 }),
          price: "3.99",
        },
        {
          description: "1 Week",
          duration: Duration.fromObject({ weeks : 1 }),
          price: "6.99",
        }
      ]
    }
  },
  async created() {
    const response = await this.client.getGame(this.guid)
    this.game = response.results
    this.loading = false
  },
  methods: {
    selectOption(option: PurchaseOption) {
      this.selectedOption = option;
      this.stage = "confirm";
    },
    cancelPurchase() {
      this.stage = "initial";
    },
    completePurchase() {
      this.stage = "complete";
      this.returnDate = DateTime.now().plus(this.selectedOption?.duration)
    },
  }
})
</script>

<template>
  <main>
    <div v-if="loading">Loading...</div>

    <div v-if="!loading && game">
      <h2>{{ game.name }}</h2>

      <!-- TODO: This logic could maybe be a separate component -->
      <div class="rental-options">
        <div v-if="stage == 'initial'">
          <h3>Rental Options</h3>
          <button v-for="option in purchaseOptions" :key="option.description" @click="selectOption(option)" class="purchase-option">
            {{ option.description }}: ${{ option.price }}
          </button>
        </div>

        <div v-if="stage == 'confirm'">
          <h3>Confirm Purchase</h3>
          <button class="complete-purchase" @click="completePurchase">1-Click Checkout: Pay ${{selectedOption?.price}}</button>
          <button class="cancel-purchase" @click="cancelPurchase">Cancel Purchase</button>
        </div>

        <div v-if="stage == 'complete'">
          <h3>Purchase Complete!</h3>
          Your rental is good through {{ returnDate?.toLocaleString() }}.
        </div>
      </div>

      <div>
        <img v-if="game.image" :src="game.image.thumb_url" />
      </div>
      
      <GameDetails :game="game" />
    </div>
  </main>
</template>

<style scoped>
.rental-options {
  display: inline-block;
  border: 2px solid black;
  border-radius: 1rem;
  padding: 0.5rem;
  margin: 0.5rem 0;
  min-width: 20rem;
}

.rental-options button {
  display: block;
  margin: 0.25rem;
  padding: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  width: calc(100% - 0.5rem);
}

.rental-options button.complete-purchase {
  background-color: #059033;
  color: white;
  font-weight: bold;
}

.rental-options button.cancel-purchase {
  background-color: #8b0000;
  color: white;
  font-weight: bold;
}
</style>
