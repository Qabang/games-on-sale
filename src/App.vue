<template>
  <div id="app">
    <header>
      <nav id="nav">
        <div id="offline-msg" v-if="!online" @click="toggleOfflineMsg">
          <b-icon icon="x" font-scale="2" @click="toggleMenu"></b-icon>
          <p>
            You are currently offline. <br />
            The contenet on the site are now served from cached data.
          </p>
        </div>
        <div id="logo" @click="onClick"></div>
        <div id="mobile-nav">
          <b-icon icon="dash" font-scale="6" @click="toggleMenu"></b-icon>
          <b-icon icon="dash" font-scale="6" @click="toggleMenu"></b-icon>
          <b-icon icon="dash" font-scale="6" @click="toggleMenu"></b-icon>
        </div>
        <ul id="desktop-nav">
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
          <b-icon
            id="close-mobile-nav"
            icon="x"
            font-scale="4"
            @click="toggleMenu"
          ></b-icon>
        </ul>
      </nav>
    </header>
    <div id="wrapper">
      <router-view />
    </div>
    <div id="back-to-top" @click="scrollToTop()">
      <b-icon icon="arrow-up" font-scale="2"></b-icon>
    </div>
    <div id="install-prompt-wrapper" v-if="hidePrompt">
      <div id="install-prompt-logo-wrapper">
        <div id="install-prompt-logo"></div>
      </div>
      <div id="install-prompt">
        Install <span>Games on sale</span> on your homescreen
      </div>
      <button @click="installApp($event)">Install</button>
      <b-icon
        icon="x"
        font-scale="2"
        @click="hideMyInstallPromotion"
        id="install-prompt-close"
      ></b-icon>
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
    window.addEventListener("offline", () => {
      this.online = false;
    });

    window.addEventListener("online", () => {
      this.online = true;
    });

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });

    // Check window scrollheight to toggle up arrow.
    window.addEventListener("scroll", this.toggleUpArrow);

    // Check the window.innerwidth to change the navigation look.
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });

    this.$store.dispatch("getStores");
  },
  mounted() {
    this.getOnlineStatus().then((isOnline) => {
      this.online = isOnline ? true : false;
    });
  },
  data() {
    return {
      online: false,
      deferredPrompt: null,
      hidePrompt: localStorage.hidePrompt,
    };
  },
  watch: {
    online() {
      this.getOnlineStatus().then((isOnline) => {
        this.online = isOnline ? true : false;
      });
    },
  },
  methods: {
    hideMyInstallPromotion() {
      document.getElementById("install-prompt-wrapper").style.display = "none";
    },
    installApp() {
      if (this.deferredPrompt === null) {
        return;
      }
      // Hide the app provided install promotion
      this.hideMyInstallPromotion();
      // Show the install prompt
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
          localStorage.hidePrompt = true;
        }
      });
    },
    toggleOfflineMsg() {
      let msg = document.getElementById("offline-msg");
      msg.classList.contains("open")
        ? msg.classList.remove("open")
        : msg.classList.add("open");
    },
    async getOnlineStatus() {
      if (navigator.onLine) {
        return fetch(location.origin, { method: "HEAD" })
          .then(() => true)
          .catch(() => false);
      }

      return new Promise((resolve) => resolve(false));
    },
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
    toggleMenu() {
      let nav = document.getElementById("desktop-nav");

      if (nav.style.right != "-500px" && nav.style.right != "") {
        nav.style.right = "-500px";
      } else {
        nav.style.right = 0;
      }
    },
  },
};
</script>

<style lang="scss">
@import "./assets/style/variables.scss";

#app {
  position: relative;
  text-align: center;
  background-color: $primary-dark;
  min-height: 100vh;
}

