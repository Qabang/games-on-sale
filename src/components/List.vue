<template>
  <section class="shopping-list">
    <h2>Shopping List</h2>
    <p v-if="$store.state.shoppingList.length === 0">
      The shopping list is currently empty.
    </p>
    <div class="flex-wrapper" v-for="deal in deals" :key="deal.dealID">
      <div class="deal" @click="goToStore(deal.dealID)">
        <h2>{{ deal.title }}</h2>

        <div class="price">
          <div
            :class="{ 'normal-price-striked': deal.salePrice > 0 }"
            v-if="deal.normalPrice"
          >
            {{ deal.normalPrice }}$
          </div>
          <template v-if="deal.salePrice > 0">
            <div class="sale-price" :sum="deal.salePrice">
              {{ deal.salePrice }}$
            </div>
            <div class="sale-percent">
              - {{ parseFloat(deal.savings).toFixed(0) }}%
            </div>
          </template>
        </div>

        <template v-for="store in stores">
          <template v-if="deal.storeID === store.storeID">
            <div
              class="store"
              @click="goToStore(deal.dealID)"
              :key="store.storeID"
            >
              <img :src="'https://www.cheapshark.com' + store.images.logo" />
              <b-icon icon="box-arrow-right" font-scale="1"></b-icon>
            </div>
          </template>
        </template>
      </div>
      <b-icon
        class="remove-item"
        icon="x"
        font-scale="3"
        :key="deal.dealID"
        @click="removeItem(deal.dealID)"
      ></b-icon>
    </div>
    <ul id="total" v-if="$store.state.shoppingList.length > 0">
      <li>Savings: {{ total.normal - total.sale }}$</li>
      <li>Total: {{ total.sale }}$</li>
    </ul>
  </section>
</template>

<script>
export default {
  name: "List",
  computed: {
    deals() {
      return this.$store.state.shoppingList;
    },
    stores() {
      return this.$store.state.stores;
    },
    total() {
      let sum_normal = 0;
      let sum_sale = 0;
      this.deals.forEach((deal) => {
        sum_sale += Number(deal.salePrice);
        sum_normal += Number(deal.normalPrice);
      });
      return {
        normal: parseFloat(sum_normal).toFixed(2),
        sale: parseFloat(sum_sale).toFixed(2),
      };
    },
  },
  methods: {
    goToStore(id) {
      // Due to CheapSharks policy we need to use CheapShark links when sending users to deals.
      location = "https://www.cheapshark.com/redirect?dealID=" + id;
      window.open(location, "_blank", "noopener,resizable,scrollbars");
      return;
    },
    removeItem(id) {
      this.$store.commit("removeDeal", id);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/style/variables.scss";

.shopping-list {
  background-color: rgb(255, 248, 185);
  //Lined paper effect start.
  background-image: linear-gradient(
      0deg,
      transparent 5em,
      rgba(255, 0, 0, 0.2) 0,
      transparent 5.1em
    ),
    linear-gradient(rgba(0, 0, 255, 0.3) 1px, transparent 0);
  background-size: 100% 2em;
  // Lined paper effect end.
  margin: auto 40px;
  color: $primary-dark;
  padding: 20px 0;

  h2 {
    color: $primary-dark;
    flex-basis: 100%;
    font-family: $font-highlight;
    font-size: 3rem;
  }

  p {
    color: $primary-dark;
    font-weight: 900;
  }

  #total {
    @extend h2;
    border-top: 4px solid $primary-dark;
    width: calc(100% - 100px);
    margin: auto;
    transform: rotate(1.5deg);
    text-align: right;
    list-style-type: none;

    li:first-child {
      font-size: 2rem;
      font-family: $font-secondary;
      text-transform: uppercase;
      font-weight: 900;
    }
  }

  .remove-item {
    justify-self: center;
    margin: auto;
    margin-right: 20px;

    &:hover {
      fill: $secondary;
      cursor: pointer;
    }
  }
}

.deal {
  display: flex;
  color: $primary-dark;
  width: calc(100% - 70px);
  box-sizing: border-box;
  margin: 20px auto;
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: 2px;

  h2 {
    font-size: 1.5rem;
    margin: 20px 0;
    color: $black;
    text-transform: uppercase;
    font-weight: 700;
    max-width: 45%;
  }

  &:hover {
    cursor: pointer;
    background: rgba($secondary, 0.8);
  }
}
.game-poster {
  width: 120px;
  height: auto;
  margin: 20px auto;
}

.store {
  margin-top: 20px;
  font-size: 1.2rem;
  max-height: 200px;
  justify-self: end;
  padding: 20px;

  .b-icon {
    fill: $primary;
    margin: auto 20px;
  }

  img {
    width: 60px;
    height: auto;
  }
}
.price {
  display: flex;
  justify-content: center;
  padding: 0 30px;
  margin: auto 0;
  div {
    margin: 10px;
    justify-self: center;
    padding: 10px;
  }

  .normal-price-striked {
    text-decoration: line-through;
  }

  .sale-percent {
    display: block;
    width: 100px;
    margin: 10px auto;
    background-image: $sale-gradient;
    padding: 10px;
    border-radius: 2px;
    text-shadow: 1px 0 black;
    font-weight: 900;
  }

  .sale-price {
    font-weight: 600;
  }
}
</style>
