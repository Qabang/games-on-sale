<template>
  <section class="List-view">
    <List />
  </section>
</template>

<script>
// @ is an alias to /src
import List from "@/components/List.vue";

export default {
  name: "ListView",
  components: {
    List,
  },
};
</script>
