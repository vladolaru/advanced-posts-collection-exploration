<template>
  <div id="app">
    <app-header/>
    <section v-if="simulationmode" class="container">
      <app-simulation/>
      <app-form/>
    </section>
    <section v-else class="container">
      <app-grid/>
      <app-form/>
    </section>
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import AppGrid from "./components/AppGrid.vue";
import AppSimulation from "./components/AppSimulation.vue";
import AppForm from "./components/AppForm.vue";
import { mapState } from 'vuex'

export default {
  components: {
    AppHeader,
    AppGrid,
    AppSimulation,
    AppForm
  },
  computed: {
    ...mapState(["simulationmode"]),
  },
  created() {
    this.$store.commit("initialArrIndex", window.location.search);
  }
};
</script>

<style lang="scss">
#app {
  margin: 5vmin 5vmin 0;
}

.container {
  display: flex;
}

@media screen and (max-width: 700px) {
  .container {
    flex-direction: column;
  }
}
</style>
