<template>
  <section v-if="showDeals" class="deals">
    <p v-if="error != ''">Sorry something went wrong... <br />{{ error }}</p>
    <template v-if="deals != undefined && deals.length == 0 && !loading">
      <p>
        Sorry we couldn't find any deals
        <span>for {{ storeName }}</span
        >.
      </p>
    </template>

    <template v-if="loading && error === ''">
      <b-icon
        icon="three-dots"
        id="loading"
        animation="cylon"
        font-scale="4"
      ></b-icon>
    </template>

    <template v-if="!loading">
      <div
        class="deal-card"
        v-for="deal in deals"
        :key="deal.dealID"
        :class="deal.dealID"
      >
        <img
          class="game-poster"
          v-if="deal.thumb"
          :src="deal.thumb"
          :alt="'Poster for the game ' + deal.title"
        />
        <h2>{{ deal.title }}</h2>
        <button @click="addToList(deal)">Add to your list</button>
        <div class="steamRating">
          <div class="rating" v-if="deal.steamRatingPercent > 0">
            <div v-for="(star, index) in 5" :key="index" class="star">
              <template
                v-if="index < Math.round((deal.steamRatingPercent / 100) * 5)"
              >
                <b-icon icon="star-fill" font-scale="1"></b-icon>
              </template>
              <template v-else>
                <b-icon
                  class="gray-star"
                  icon="star-fill"
                  font-scale="1"
                ></b-icon>
              </template>
            </div>
            <span>({{ deal.steamRatingCount }})</span>
          </div>
          <p v-if="deal.steamRatingText">"{{ deal.steamRatingText }}"</p>
        </div>

        <div class="price">
          <span
            :class="{ 'normal-price-striked': deal.salePrice > 0 }"
            v-if="deal.normalPrice"
          >
            {{ deal.normalPrice }}$</span
          >
          <template v-if="deal.salePrice > 0">
            <span class="sale-price">{{ deal.salePrice }}$</span>
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
              <div>Get it at</div>
              <img
                :src="'https://www.cheapshark.com' + store.images.banner"
                :alt="'Banner for ' + store.storeName"
              />
              <b-icon icon="box-arrow-right" font-scale="1"></b-icon>
            </div>
          </template>
        </template>
      </div>
    </template>
  </section>

  <section
    v-else-if="!loading && (deals.length > 0 || Object.keys(deals).length > 0)"
    class="game-lookup"
  >
    <div
      class="game-card deal-card"
      v-for="(game, index) in deals"
      :key="index"
    >
      <img
        class="game-poster"
        v-if="game.info"
        :src="game.info.thumb"
        :alt="'Poster for the game ' + game.info.title"
      />
      <h2 v-if="game.info">{{ game.info.title }}</h2>
      <h3>Deals:</h3>
      <div class="game-deal" v-for="(deal, i) in game.deals" :key="i">
        <template v-if="deal.price != deal.retailPrice">
          <div class="price">
            <span
              :class="{
                'normal-price-striked': deal.price != deal.retailPrice,
              }"
              v-if="deal.retailPrice"
            >
              {{ deal.retailPrice }}$
            </span>
            <template v-if="deal.price > 0">
              <span class="sale-price">{{ deal.price }}$</span>
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
                <img
                  :src="'https://www.cheapshark.com' + store.images.banner"
                />
                <b-icon icon="box-arrow-right" font-scale="1"></b-icon>
              </div>
            </template>
          </template>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Deals",
  props: {
    deals: { type: [Array, Object] },
    searchQuery: { type: String },
  },
  computed: {
    stores() {
      return this.$store.state.stores;
    },
  },
  mounted() {
    this.loading = true;
    if (this.$route.params.name) {
      // Get the name of the store currently viewed.
      this.storeName = this.$route.params.name;
    }

    if (this.$route.params.storeID) {
      // Edit url to get deals from the specific store.
      this.url += "storeID=" + this.$route.params.storeID;
    }
    this.getAllDeals();
  },
  watch: {
    searchQuery(newInput) {
      this.getDeals(newInput);
    },
    $route(newInput) {
      if (newInput.path === "/") {
        //Reset url when there are no $route.params and get all the deals.
        this.url = "https://www.cheapshark.com/api/1.0/deals?";
        this.getAllDeals();
      }
    },
  },
  data() {
    return {
      showDeals: true,
      url: "https://www.cheapshark.com/api/1.0/deals?",
      storeName: null,
      loading: true,
      error: "",
    };
  },
  methods: {
    goToStore(id) {
      // Due to cheapsharks policy we need to use CheapShark links when sending users to deals.
      location = "https://www.cheapshark.com/redirect?dealID=" + id;
      window.open(location, "_blank", "noopener,resizable,scrollbars");
    },
    getAllDeals() {
      this.loading = true;
      this.axios
        .get(this.url)
        .then((response) => {
          this.$emit("deals", response.data);
          this.loading = false;
        })
        .catch((error) => (this.error = error));
    },
    getDeals(query) {
      // If empty string or undefined we get and show all the deals.
      if (query === "" || query === undefined || query === null) {
        this.getAllDeals();
        this.showDeals = true;
      } else if (this.$route.params.storeID) {
        this.axios
          .get(this.url + "&title=" + query)
          .then((response) => {
            this.$emit("deals", response.data);
            this.loading = false;
          })
          .catch((error) => (this.error = error));
      } else {
        this.showDeals = false;
        this.loading = true;

        this.axios
          .get("https://www.cheapshark.com/api/1.0/games?title=" + query)
          .then((response) => {
            let gameIdString = "";
            response.data.forEach((element) => {
              console.log(response.data.length);
              gameIdString += element.gameID + ",";
            });

            gameIdString = gameIdString.slice(0, -1);
            let search_url = "https://www.cheapshark.com/api/1.0/games?ids=";
            let alter_response = false;

            // The api url differ if there is only one game.
            if (response.data.length === 1) {
              search_url = "https://www.cheapshark.com/api/1.0/games?id=";
              // We need to change the response.data object when there is only
              // one item otherwise it won't render correctly.
              alter_response = true;
            }

            this.axios
              .get(search_url + gameIdString)
              .then((response) => {
                let result = response.data;

                // We need to rework the object to be able to display it corrctly.
                if (alter_response) {
                  result = { gameIdString: response.data };
                }

                this.$emit("deals", result);
                this.loading = false;
              })
              .catch((error) => (this.error = error));
          })
          .catch((error) => (this.error = error));
      }
    },
    addToList(deal) {
      this.$store.commit("addToList", deal);

      // Create a copy of the deals card and slide it out of view so
      // that the user get feedback after clicking the add to list button.
      let card = document.getElementsByClassName(deal.dealID);
      let effect_div = document.createElement("div");
      effect_div.style.width = "350px";
      effect_div.style.height = "550px";
      effect_div.style.background = "#183a37";
      effect_div.style.position = "absolute";
      effect_div.style.transition = "2s";
      effect_div.classList.add("effect-card-" + deal.dealID);
      effect_div.innerHTML = card[0].innerHTML;
      card[0].appendChild(effect_div);

      setTimeout(() => {
        document
          .getElementsByClassName("effect-card-" + deal.dealID)[0]
          .remove();
      }, 100);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../assets/style/variables.scss";

.deals,
.game-lookup {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.game-card {
  justify-content: flex-start;

  .store {
    justify-self: unset;
  }

  .game-deal {
    margin: 10px auto;
    &:last-child {
      margin-bottom: auto;
    }
  }

  h3 {
    font-size: 1.2rem;
    color: $highlight;
  }
}

.deal-card {
  position: relative;
  box-shadow: $shadow;
  background: $primary;
  color: $white;
  width: 350px;
  margin: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 2px;

  h2 {
    font-size: 1.5rem;
    margin: 20px 0;
  }

  button {
    color: $highlight;
    background: $secondary;
    padding: 5px 10px;
    margin: 20px auto;
    border-radius: 10px;
    font-weight: 500;
    border: 1px solid black;
    box-shadow: 2px 2px 4px rgba(black, 0.7);

    &:hover {
      background: lighten($secondary, 5%);
      cursor: pointer;
    }
  }
}

.game-poster {
  width: 120px;
  height: auto;
  margin: 20px auto;
}

.steamRating {
  width: 100%;
}

.rating {
  margin: 20px 0;
  height: 20px;
  display: flex;
  justify-content: center;

  .star {
    margin: 0 5px;
  }

  span {
    font-size: 0.5rem;
    font-weight: bold;
    margin: auto 5px;
  }
}

.b-icon {
  fill: yellow;
}

.gray-star {
  fill: gray;
}

.store {
  margin-top: 20px;
  font-size: 1.2rem;
  max-height: 200px;
  justify-self: end;
  padding-bottom: 10px;

  &:hover {
    font-weight: bold;
    text-decoration: underline;
    border-bottom: 2px solid #fff;
    padding-bottom: 8px;
  }

  .b-icon {
    fill: $white;
    margin: auto 10px;
  }
}

.price {
  display: flex;
  justify-content: center;
  padding: 0 30px;
  margin: auto 0;
  span {
    margin: 10px;
    justify-self: flex-start;
  }

  .normal-price-striked {
    text-decoration: line-through;
  }

  .sale-percent {
    display: inline;
    background-image: $sale-gradient;
    padding: 10px;
    margin-left: auto;
    border-radius: 2px;
    text-shadow: 1px 0 black;
    font-family: $font-primary;
    font-size: 1.2rem;
  }

  .sale-price {
    font-weight: 600;
  }
}

.game-deal {
  .store {
    border-bottom: solid 2px $secondary;
    padding: 20px;

    &:hover {
      background: rgba($white, 0.1);
      cursor: pointer;
    }
  }
}

#loading {
  fill: $highlight;
}
</style>