header {
  background-image: linear-gradient($primary-dark, $secondary-dark);
  margin-bottom: 30px;
  box-shadow: $shadow;
  max-height: 180px;
}
#wrapper {
  max-width: $wrapper-width;
  margin: auto;
  min-height: calc(100vh - 180px - 205px);
}
#nav {
  padding: 20px 30px;
  max-width: $wrapper-width;
  margin: auto;

  ul {
    display: flex;
    flex-direction: column;
    background: $highlight;
    position: absolute;
    z-index: 10;
    right: -500px;
    top: 0;
    margin: 0;
    padding: 30px 20px;
    justify-content: flex-end;
    transition: 0.5s;

    @media (min-width: $breakpoint-tablet) {
      display: flex;
      background: unset;
      position: unset;
      right: unset;
      top: unset;
      padding: 0;
      flex-direction: row;
      transition: unset;
    }

    li {
      margin: 20px;
      margin-top: auto;
      list-style-type: none;
      text-align: left;

      @media (min-width: $breakpoint-tablet) {
        margin: -28px 20px 0;
      }
    }

    a {
      color: $primary-dark;
      font-weight: bold;
      letter-spacing: 2px;
      font-size: 1.2rem;
      padding: 20px;

      &.router-link-exact-active {
        color: $secondary-dark;
        text-decoration: underline;
      }
      @media (min-width: $breakpoint-tablet) {
        padding: 0;
        color: $highlight;
        &.router-link-exact-active {
          color: $secondary;
        }
      }
    }
  }

  #mobile-nav {
    display: flex;
    flex-direction: column;
    margin-top: -48px;

    .b-icon {
      justify-self: flex-end;
      fill: $highlight;
      margin: -40px 0 -40px auto;
    }

    @media (min-width: $breakpoint-tablet) {
      display: none;
    }
  }

  #close-mobile-nav {
    position: absolute;
    top: 20px;
    right: 20px;

    @media (min-width: $breakpoint-tablet) {
      display: none;
    }
  }
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
  @media (min-width: $breakpoint-tablet) {
    &:hover {
      background: darken($secondary, 10%);
      cursor: pointer;
    }
  }
}

footer {
  background: darken($primary, 15%);
  color: $secondary;
  text-align: left;
  padding: 10px;
  max-height: 205px;

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
          @media (min-width: $breakpoint-tablet) {
            &:hover {
              fill: $primary;
            }
          }
        }
      }
    }
  }
}

#offline-msg {
  background-image: radial-gradient(red, darkred);
  border-radius: 10px;
  width: 20px;
  height: 20px;
  color: white;
  padding: 10px;
  border: 2px solid rgba(0, 0, 0, 0.5);
  display: inline-block;
  position: absolute;
  transform: translateX(-50%);
  margin-right: 50%;

  &:after {
    content: "Offline";
    color: $secondary;
    font-size: 12px;
    margin-top: 15px;
    margin-left: -18px;
    display: block;
  }

  p,
  .b-icon {
    display: none;
  }

  &.open {
    background: $primary;
    width: 80vw;
    border-color: $secondary;
    height: auto;

    p,
    .b-icon {
      display: block;
    }

    .b-icon {
      margin-left: auto;
    }

    &:after {
      display: none;
    }
  }
}

#install-prompt-wrapper {
  display: flex;
  bottom: 0;
  left: 0;
  margin-left: 50%;
  position: fixed;
  transform: translateX(-50%);
  background: $secondary-dark;
  border: $secondary solid 2px;
  color: $highlight;
  min-height: 70px;
  border-radius: 10px;
  flex-wrap: wrap;
  width: 100%;

  @media (min-width: $breakpoint-tablet) {
    flex-wrap: nowrap;
    width: unset;
  }

  & > div {
    margin: 20px 7.5px;
  }
  #install-prompt {
    flex-basis: 50%;

    span {
      font-weight: 900;
    }
    @media (min-width: $breakpoint-tablet) {
      flex-basis: unset;
    }
  }
  button {
    margin: auto 7.5px;
    background-color: lighten($primary, 10%);
    padding: 5px 10px;
    color: #ffffff;
    border-radius: 10px;
    flex-basis: 100%;

    &:hover {
      background-color: lighten($primary, 15%);
    }

    @media (min-width: $breakpoint-tablet) {
      flex-basis: unset;
    }
  }

  #install-prompt-logo-wrapper {
    border-right: 1px solid lighten($secondary-dark, 10%);
    height: 40px;
    margin: auto 7.5px;
    margin-left: 20px;
    flex-basis: 18%;

    div {
      height: 40px;
      width: 40px;
      border-radius: 20px;
      background-color: $primary-dark;
      background-image: url(./assets/logo.svg);
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      margin: 0 5px 0 0;
    }

    @media (min-width: $breakpoint-tablet) {
      flex-basis: unset;
    }
  }
  #install-prompt-close {
    margin: 16px 20px 20px;
    position: absolute;
    right: -10px;
    top: -10px;
    cursor: pointer;
    &:hover {
      fill: $secondary;
    }

    @media (min-width: $breakpoint-tablet) {
      position: unset;
    }
  }
}
</style>
