import Vue from "vue";
import Vuex from "vuex";
import { groupRepeatedUnits, createRepetition } from "./utils/repetition";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    columns: 6,
    mincolumns: 2,
    maxcolumns: 10,

    rows: 5,
    minrows: 1,
    maxrows: 6,

    featuresize: 3,
    minfeaturesize: 2,
    maxfeaturesize: 4,

    featureposition: 1,
    minfeatureposition: 1,
    maxfeatureposition: 4,

    fragmentation: 2,
    minfragmentation: 0,
    maxfragmentation: 3,

    metadetailsleft: 7,
    metadetailsright: 0,

    imageweightleft: 8,
    imageweightright: 0,

    subfeature: false,
    boostfeature: false,
    balancemdandiw: false,

    hierarchycrossing: 0,
    flipcolsrows: false,

    columngap: 0,
    rowgap: 0,
    colArr: [{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"}],
    rowArr: [{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"}],
    childarea: [],

    gridkey: 0, // Used for forcing-reset the grid.
  }
}

export default new Vuex.Store({
  state: getDefaultState(),
  getters: {
    colTemplate(state) {
      const unitGroups = groupRepeatedUnits(state.colArr);
      return createRepetition(unitGroups);
    },
    rowTemplate(state) {
      const unitGroups = groupRepeatedUnits(state.rowArr);
      return createRepetition(unitGroups);
    },
    divNum(state) {
      return Math.max(state.columns, 0) * Math.max(state.rows, 0);
    }
  },
  mutations: {
    initialArrIndex(state, payload) {
      if(payload !== '') {
        const queryParams = new URLSearchParams(payload)

        for (const stateKey in state) {
          const paramIsValid = queryParams.has(stateKey)
          const paramType = typeof(state[stateKey])

          if(paramIsValid && paramType === 'number') {
            state[stateKey] = queryParams.get(stateKey);
          }
          else if (paramIsValid && paramType === 'object') {
            state[stateKey] = JSON.parse(queryParams.get(stateKey))
          }
        }
      }
    },
    adjustArr(state, payload) {
      let newVal = Math.max(Number(payload.newVal), 0),
        oldVal = Math.max(Number(payload.oldVal), 0);

      // Nothing to do if we already have everything in place.
      if (state[payload.direction].length === newVal) {
        return;
      }

      if (newVal < oldVal) {
        // you'd think that .length would be quicker here, but it doesn't trigger the getter/computed in colTemplate etc.
        let difference = oldVal - newVal;
        for (let i = 1; i <= difference; i++) {
          state[payload.direction].pop();
        }
      } else {
        let difference = newVal - oldVal;
        for (let i = 1; i <= difference; i++) {
          state[payload.direction].push({ unit: "1fr" });
        }
      }
    },
    addChildren(state, payload) {
      state.childarea.push(payload);
    },
    removeChildren(state, payload) {
      state.childarea.splice(payload, 1);
    },

    updateColumns(state, payload) {
      state.columns = payload;

      maybeUpdateRows(state);
      maybeUpdateFeatureSize(state);
      maybeUpdateFeaturePosition(state);
    },
    updateMinColumns(state, payload) {
      state.mincolumns = payload;
      // Adjust the columns if that is the case.
      maybeUpdateColumns(state);
    },
    updateMaxColumns(state, payload) {
      state.maxcolumns = payload;
      // Adjust the columns if that is the case.
      maybeUpdateColumns(state);
    },

    updateRows(state, payload) {
      // We don't want more rows than columns.
      if (payload <= state.columns) {
        state.rows = payload;
      }
    },
    updateMinRows(state, payload) {
      state.minrows = payload;
      // Adjust the rows if that is the case.
      maybeUpdateRows(state);
    },
    updateMaxRows(state, payload) {
      state.maxrows = payload;
      // Adjust the rows if that is the case.
      maybeUpdateRows(state);
    },

    updateFeatureSize(state, payload) {
      // Keep the feature size in the range.
      if (payload <= state.maxfeaturesize && payload >= state.minfeaturesize) {
        state.featuresize = payload;
      }
    },

    updateFeaturePosition(state, payload) {
      // Keep the feature position in the range.
      if (payload <= state.maxfeatureposition && payload >= state.minfeatureposition) {
        state.featureposition = payload;
      }
    },
    updateMinFeaturePosition(state, payload) {
      state.minfeatureposition = payload;
      // Adjust the featureposition if that is the case.
      maybeUpdateFeaturePosition(state);
    },
    updateMaxFeaturePosition(state, payload) {
      state.maxfeatureposition = payload;
      // Adjust the featureposition if that is the case.
      maybeUpdateFeaturePosition(state);
    },
    updateSubFeature(state, payload) {
      state.subfeature = payload === 'on';
    },

    updateFragmentation(state, payload) {
      // Keep the fragmentation in the range.
      if (payload <= state.maxfragmentation && payload >= state.minfragmentation) {
        state.fragmentation = payload;
      }
    },
    updateMinFragmentation(state, payload) {
      state.minfragmentation = payload;
      // Adjust the fragmentation if that is the case.
      maybeUpdateFragmentation(state);
    },
    updateMaxFragmentation(state, payload) {
      state.maxfragmentation = payload;
      // Adjust the fragmentation if that is the case.
      maybeUpdateFragmentation(state);
    },

    updateMetaDetailsLeft(state, payload) {
        state.metadetailsleft = payload;
    },
    updateMetaDetailsRight(state, payload) {
      state.metadetailsright = payload;
    },

    updateImageWeightLeft(state, payload) {
      state.imageweightleft = payload;
    },
    updateImageWeightRight(state, payload) {
      state.imageweightright = payload;
    },

    updateBoostFeature(state, payload) {
      state.boostfeature = payload === 'on';
    },
    updateBalanceMdAndIw(state, payload) {
      state.balancemdandiw = payload === 'on';
    },

    updateHierarchyCrossing(state, payload) {
      state.hierarchycrossing = payload;
    },

    updateFlipColsRows(state, payload) {
      state.boostfeature = payload === 'on';
    },

    updateColumnGap(state, payload) {
      state.columngap = payload;
    },
    updateRowGap(state, payload) {
      state.rowgap = payload;
    },
    resetState(state, payload) {
      Object.assign(state, getDefaultState());
    }
  }
});

// Update the columns, if that is the case.
const maybeUpdateColumns = (state) => {
  if (state.columns < state.mincolumns) {
    state.columns = state.mincolumns;
  }

  if (state.columns > state.maxcolumns) {
    state.columns = state.maxcolumns;
  }

  maybeUpdateFeatureSize(state);
  maybeUpdateFeaturePosition(state);
};

// Update the rows, if that is the case.
const maybeUpdateRows = (state) => {
  // We don't want more rows than columns.
  if (state.rows > state.columns) {
    state.rows = state.columns;
  }

  if (state.rows < state.minrows) {
    state.rows = state.minrows
  }

  if (state.rows > state.maxrows) {
    state.rows = state.maxrows
  }

  // Also adjust maxrows.
  if (state.maxrows > state.columns) {
    state.maxrows = state.columns;
  }
};

// Update the featuresize, minfeaturesize, and maxfeaturesize, if that is the case.
const maybeUpdateFeatureSize = (state) => {
  state.minfeaturesize = Math.floor( state.columns * 0.333 );
  state.maxfeaturesize = Math.ceil( state.columns * 0.666 );
  if (state.featuresize < state.minfeaturesize) {
    state.featuresize = state.minfeaturesize
  }
  if (state.featuresize > state.maxfeaturesize) {
    state.featuresize = state.maxfeaturesize
  }
};

// Update the featureposition, minfeatureposition, and maxfeatureposition, if that is the case.
const maybeUpdateFeaturePosition = (state) => {
  if ( state.maxfeatureposition > state.columns-state.featuresize+1 ) {
    state.maxfeatureposition = state.columns-state.featuresize+1
  }

  if (state.featureposition < state.minfeatureposition) {
    state.featureposition = state.minfeatureposition
  }
  if (state.featureposition > state.maxfeatureposition) {
    state.featureposition = state.maxfeatureposition
  }
};

// Update the fragmentation, minfragmentation, and maxfragmentation, if that is the case.
const maybeUpdateFragmentation = (state) => {
  if ( state.maxfragmentation > Math.pow(2, state.columns-state.featuresize-1) - 1 ) {
    state.maxfragmentation = Math.pow(2, state.columns-state.featuresize-1) - 1
  }

  if (state.fragmentation < state.minfragmentation) {
    state.fragmentation = state.minfragmentation
  }
  if (state.fragmentation > state.maxfragmentation) {
    state.fragmentation = state.maxfragmentation
  }
};

//we start off with just a few rows and columns filled with 1fr units
const createArr = (direction, arr) => {
  for (let i = 1; i <= direction; i++) {
    arr.push({ unit: "1fr" });
  }
};
