<template>
  <section class="about">
    <div class="wrapper">
      <h2>About Games on sale</h2>
      <div class="textbox">
        This site is a price comparison site for PC games. We get the data from
        <a href="https://apidocs.cheapshark.com/" rel="noopener" target="_blank"
          >CheapShark API</a
        >
        and this is how they describe their service:

        <blockquote>
          CheapShark is a price comparison website for digital PC Games. We keep
          track of prices across multiple stores including Steam,
          GreenManGaming, Fanatical, and many others.
        </blockquote>

        <h3>About this project</h3>
        <p>
          This project was created as a final submission in our first course on
          Vue at the IT-högskolan in Gothenburg during my training as a
          JavaScript developer.
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ListView",
};
</script>
<style scoped lang="scss">
@import "../assets/style/variables.scss";

.about {
  .wrapper {
    background: $primary;
    padding: 20px;
    max-width: $wrapper-width;
  }

  h2 {
    margin-top: 30px;
  }

  .textbox {
    width: 500px;
    margin: 25px auto 30px;
    color: $highlight;
    line-height: 1.5;
    text-align: left;
  }

  a {
    color: $secondary;
    &:hover {
      color: $highlight;
      text-decoration: underline;
    }
  }

  blockquote {
    padding: 10px;
    position: relative;
    margin: 30px auto;
    color: lighten($highlight, 30%);
    z-index: 1;
    text-align: center;

    &:before {
      content: '"';
      position: absolute;
      top: -50px;
      z-index: -1;
      left: -15px;
      font-size: 6rem;
      color: $secondary;
      font-family: $font-highlight;
    }
  }

  p {
    color: $highlight;
  }
}
</style>