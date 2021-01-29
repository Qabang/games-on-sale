<template>
  <section>
    <input
      type="text"
      v-model="searchQuery"
      @keyup.enter="getSearchQuery()"
      placeholder="search..."
    />
    <div class="search-button" tabindex="0">
      <b-icon icon="search" id="search-icon"></b-icon>
    </div>
    <p id="search-result-msg" v-if="visible">
      We found {{ Object.keys(deals).length }} deals!
      <b-icon icon="x" font-scale="1.7" @click="onClick(null)"></b-icon>
    </p>
  </section>
</template>

<script>
export default {
  name: "Search",
  props: {
    searchQuery: { type: String },
    deals: { type: [Array, Object] },
    show: Boolean,
  },
  data() {
    return {
      visible: this.show,
    };
  },
  methods: {
    getSearchQuery() {
      this.$emit("search-query", this.searchQuery);
      this.searchQuery = null;
    },
    onClick(query) {
      this.$emit("search-query", query);
      this.visible = false;
      this.searchQuery = null;
    },
  },

  watch: {
    show(newValue) {
      this.visible = newValue;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../assets/style/variables.scss";
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: auto;
  margin-bottom: 20px;
}

input {
  position: relative;
  border: 1px solid black;
  border-radius: 3px;
  padding: 2px 10px;
  padding-right: 35px;
  margin-left: 35px;
}

.search-button {
  position: relative;
  right: 35px;
  width: 35px;
  height: 30px;
  box-sizing: border-box;
  padding: 5px;
  padding-left: 5px;

  &:hover,
  &:focus {
    cursor: pointer;
    #search-icon {
      fill: $secondary;
    }
  }
}

#search-icon {
  width: 100%;
  height: 100%;
  fill: $primary;
}

#search-result-msg {
  display: block;
  margin: 20px 39%;
  padding: 20px;
  border-radius: 5px;
  border: 2px solid $highlight;
  color: $highlight;
  flex-basis: 100%;
  background: $secondary-dark;
  box-shadow: $shadow;
  line-height: 1.5;

  .b-icon {
    float: right;
    margin-top: -4px;
  }
}
</style>
