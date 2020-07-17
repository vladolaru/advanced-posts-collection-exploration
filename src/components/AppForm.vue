<template>
  <aside>
    <div class="reset-wrapper">
      <h3 class="flush">Main Parameters</h3>
      <button type="reset" @click="$store.commit(`resetState`);">{{ $t("form.reset") }}</button>
    </div>

    <fieldset class="inline-parent">
      <label for="gridcolumns">{{ $t("form.gridcolumns") }}</label>
      <input
        id="gridcolumns"
        type="number"
        :min="mingridcolumns"
        :max="maxgridcolumns"
        @change="$store.commit(`updateGridColumns`, $event.target.value)"
        :value="gridcolumns"
      >
    </fieldset>
    <fieldset class="inline">
      <label for="mingridcolumns">{{ $t("form.mingridcolumns") }}</label>
      <input
        id="mingridcolumns"
        type="number"
        min="1"
        :max="maxgridcolumns"
        @change="$store.commit(`updateMinGridColumns`, $event.target.value)"
        :value="mingridcolumns"
      >
    </fieldset>
    <fieldset class="inline">
      <input
        id="maxgridcolumns"
        type="number"
        min="1"
        max="12"
        @change="$store.commit(`updateMaxGridColumns`, $event.target.value)"
        :value="maxgridcolumns"
      >
    </fieldset>


    <fieldset class="inline-parent">
      <label for="gridrows">{{ $t("form.gridrows") }} <span class="label-extra-info">{{ $t("form.gridrowsUnits") }}</span></label>
      <input
        id="gridrows"
        type="number"
        :min="mingridrows"
        :max="maxgridrows"
        @change="$store.commit(`updateGridRows`, $event.target.value)"
        :value="gridrows"
      >
    </fieldset>
    <fieldset class="inline">
      <label for="mingridrows">{{ $t("form.mingridrows") }}</label>
      <input
        id="mingridrows"
        type="number"
        min="1"
        :max="maxgridrows"
        @change="$store.commit(`updateMinGridRows`, $event.target.value)"
        :value="mingridrows"
      >
    </fieldset>
    <fieldset class="inline">
      <input
        id="maxgridrows"
        type="number"
        min="1"
        max="12"
        @change="$store.commit(`updateMaxGridRows`, $event.target.value)"
        :value="maxgridrows"
      >
    </fieldset>

    <span class="spacer"></span>

    <fieldset>
      <label for="featuresize">{{ $t("form.featuresize") }} <span class="label-extra-info">{{ $t("form.featuresizeUnits") }}</span></label>
      <input
        id="featuresize"
        type="number"
        :min="minfeaturesize"
        :max="maxfeaturesize"
        @change="$store.commit(`updateFeatureSize`, $event.target.value)"
        :value="featuresize"
      >
      <label class="label-secondary">{{ $t("form.featuresizeExtra") }}</label>
    </fieldset>

    <fieldset class="inline-parent">
      <label for="featureposition">{{ $t("form.featureposition") }}</label>
      <input
        id="featureposition"
        type="number"
        :min="minfeatureposition"
        :max="maxfeatureposition"
        @change="$store.commit(`updateFeaturePosition`, $event.target.value)"
        :value="featureposition"
      >
    </fieldset>
    <fieldset class="inline">
      <label for="minfeatureposition">{{ $t("form.minfeatureposition") }}</label>
      <input
        id="minfeatureposition"
        type="number"
        min="1"
        :max="maxfeatureposition"
        @change="$store.commit(`updateMinFeaturePosition`, $event.target.value)"
        :value="minfeatureposition"
      >
    </fieldset>
    <fieldset class="inline">
      <input
        id="maxfeatureposition"
        type="number"
        min="1"
        max="12"
        @change="$store.commit(`updateMaxFeaturePosition`, $event.target.value)"
        :value="maxfeatureposition"
      >
    </fieldset>

    <span class="spacer"></span>

    <fieldset class="inline-parent">
      <label for="fragmentation">{{ $t("form.fragmentation") }}</label>
      <input
        id="fragmentation"
        type="number"
        :min="minfragmentation"
        :max="maxfragmentation"
        @change="$store.commit(`updateFragmentation`, $event.target.value)"
        :value="fragmentation"
      >
    </fieldset>
    <fieldset class="inline">
      <label for="minfragmentation">{{ $t("form.minfragmentation") }}</label>
      <input
        id="minfragmentation"
        type="number"
        min="1"
        :max="maxfragmentation"
        @change="$store.commit(`updateMinFragmentation`, $event.target.value)"
        :value="minfragmentation"
      >
    </fieldset>
    <fieldset class="inline">
      <input
        id="maxfragmentation"
        type="number"
        min="1"
        max="12"
        @change="$store.commit(`updateMaxFragmentation`, $event.target.value)"
        :value="maxfragmentation"
      >
    </fieldset>
    <p class="extra-info">{{ $t("form.fragmentationExtra") }}</p>

    <span class="spacer"></span>

    <p class="label-like">{{ $t("form.metadetailsrange") }} <span class="extra-info">{{ $t("form.metadetailsrangeUnits") }}</span></p>
    <fieldset class="inline indent">
      <label for="metadetailsleft">{{ $t("form.metadetailsleft") }}</label>
      <input
        id="metadetailsleft"
        type="number"
        min="0"
        max="7"
        @change="$store.commit(`updateMetaDetailsLeft`, $event.target.value)"
        :value="metadetailsleft"
      >
    </fieldset>
    <fieldset class="inline">
      <label for="metadetailsright">{{ $t("form.metadetailscenter") }}</label>
      <input
        id="metadetailsright"
        type="number"
        min="0"
        max="7"
        @change="$store.commit(`updateMetaDetailsRight`, $event.target.value)"
        :value="metadetailsright"
      >
      <label for="metadetailsright">{{ $t("form.metadetailsright") }}</label>
    </fieldset>

    <span class="spacer"></span>

    <p class="label-like">{{ $t("form.imageweightrange") }} <span class="extra-info">{{ $t("form.imageweightrangeUnits") }}</span></p>
    <fieldset class="inline indent">
      <label for="imageweightleft">{{ $t("form.imageweightleft") }}</label>
      <input
        id="imageweightleft"
        type="number"
        min="0"
        max="10"
        @change="$store.commit(`updateImageWeightLeft`, $event.target.value)"
        :value="imageweightleft"
      >
    </fieldset>
    <fieldset class="inline">
      <label for="imageweightright">{{ $t("form.imageweightcenter") }}</label>
      <input
        id="imageweightright"
        type="number"
        min="0"
        max="10"
        @change="$store.commit(`updateImageWeightRight`, $event.target.value)"
        :value="imageweightright"
      >
      <label for="imageweightright">{{ $t("form.imageweightright") }}</label>
    </fieldset>

    <h3>Playful Parameters</h3>

    <fieldset>
      <label for="subfeature-off">{{ $t("form.subfeature") }}</label>
      <div class="switch switch--horizontal">
        <input
          id="subfeature-off"
          type="radio"
          name="subfeature"
          :checked="subfeature ? '':'checked'"
          value="off"
          @change="$store.commit(`updateSubFeature`, $event.target.value)"
        >
        <label for="subfeature-off">Off</label>
        <input
          id="subfeature-on"
          type="radio"
          name="subfeature"
          :checked="subfeature ? 'checked':''"
          value="on"
          @change="$store.commit(`updateSubFeature`, $event.target.value)"
        >
        <label for="subfeature-on">On</label><span class="toggle-outside"><span class="toggle-inside"></span></span>
      </div>
      <label class="label-secondary">{{ $t("form.subfeatureExtra") }}</label>
    </fieldset>

    <fieldset>
      <label for="boostfeature-off">{{ $t("form.boostfeature") }}</label>
      <div class="switch switch--horizontal">
        <input
          id="boostfeature-off"
          type="radio"
          name="boostfeature"
          :checked="boostfeature ? '':'checked'"
          value="off"
          @change="$store.commit(`updateBoostFeature`, $event.target.value)"
        >
        <label for="boostfeature-off">Off</label>
        <input
          id="boostfeature-on"
          type="radio"
          name="boostfeature"
          :checked="boostfeature ? 'checked':''"
          value="on"
          @change="$store.commit(`updateBoostFeature`, $event.target.value)"
        >
        <label for="boostfeature-on">On</label><span class="toggle-outside"><span class="toggle-inside"></span></span>
      </div>
      <label class="label-secondary">{{ $t("form.boostfeatureExtra") }}</label>
    </fieldset>

    <fieldset>
      <label for="balancemdandiw-off">{{ $t("form.balancemdandiw") }}</label>
      <div class="switch switch--horizontal">
        <input
          id="balancemdandiw-off"
          type="radio"
          name="balancemdandiw"
          :checked="balancemdandiw ? '':'checked'"
          value="off"
          @change="$store.commit(`updateBalanceMdAndIw`, $event.target.value)"
        >
        <label for="balancemdandiw-off">Off</label>
        <input
          id="balancemdandiw-on"
          type="radio"
          name="balancemdandiw"
          :checked="balancemdandiw ? 'checked':''"
          value="on"
          @change="$store.commit(`updateBalanceMdAndIw`, $event.target.value)"
        >
        <label for="balancemdandiw-on">On</label><span class="toggle-outside"><span class="toggle-inside"></span></span>
      </div>
      <label class="label-secondary">{{ $t("form.balancemdandiwExtra") }}</label>
    </fieldset>

    <fieldset>
      <label for="hierarchycrossing">{{ $t("form.hierarchycrossing") }}</label>
      <input
        id="hierarchycrossing"
        type="number"
        min="0"
        max="10"
        @change="$store.commit(`updateHierarchyCrossing`, $event.target.value)"
        :value="hierarchycrossing"
      >
      <label class="label-secondary">{{ $t("form.hierarchycrossingUnits") }}</label>
    </fieldset>
    <p class="extra-info">{{ $t("form.hierarchycrossingExtra") }}</p>

    <fieldset>
      <label for="flipcolsrows-off">{{ $t("form.flipcolsrows") }}</label>
      <div class="switch switch--horizontal">
        <input
          id="flipcolsrows-off"
          type="radio"
          name="flipcolsrows"
          :checked="flipcolsrows ? '':'checked'"
          value="off"
          @change="$store.commit(`updateFlipColsRows`, $event.target.value)"
        >
        <label for="flipcolsrows-off">Off</label>
        <input
          id="flipcolsrows-on"
          type="radio"
          name="flipcolsrows"
          :checked="flipcolsrows ? 'checked':''"
          value="on"
          @change="$store.commit(`updateFlipColsRows`, $event.target.value)"
        >
        <label for="flipcolsrows-on">On</label><span class="toggle-outside"><span class="toggle-inside"></span></span>
      </div>
      <label class="label-secondary">{{ $t("form.flipcolsrowsExtra") }}</label>
    </fieldset>

    <h3>Presentational Options</h3>

    <fieldset>
      <label for="gridcolumngap">{{ $t("form.gridcolumngap") }} <span class="label-extra-info">{{ $t("form.units") }}</span></label>
      <input
        id="gridcolumngap"
        type="number"
        min="0"
        max="50"
        @change="$store.commit(`updateColumnGap`, $event.target.value)"
        :value="gridcolumngap"
      >
    </fieldset>

    <fieldset>
      <label for="gridrowgap">{{ $t("form.gridrowgap") }} <span class="label-extra-info">{{ $t("form.units") }}</span></label>
      <input
        id="gridrowgap"
        type="number"
        min="0"
        max="50"
        @change="$store.commit(`updateRowGap`, $event.target.value)"
        :value="gridrowgap"
      >
    </fieldset>

    <button @click="showCodeModal = true">{{ $t("form.codebutton") }}</button>
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
      "gridcolumns", "mingridcolumns", "maxgridcolumns",
      "gridrows", "mingridrows", "maxgridrows",
      "featuresize", "minfeaturesize", "maxfeaturesize",
      "featureposition", "minfeatureposition", "maxfeatureposition",
      "fragmentation", "minfragmentation", "maxfragmentation",
      "metadetailsleft", "metadetailsright",
      "imageweightleft", "imageweightright",

      "subfeature", "boostfeature", "balancemdandiw",
      "hierarchycrossing", "flipcolsrows",
      "gridcolumngap", "gridrowgap"])
  },
  watch: {
    gridcolumns(newVal, oldVal) {
      let payload = {
        newVal,
        oldVal,
        direction: "colArr"
      };
      this.$store.commit("adjustArr", payload);
    },
    gridrows(newVal, oldVal) {
      let payload = {
        newVal,
        oldVal,
        direction: "rowArr"
      };
      this.$store.commit("adjustArr", payload);
    }
  },
  created () {
    this.$store.commit("calculateChildren");
  },
  beforeUpdate () {
    this.$store.commit("calculateChildren");
  }
};
</script>

<style lang="scss" scoped>
aside {
  margin: 0 60px 60px;
  font-size: 17px;
  width: 500px;
  position: relative;

  .flush {
    margin-top: 0;
  }

  .indent {
    margin-left: 10px;
  }

  .reset-wrapper {
    display: inline-block;
    width: 100%;
    margin-bottom: 20px;

    h3 {
      float: left;
      margin: 0;
    }
    button {
      float: right;
      margin: 0;
    }
  }
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
    margin: 60px 50px;
  }
  button[type=reset]{
    margin-left: 20px;
  }
}
</style>
