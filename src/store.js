import Vue from "vue";
import Vuex from "vuex";
import { groupRepeatedUnits, createRepetition } from "./utils/repetition";
import { applyLayoutEngine } from './mainLogic/layoutEngine';

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    gridcolumns: 6,
    mingridcolumns: 2,
    maxgridcolumns: 10,

    gridrows: 5,
    mingridrows: 1,
    maxgridrows: 6,

    featuresize: 2,
    minfeaturesize: 2,
    maxfeaturesize: 4,

    featureposition: 2,
    minfeatureposition: 1,
    maxfeatureposition: 5,

    fragmentation: 5,
    minfragmentation: 0,
    maxfragmentation: 7,

    metadetailsleft: 7,
    metadetailsright: 0,
    minmetadetails: 0,
    maxmetadetails: 7,

    imageweightleft: 8,
    imageweightright: 0,
    minimageweight: 0,
    maximageweight: 10,

    subfeature: false,
    boostfeature: true,
    balancemdandiw: false,

    hierarchycrossing: 0,
    maxhierarchycrossing: 200,
    flipcolsrows: false,

    gridcolumngap: 5,
    gridrowgap: 5,
    colArr: [{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"}],
    rowArr: [{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"}],

    childarea: [],

    simulationmode: false,
    simulationaxis: 'gridcolumns',

    useRealPostsDetails: false,
    fetchpostsurl: 'https://pixelgrade.com/wp-json/wp/v2/posts?_embed',
    posts: [],
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
      return Math.max(state.gridcolumns, 0) * Math.max(state.gridrows, 0);
    },
    currentStateUrl(state) {
      let url = new URL(window.location.href);

      // Make a local copy;
      let tempState = {};
      Object.assign(tempState, state);
      // Clean everything not needed.
      delete tempState.childarea;
      delete tempState.colArr;
      delete tempState.rowArr;

      url.search = new URLSearchParams(tempState);

      return url.toString();
    }
  },
  mutations: {
    initialArrIndex(state, payload) {
      if(payload !== '') {
        const queryParams = new URLSearchParams(payload)

        for (const stateKey in state) {
          const paramIsValid = queryParams.has(stateKey)
          const paramType = typeof(state[stateKey])

          if(paramIsValid && paramType === 'number' ) {
            state[stateKey] = parseInt( queryParams.get(stateKey) );
          } else if(paramIsValid && paramType === 'boolean') {
            state[stateKey] = queryParams.get(stateKey) === "true";
          } else if (paramIsValid && paramType === 'object') {
            state[stateKey] = JSON.parse(queryParams.get(stateKey))
          }
        }

        if (!queryParams.has('colArr')) {
          state.colArr = [];
          createArr(state.gridcolumns, state.colArr);
        }
        if (!queryParams.has('rowArr')) {
          state.rowArr = [];
          createArr(state.gridrows, state.rowArr);
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

    updateGridColumns(state, payload) {
      state.gridcolumns = Math.abs(payload);

      maybeUpdateGridRows(state);
      maybeUpdateFeatureSize(state);
      forceUpdateMaxFeaturePosition(state);
      forceUpdateMaxFragmentation(state);
    },
    updateMinGridColumns(state, payload) {
      state.mingridcolumns = Math.abs(payload);
      // Adjust the gridcolumns if that is the case.
      maybeUpdateGridColumns(state);
    },
    updateMaxGridColumns(state, payload) {
      state.maxgridcolumns = Math.abs(payload);
      // Adjust the gridcolumns if that is the case.
      maybeUpdateGridColumns(state);
    },

    updateGridRows(state, payload) {
      state.gridrows = Math.abs(payload);
    },
    updateMinGridRows(state, payload) {
      state.mingridrows = Math.abs(payload);
      // Adjust the gridrows if that is the case.
      maybeUpdateGridRows(state);
    },
    updateMaxGridRows(state, payload) {
      state.maxgridrows = Math.abs(payload);
      // Adjust the gridrows if that is the case.
      maybeUpdateGridRows(state);
    },

    updateFeatureSize(state, payload) {
      // Keep the feature size in the range.
      if (payload <= state.maxfeaturesize && payload >= state.minfeaturesize) {
        state.featuresize = Math.abs(payload);

        forceUpdateMaxFeaturePosition(state);
        forceUpdateMaxFragmentation(state);
      }
    },

    updateFeaturePosition(state, payload) {
      // Keep the feature position in the range.
      if (payload <= state.maxfeatureposition && payload >= state.minfeatureposition) {
        state.featureposition = Math.abs(payload);
      }
    },
    updateMinFeaturePosition(state, payload) {
      state.minfeatureposition = Math.abs(payload);
      // Adjust the featureposition if that is the case.
      maybeUpdateFeaturePosition(state);
    },
    updateMaxFeaturePosition(state, payload) {
      state.maxfeatureposition = Math.abs(payload);
      // Adjust the featureposition if that is the case.
      maybeUpdateFeaturePosition(state);
    },
    updateSubFeature(state, payload) {
      state.subfeature = payload === 'on';
    },

    updateFragmentation(state, payload) {
      // Keep the fragmentation in the range.
      if (payload <= state.maxfragmentation && payload >= state.minfragmentation) {
        state.fragmentation = Math.abs(payload);
      }
    },
    updateMinFragmentation(state, payload) {
      state.minfragmentation = Math.abs(payload);
      // Adjust the fragmentation if that is the case.
      maybeUpdateFragmentation(state);
    },
    updateMaxFragmentation(state, payload) {
      state.maxfragmentation = Math.abs(payload);

      if ( state.maxfragmentation > Math.pow(2, state.gridcolumns-state.featuresize-1) - 1) {
        state.maxfragmentation = Math.pow(2, state.gridcolumns-state.featuresize-1) - 1;
      }
      // Adjust the fragmentation if that is the case.
      maybeUpdateFragmentation(state);
    },

    updateImageWeightLeft(state, payload) {
      state.imageweightleft = Math.abs(payload);

      if (state.imageweightleft > state.maximageweight) {
        state.imageweightleft = state.maximageweight;
      } else if (state.imageweightleft < state.minimageweight) {
        state.imageweightleft = state.minimageweight;
      }
    },
    updateImageWeightRight(state, payload) {
      state.imageweightright = Math.abs(payload);

      if (state.imageweightright > state.maximageweight) {
        state.imageweightright = state.maximageweight;
      } else if (state.imageweightright < state.minimageweight) {
        state.imageweightright = state.minimageweight;
      }
    },

    updateMetaDetailsLeft(state, payload) {
      state.metadetailsleft = Math.abs(payload);

      if (state.metadetailsleft > state.maxmetadetails) {
        state.metadetailsleft = state.maxmetadetails;
      } else if (state.metadetailsleft < state.minmetadetails) {
        state.metadetailsleft = state.minmetadetails;
      }
    },
    updateMetaDetailsRight(state, payload) {
      state.metadetailsright = Math.abs(payload);

      if (state.metadetailsright > state.maxmetadetails) {
        state.metadetailsright = state.maxmetadetails;
      } else if (state.metadetailsright < state.minmetadetails) {
        state.metadetailsright = state.minmetadetails;
      }
    },

    updateBoostFeature(state, payload) {
      state.boostfeature = payload === 'on';
    },
    updateBalanceMdAndIw(state, payload) {
      state.balancemdandiw = payload === 'on';
    },

    updateHierarchyCrossing(state, payload) {
      state.hierarchycrossing = Math.abs(payload);

      if (state.hierarchycrossing > state.maxhierarchycrossing) {
        state.hierarchycrossing = state.maxhierarchycrossing;
      } else if (state.hierarchycrossing < 0) {
        state.hierarchycrossing = 0;
      }
    },

    updateFlipColsRows(state, payload) {
      state.flipcolsrows = payload === 'on';
    },

    updateColumnGap(state, payload) {
      state.gridcolumngap = Math.abs(payload);
    },
    updateRowGap(state, payload) {
      state.gridrowgap = Math.abs(payload);
    },

    updateSimulationMode(state, payload) {
      state.simulationmode = payload === 'on';
    },

    updateSimulationAxis(state, payload) {
      state.simulationaxis = payload;
    },

    switchFromSimulationMode(state, payload) {
      state.simulationmode = false;
      if (typeof payload.simulationaxis !== 'undefined' && typeof payload.axisvalue !== 'undefined') {
        state[payload.simulationaxis] = payload.axisvalue;

        // Run the adjustment logic on the modified state.
        maybeUpdateGridColumns(state);
        maybeUpdateGridRows(state);
        maybeUpdateFeatureSize(state);
        maybeUpdateFeaturePosition(state);
        maybeUpdateFragmentation(state);
        // Recreate the cols and rows arrs.
        state.colArr = [];
        createArr(state.gridcolumns, state.colArr);
        state.rowArr = [];
        createArr(state.gridrows, state.rowArr);
      }
    },

    calculateChildren(state) {
      // Fill the childarea with posts.
      state.childarea = applyLayoutEngine(state, true);
    },

    updateUseRealPostsDetails(state, payload) {
      state.useRealPostsDetails = payload === 'on';
    },

    updateFetchPostsUrl(state, payload) {
      state.fetchpostsurl = payload;
    },

    fetchPosts(state) {
      let postsRequest = new Request(state.fetchpostsurl);

      fetch(postsRequest)
        .then(function(response) {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(function(postsData) {
          state.posts = postsData;
        });
    },

    resetState(state, payload) {
      Object.assign(state, getDefaultState());

      state.childarea = applyLayoutEngine(state, true);
    },
  }
});

// Update the gridcolumns, if that is the case.
export const maybeUpdateGridColumns = (state) => {
  if (state.gridcolumns < state.mingridcolumns) {
    state.gridcolumns = state.mingridcolumns;
  }

  if (state.gridcolumns > state.maxgridcolumns) {
    state.gridcolumns = state.maxgridcolumns;
  }

  maybeUpdateFeatureSize(state);

  forceUpdateMaxFeaturePosition(state);
  forceUpdateMaxFragmentation(state);
};

// Update the gridrows, if that is the case.
export const maybeUpdateGridRows = (state) => {
  if (state.gridrows < state.mingridrows) {
    state.gridrows = state.mingridrows
  }

  if (state.gridrows > state.maxgridrows) {
    state.gridrows = state.maxgridrows
  }
};

// Update the featuresize, minfeaturesize, and maxfeaturesize, if that is the case.
export const maybeUpdateFeatureSize = (state) => {
  state.minfeaturesize = Math.floor( state.gridcolumns * 0.25 );
  state.maxfeaturesize = Math.ceil( state.gridcolumns * 0.75 );
  if (state.featuresize < state.minfeaturesize) {
    state.featuresize = state.minfeaturesize
  }
  if (state.featuresize > state.maxfeaturesize) {
    state.featuresize = state.maxfeaturesize
  }
};

// Update the featureposition, minfeatureposition, and maxfeatureposition, if that is the case.
export const maybeUpdateFeaturePosition = (state) => {
  if ( state.maxfeatureposition > state.gridcolumns-state.featuresize+1 ) {
    state.maxfeatureposition = state.gridcolumns-state.featuresize+1
  }

  if (state.featureposition < state.minfeatureposition) {
    state.featureposition = state.minfeatureposition
  }
  if (state.featureposition > state.maxfeatureposition) {
    state.featureposition = state.maxfeatureposition
  }
};

// Update the fragmentation and minfragmentation, if that is the case.
export const maybeUpdateFragmentation = (state) => {
  if (state.fragmentation < state.minfragmentation) {
    state.fragmentation = state.minfragmentation
  }
  if (state.fragmentation > state.maxfragmentation) {
    state.fragmentation = state.maxfragmentation
  }
};

// For the update of the maxfeatureposition.
const forceUpdateMaxFeaturePosition = (state) => {
  // Make the maxfeatureposition, the maximum possible.
  state.maxfeatureposition = state.gridcolumns-state.featuresize+1;

  maybeUpdateFeaturePosition(state);
};

// For the update of the maxfragmentation.
const forceUpdateMaxFragmentation = (state) => {
  // Make the maxfragmentation, the maximum possible.
  state.maxfragmentation = Math.pow(2, state.gridcolumns-state.featuresize-1) - 1;

  maybeUpdateFragmentation(state);
};

//we start off with just a few gridrows and gridcolumns filled with 1fr units
export const createArr = (direction, arr) => {
  for (let i = 1; i <= direction; i++) {
    arr.push({ unit: "1fr" });
  }
};
