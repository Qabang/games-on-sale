<template>
  <section class="home">
    <template v-if="this.$route.params.storeID">
      <h2>Deals from {{ $route.params.name }}</h2>
      <router-link to="/about" id="backArrow">
        <b-icon icon="arrow-left-short" font-scale="1.5"></b-icon>
        Back to stores
      </router-link>
    </template>
    <Search
      @search-query="getSearchQuery"
      @deals="updateDeals"
      :deals="deals"
      :show="show"
    />
    <Deals :searchQuery="searchQuery" @deals="updateDeals" :deals="deals" />
  </section>
</template>

<script>
// @ is an alias to /src
import Deals from "@/components/Deals.vue";
import Search from "@/components/Search.vue";

export default {
  name: "Home",
  components: {
    Deals,
    Search,
  },
  props: {
    searchQuery: { type: String, default: null },
    deals: { type: [Array, Object], default: () => [] },
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    getSearchQuery(input) {
      this.searchQuery = input;
    },

    updateDeals(deals) {
      this.deals = deals;
      if (this.searchQuery != null || this.searchQuery != undefined) {
        this.show = true;
      } else {
        this.show = false;
      }
    },
  },
};
</script>
<style lang="scss">
@import "../assets/style/variables.scss";

#backArrow {
  display: inline-block;
  position: relative;
  color: $highlight;
  margin: 20px;
  font-size: 1.2rem;
  padding-left: 30px;

  &:hover {
    color: $secondary;
  }

  .b-icon {
    position: absolute;
    margin-top: 1px;
    left: 0;
  }
}

.home {
  color: $highlight;
}
</style>