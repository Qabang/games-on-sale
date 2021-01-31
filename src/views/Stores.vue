<template>
  <section class="stores">
    <Stores />
  </section>
</template>

<script>
// @ is an alias to /src
import Stores from "@/components/Stores.vue";

export default {
  name: "StoresView",
  components: {
    Stores,
  },
  props: {
    stores: { type: Object },
  },
};
</script>
