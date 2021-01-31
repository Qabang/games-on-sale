<template>
  <div id="app">
    <header>
      <nav id="nav">
        <div id="logo" @click="onClick"></div>
        <ul>
          <li><router-link to="/">Deals</router-link></li>
          <li>
            <router-link to="/about">About</router-link>
          </li>
          <li>
            <router-link to="/stores">Stores</router-link>
          </li>
          <li>
            <router-link to="/list">
              Shopping list
              <span v-if="this.$store.state.shoppingList.length > 0"
                >({{ this.$store.state.shoppingList.length }})
              </span>
            </router-link>
          </li>
        </ul>
      </nav>
    </header>
    <div id="wrapper">
      <router-view />
    </div>
    <div id="back-to-top" @click="scrollToTop()">
      <b-icon icon="arrow-up" font-scale="2"></b-icon>
    </div>
    <footer>
      <section class="wrapper">
        <h2>Get in touch</h2>
        <ul>
          <li>
            <a
              href="https://www.linkedin.com/in/sandra-lindstr%C3%B6m-b11903153/"
              title="Linkedin"
              ><b-icon icon="linkedin" font-scale="2"></b-icon
              ><span>Linkedin</span></a
            >
          </li>
          <li>
            <a href="mailto:sandra.lindstrom@iths.se" title="Email"
              ><b-icon icon="envelope-fill" font-scale="2"></b-icon>
              <span>Email</span></a
            >
          </li>
          <li>
            <a href="https://github.com/Qabang" title="Github"
              ><b-icon icon="github" font-scale="2"></b-icon
              ><span>Github</span></a
            >
          </li>
        </ul>
      </section>
    </footer>
  </div>
</template>
<script>
export default {
  created() {
    window.addEventListener("scroll", this.toggleUpArrow);

    this.$store.dispatch("getStores");
  },
  props: {},
  methods: {
    toggleUpArrow() {
      if (window.innerHeight < window.scrollY) {
        document.querySelector("#back-to-top").style.bottom = "0";
      } else {
        document.querySelector("#back-to-top").style.bottom = "-100px";
      }
    },
    scrollToTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    onClick() {
      if (this.$route.path != "/") {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style lang="scss">
@import "./assets/style/variables.scss";

#app {
  text-align: center;
  background-color: $primary-dark;
  min-height: 100vh;
}

header {
  background-image: linear-gradient($primary-dark, $secondary-dark);
  margin-bottom: 30px;
  box-shadow: $shadow;
}
#wrapper {
  max-width: $wrapper-width;
  margin: auto;
}
#nav {
  padding: 20px 30px;
  padding-top: 60px;
  max-width: $wrapper-width;
  margin: auto;

  ul {
    display: flex;
    margin: 0;
    padding: 0;
    justify-content: flex-end;

    li {
      margin: 0 20px;
      margin-top: auto;
      list-style-type: none;
    }
  }
}

#nav a {
  font-weight: bold;
  color: $highlight;
  letter-spacing: 2px;
  font-size: 1.2rem;
}

#nav a.router-link-exact-active {
  color: $secondary;
  text-decoration: underline;
}

#logo {
  background-image: url(./assets/logo.svg);
  height: 140px;
  width: 73px;
  cursor: pointer;
}

#back-to-top {
  width: 60px;
  height: 70px;
  background: $secondary;
  position: fixed;
  bottom: -100px;
  right: 40px;
  padding-top: 20px;
  transition: 1s;
  box-shadow: 4px 4px 4px rgb(46, 46, 46);
  border-radius: 10px 10px 0 0;

  .b-icon {
    fill: $highlight;
  }

  &:hover {
    background: darken($secondary, 10%);
    cursor: pointer;
  }
}

footer {
  background: darken($primary, 15%);
  color: $secondary;
  text-align: left;
  padding: 10px;

  .wrapper {
    max-width: $wrapper-width;
    padding: 20px;
    margin: auto;

    ul {
      display: flex;
      padding-left: 0;
      margin-left: -35px;

      li {
        margin: 10px 30px;
        list-style-type: none;
        padding: 15px;

        span {
          position: absolute;
          left: -99999999px;
        }

        .b-icon {
          fill: $secondary;

          &:hover {
            fill: $primary;
          }
        }
      }
    }
  }
}
</style>
