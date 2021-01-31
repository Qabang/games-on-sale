<template>
  <section id="stores">
    <h1>The stores</h1>
    <p>Down below we list all the stores that we get the games deals from.</p>
    <p>
      If you want to add a store to your favourites just click the star on the
      store card
    </p>
    <div id="filter" @click="checkboxToggle">
      <input type="checkbox" @click="checkboxToggle" v-model="showFavourites" />
      <label> Filter on my favourite stores. </label>
    </div>
    <div class="flex-wrapper">
      <div
        v-for="store in stores"
        :key="store.storeID"
        :class="{ 'not-active': store.isActive === 0 }"
        class="store"
        :id="store.storeID"
      >
        <b-icon
          class="favourite"
          icon="star-fill"
          font-scale="1.2"
          @click="toggleFavorite(store.storeID, $event)"
          :class="{ active: store.favourite }"
        ></b-icon>
        <div @click="onClick(store.storeID, store.storeName)">
          <img :src="'https://www.cheapshark.com' + store.images.banner" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Stores",
  computed: {
    stores() {
      if (this.showFavourites) {
        return this.$store.state.favouriteStores;
      } else {
        return this.$store.state.stores;
      }
    },
  },
  data() {
    return {
      showFavourites: false,
      shops: [],
    };
  },
  methods: {
    onClick(id, name) {
      this.$router.push("/deals/" + id + "/" + name);
    },
    toggleFavorite(storeId, event) {
      this.$store.commit("toggleFavourite", storeId);

      // Gives the user feedback when adding/removing from favourite stores.
      event.target.classList.add("animate");
      setTimeout(() => {
        event.target.classList.remove("animate");
      }, 1000);
    },
    checkboxToggle() {
      if (document.querySelector("input").checked) {
        document.querySelector("input").checked = false;
      } else {
        document.querySelector("input").checked = true;
      }
      this.showFavourites = document.querySelector("input").checked;
    },
  },
};
</script>

<style lang="scss">
@import "../assets/style/variables.scss";

#stores {
  .store {
    padding: 20px;
    margin: 20px;
    background: $primary;
    min-width: 115px;

    @media (min-width: $breakpoint-tablet) {
      &:hover:not(.not-active) {
        background: $secondary;
        cursor: pointer;
      }
    }

    &.not-active {
      position: relative;

      &::before {
        content: "No active deals";
        position: absolute;
        z-index: 10;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
        color: #fff;
        text-shadow: -1px #000;
        background: rgba($gray, 0.7);
        display: block;
        padding: 10px;
      }
      div {
        width: 100%;
        height: 100%;
      }
      img {
        opacity: 25%;
      }

      &:hover {
        &::before {
          display: none;
        }
        img {
          opacity: 100%;
        }
      }
    }
  }

  .favourite {
    float: right;
    margin: 0 0 10px 20px;

    &.active {
      fill: yellow;
    }
    @media (min-width: $breakpoint-tablet) {
      &:hover {
        fill: rgba(yellow, 0.5);
      }
    }
    .animate {
      animation-name: rotationOnce;
      animation-duration: 1s;
      animation-iteration-count: 1;
      transform-origin: center center;
    }
    @keyframes rotationOnce {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }

  #filter {
    display: inline-block;
    margin: 30px auto;
    padding: 14px 20px 10px;
    border-radius: 5px;
    border: 2px solid $highlight;
    color: $highlight;
    background: $secondary-dark;
    box-shadow: $shadow;

    label {
      margin: 0 15px;
      color: $highlight;
      font-weight: 600;
      font-size: 0.85rem;
      padding-left: 18px;
    }
    input {
      padding: 5px;
      width: 18px;
      height: 18px;
      margin-top: 2px;
      position: absolute;
    }

    @media (min-width: $breakpoint-tablet) {
      &:hover {
        cursor: pointer;
        background: $secondary;

        label,
        input {
          cursor: pointer;
        }
      }
    }
  }
}
</style>