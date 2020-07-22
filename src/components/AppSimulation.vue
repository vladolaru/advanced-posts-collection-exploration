<template>
  <main class="simulation-container">

    <div id="gridcontainer" :key="componentKey">
      <div
        class="grid-wrapper"
        v-for="(simulatedState, i) in simulatedStates"
        :style="{height: simulatedState.gridrows*5+'%'}"
      >
        <span class="simulatedaxis-value">{{simulationaxis + ': ' + simulatedState[simulationaxis]}}</span>
        <section
          class="grid gridchild"
          :style="{ gridTemplateColumns: !simulatedState.flipcolsrows ? colTemplate(simulatedState) : rowTemplate(simulatedState), gridTemplateRows: !simulatedState.flipcolsrows ? rowTemplate(simulatedState) : colTemplate(simulatedState), gridColumnGap: simulatedState.gridcolumngap + 'px', gridRowGap: simulatedState.gridrowgap + 'px' }"
        >
          <div
            v-for="(child, j) in simulatedState.childarea"
            :key="child.gridArea+'-'+i"
            :class="'child' + '_' + i + '-' +j"
            :style="{ gridArea: child.gridArea }"
          >
            <ul class="details">
              <li>{{child.nthPost}}</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
    <!--gridcontainer-->
  </main>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { applyLayoutEngine } from '../mainLogic/layoutEngine';
import { createArr, maybeUpdateGridColumns, maybeUpdateGridRows, maybeUpdateFeatureSize, maybeUpdateFeaturePosition, maybeUpdateFragmentation } from '../store';
import { createRepetition, groupRepeatedUnits } from '../utils/repetition'

export default {
  data() {
    return {
      simulatedStates: [],
      componentKey: 0,
    };
  },
  created: function() {
    this.generateSimulatedStates();

    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      this.generateSimulatedStates();

      this.forceRerender();
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  computed: {
    // Even if we don't use them, we want to re-render on their change.
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
      "simulationmode", "simulationaxis",
      "gridcolumngap", "gridrowgap",
    ]),
  },
  methods: {
    colTemplate(state) {
      const unitGroups = groupRepeatedUnits(state.colArr);
      return createRepetition(unitGroups);
    },
    rowTemplate(state) {
      const unitGroups = groupRepeatedUnits(state.rowArr);
      return createRepetition(unitGroups);
    },
    generateSimulatedStates: function() {
      // Determine the min and max range of the simulated axis.
      let min = false,
        max = false;

      if (typeof this.$store.state['min'+this.simulationaxis] !== "undefined") {
        min = this.$store.state['min'+this.simulationaxis];
      } else {
        min = 0;
      }
      if (typeof this.$store.state['max'+this.simulationaxis] !== "undefined") {
        max = this.$store.state['max'+this.simulationaxis];
      } else {
        console.log("Could not get the value for: " + 'max' + this.simulationaxis);
        return this.$store.state;
      }

      this.simulatedStates.length = 0;
      let currentState;
      for (let i = min; i <= max; i++) {
        // Create a new copy of the state.
        currentState = Object.assign({}, this.$store.state);

        // Modify the simulated axis value.
        currentState[this.simulationaxis] = i;

        // Run the adjustment logic on the modified state.
        maybeUpdateGridColumns(currentState);
        maybeUpdateGridRows(currentState);
        maybeUpdateFeatureSize(currentState);
        maybeUpdateFeaturePosition(currentState);
        maybeUpdateFragmentation(currentState);
        // Recreate the cols and rows arrs.
        currentState.colArr = [];
        createArr(currentState.gridcolumns, currentState.colArr);
        currentState.rowArr = [];
        createArr(currentState.gridrows, currentState.rowArr);

        // Now apply the layout engine.
        currentState.childarea = applyLayoutEngine(currentState);

        // Add the final simulated state to the list.
        this.simulatedStates.push(currentState);
      }
    },
    forceRerender() {
      this.componentKey += 1;
      console.log(this.componentKey);
    }
  }
};
</script>

<style lang="scss" scoped>
main {
  width: calc(70vw - 50px);
  height: calc(70vh - 50px);
  margin: 15px 0 0 75px;
}

@mixin colors($max, $color-frequency) {
  $color: 300 / $max;

  // fruit loops!
  @for $i from 1 through $max {
    div[class*="child"]:nth-child(#{$i}) {
      background: hsla(($i - 15) * ($color * 1.5), 80%, 30%, 0.7);
      border: 1px solid #ddd;
    }
  }
}

.gridchild {
  div {
    ul {
      margin:0;
      list-style: none;
      padding: 5px 0 0 5px;
      font-size: 0.9em;
      line-height: 1.3em;
    }
  }
}

#gridcontainer {
  border: 1px solid #08ffbd;
  width: auto;
  height: 100%;
  padding: 10px;
  z-index: 0;
  overflow-y: scroll;
  position: relative;
  background: #131321; /* Old browsers */
  background: -moz-linear-gradient(
    top,
    #131321 0%,
    #1f1c2c 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    #131321 0%,
    #1f1c2c 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    #131321 0%,
    #1f1c2c 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#131321', endColorstr='#1f1c2c',GradientType=0 ); /* IE6-9 */
  box-shadow: 0 2px 20px 0 #000;
}

.grid-wrapper {
  width: 23%;
  height: 30%;
  float: left;
  margin: 5px 20px 35px 10px;

  .grid {
    height: 100%;
    display: grid;
    grid-auto-flow: row dense;
    @include colors(20, 100);

    p {
      padding: 0 10px;
    }

    div[class*="box"] {
      background-image: url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
      border: 1px dotted white;
      transition: 0.2s all ease;
      position: relative;
      z-index: 1000;
      opacity: 0.5;
    }

    .details {
      font-weight: bold;
      font-size: 1em;
      padding: 2px 0 0 2px;
    }
  }
}

@media screen and (max-width: 1500px) {
  main.simulation-container {
    width: calc(70vw - 0px);
    height: 75vh;
    margin: 15px 0 0 0;
  }

  #gridcontainer {
    padding: 5px;
  }

  .grid-wrapper {
    width: 23%;
    margin: 5px 12px 25px 5px;
    font-size: 0.9em;
    line-height: 1.2em;
  }
}

@media screen and (max-width: 700px) {
  main {
    width: calc(80vw - 50px);
    height: calc(40vh - 50px);
  }
}
</style>
