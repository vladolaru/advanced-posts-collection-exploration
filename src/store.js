import Vue from "vue";
import Vuex from "vuex";
import { groupRepeatedUnits, createRepetition } from "./utils/repetition";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    columns: 6,
    mincolumns: 2,
    maxcolumns: 10,

    rows: 5,
    minrows: 1,
    maxrows: 6,

    featuresize: 3,
    minfeaturesize: 2,
    maxfeaturesize: 4,

    featuresizeposition: 1, // To do

    columngap: 0,
    rowgap: 0,
    colArr: [],
    rowArr: [],
    childarea: []
  },
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
      } else {
          createArr(state.columns, state.colArr);
          createArr(state.rows, state.rowArr);
      }
    },
    adjustArr(state, payload) {
      let newVal = Math.max(Number(payload.newVal), 0),
        oldVal = Math.max(Number(payload.oldVal), 0);

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

    updateColumnGap(state, payload) {
      state.columngap = payload;
    },
    updateRowGap(state, payload) {
      state.rowgap = payload;
    },
    resetGrid(state, payload) {
      state.childarea = [];
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

//we start off with just a few rows and columns filled with 1fr units
const createArr = (direction, arr) => {
  for (let i = 1; i <= direction; i++) {
    arr.push({ unit: "1fr" });
  }
};
