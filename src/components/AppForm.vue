<template>
  <aside>
    <h3>Main Parameters</h3>
    <fieldset class="inline-parent">
      <label for="columns">{{ $t("form.columns") }}</label>
      <input
        id="columns"
        type="number"
        :min="mincolumns"
        :max="maxcolumns"
        @input="$store.commit(`updateColumns`, $event.target.value)"
        :value="columns"
      >
    </fieldset>
    <fieldset class="inline">
      <label for="mincolumns">{{ $t("form.mincolumns") }}</label>
      <input
        id="mincolumns"
        type="number"
        min="1"
        :max="maxcolumns"
        @input="$store.commit(`updateMinColumns`, $event.target.value)"
        :value="mincolumns"
      >
    </fieldset>
    <fieldset class="inline">
      <label for="maxcolumns">{{ $t("form.maxcolumns") }}</label>
      <input
        id="maxcolumns"
        type="number"
        min="1"
        max="12"
        @input="$store.commit(`updateMaxColumns`, $event.target.value)"
        :value="maxcolumns"
      >
    </fieldset>


    <fieldset class="inline-parent">
      <label for="rows">{{ $t("form.rows") }} <span class="label-extra-info">{{ $t("form.rowsUnits") }}</span></label>
      <input
        id="rows"
        type="number"
        :min="minrows"
        :max="maxrows"
        @input="$store.commit(`updateRows`, $event.target.value)"
        :value="rows"
      >
    </fieldset>
    <fieldset class="inline">
      <label for="minrows">{{ $t("form.minrows") }}</label>
      <input
        id="minrows"
        type="number"
        min="1"
        :max="maxrows"
        @input="$store.commit(`updateMinRows`, $event.target.value)"
        :value="minrows"
      >
    </fieldset>
    <fieldset class="inline">
      <label for="maxrows">{{ $t("form.maxrows") }}</label>
      <input
        id="maxrows"
        type="number"
        min="1"
        max="12"
        @input="$store.commit(`updateMaxRows`, $event.target.value)"
        :value="maxrows"
      >
    </fieldset>

    <fieldset>
      <label for="featuresize">{{ $t("form.featuresize") }} <span class="label-extra-info">{{ $t("form.featuresizeUnits") }}</span></label>
      <input
        id="featuresize"
        type="number"
        :min="minfeaturesize"
        :max="maxfeaturesize"
        @input="$store.commit(`updateFeatureSize`, $event.target.value)"
        :value="featuresize"
      >
      <label class="label-secondary">{{ $t("form.featuresizeExtra") }}</label>
    </fieldset>

    <h3>Presentational Options</h3>
    <fieldset>
      <label for="columngap">{{ $t("form.columngap") }} <span class="label-extra-info">{{ $t("form.units") }}</span></label>
      <input
        id="columngap"
        type="number"
        min="0"
        max="50"
        @input="$store.commit(`updateColumnGap`, $event.target.value)"
        :value="columngap"
      >
    </fieldset>

    <fieldset>
      <label for="rowgap">{{ $t("form.rowgap") }} <span class="label-extra-info">{{ $t("form.units") }}</span></label>
      <input
        id="rowgap"
        type="number"
        min="0"
        max="50"
        @input="$store.commit(`updateRowGap`, $event.target.value)"
        :value="rowgap"
      >
    </fieldset>

    <button @click="showCodeModal = true">{{ $t("form.codebutton") }}</button>
    <button type="reset" @click="$store.commit(`resetGrid`)">{{ $t("form.reset") }}</button>
    <app-modal v-if="showCodeModal" @close="showCodeModal = false">
      <h3 slot="header">{{ $t("modal.header.yourcode") }}</h3>
      <div slot="body">
        <app-code/>
      </div>
    </app-modal>

    <p class="wat" @click="showExplainModal = true">{{ $t("form.project") }}</p>
    <app-modal v-if="showExplainModal" @close="showExplainModal = false">
      <h3 slot="header">{{ $t("modal.header.what") }}</h3>
      <div slot="body">
        <app-explain/>
      </div>
    </app-modal>
  </aside>
</template>

<script>
import AppExplain from "./AppExplain.vue";
import AppModal from "./AppModal.vue";
import AppCode from "./AppCode.vue";
import { mapState } from "vuex";

export default {
  components: {
    AppExplain,
    AppModal,
    AppCode
  },
  data() {
    return {
      showCodeModal: false,
      showExplainModal: false
    };
  },
  computed: {
    ...mapState([
      "columns", "mincolumns", "maxcolumns",
      "rows", "minrows", "maxrows",
      "featuresize", "minfeaturesize", "maxfeaturesize",
      "featuresizeposition",
      "columngap", "rowgap"])
  },
  watch: {
    columns(newVal, oldVal) {
      let payload = {
        newVal,
        oldVal,
        direction: "colArr"
      };
      this.$store.commit("adjustArr", payload);
    },
    rows(newVal, oldVal) {
      let payload = {
        newVal,
        oldVal,
        direction: "rowArr"
      };
      this.$store.commit("adjustArr", payload);
    }
  }
};
</script>

<style lang="scss" scoped>
aside {
  margin: 60px 60px;
  font-size: 17px;
  width: 500px;
}

.wat {
  font-family: "Caveat", cursive;
  font-size: 22px;
  margin-top: 18px;
  color: #a8c9cc;
  opacity: 0.9;
  font-weight: normal;
  cursor: pointer;
}

@media screen and (max-width: 700px) {
  aside {
    width: 80vw;
    margin: 100px 50px;
  }
  button[type=reset]{
    margin-left: 20px;
  }
}
</style>
