import Vue from "vue";
import Vuex from "vuex";
import { groupRepeatedUnits, createRepetition } from "./utils/repetition";

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

    imageweightleft: 8,
    imageweightright: 0,

    subfeature: false,
    boostfeature: true,
    balancemdandiw: false,

    hierarchycrossing: 0,
    flipcolsrows: false,

    gridcolumngap: 5,
    gridrowgap: 5,
    colArr: [{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"}],
    rowArr: [{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"},{"unit":"1fr"}],
    childarea: [],
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

    updateGridColumns(state, payload) {
      state.gridcolumns = Math.abs(payload);

      maybeUpdateGridRows(state);
      maybeUpdateFeatureSize(state);
      maybeUpdateFeaturePosition(state);
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
      // We don't want more gridrows than gridcolumns.
      if (payload <= state.gridcolumns) {
        state.gridrows = Math.abs(payload);
      }
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
      // Adjust the fragmentation if that is the case.
      maybeUpdateFragmentation(state);
    },

    updateMetaDetailsLeft(state, payload) {
        state.metadetailsleft = Math.abs(payload);
    },
    updateMetaDetailsRight(state, payload) {
      state.metadetailsright = Math.abs(payload);
    },

    updateImageWeightLeft(state, payload) {
      state.imageweightleft = Math.abs(payload);
    },
    updateImageWeightRight(state, payload) {
      state.imageweightright = Math.abs(payload);
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
      state.gridcolumngap = Math.abs(payload);
    },
    updateRowGap(state, payload) {
      state.gridrowgap = Math.abs(payload);
    },
    resetState(state, payload) {
      Object.assign(state, getDefaultState());

      generateLayout(state);
    },

    calculateChildren(state) {
      generateLayout(state);
    }
  }
});

// Update the gridcolumns, if that is the case.
const maybeUpdateGridColumns = (state) => {
  if (state.gridcolumns < state.mingridcolumns) {
    state.gridcolumns = state.mingridcolumns;
  }

  if (state.gridcolumns > state.maxgridcolumns) {
    state.gridcolumns = state.maxgridcolumns;
  }

  maybeUpdateFeatureSize(state);
  maybeUpdateFeaturePosition(state);
};

// Update the gridrows, if that is the case.
const maybeUpdateGridRows = (state) => {
  // We don't want more gridrows than gridcolumns.
  if (state.gridrows > state.gridcolumns) {
    state.gridrows = state.gridcolumns;
  }

  if (state.gridrows < state.mingridrows) {
    state.gridrows = state.mingridrows
  }

  if (state.gridrows > state.maxgridrows) {
    state.gridrows = state.maxgridrows
  }

  // Also adjust maxgridrows.
  if (state.maxgridrows > state.gridcolumns) {
    state.maxgridrows = state.gridcolumns;
  }
};

// Update the featuresize, minfeaturesize, and maxfeaturesize, if that is the case.
const maybeUpdateFeatureSize = (state) => {
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
const maybeUpdateFeaturePosition = (state) => {
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

// Update the fragmentation, minfragmentation, and maxfragmentation, if that is the case.
const maybeUpdateFragmentation = (state) => {
  if ( state.maxfragmentation > Math.pow(2, state.gridcolumns-state.featuresize-1) - 1 ) {
    state.maxfragmentation = Math.pow(2, state.gridcolumns-state.featuresize-1) - 1
  }

  if (state.fragmentation < state.minfragmentation) {
    state.fragmentation = state.minfragmentation
  }
  if (state.fragmentation > state.maxfragmentation) {
    state.fragmentation = state.maxfragmentation
  }
};

//we start off with just a few gridrows and gridcolumns filled with 1fr units
const createArr = (direction, arr) => {
  for (let i = 1; i <= direction; i++) {
    arr.push({ unit: "1fr" });
  }
};

// This is the main workhorse containing the logic of our layout "engine".
// Given the current state it will generate a layout of posts.
const generateLayout = (state) => {

  // Before we can get to generating the "grid areas" for each post (meaning start col and row plus end col and ro),
  // we need to do a couple of preliminary calculations.
  // To hold the data, we will work with matrices, uni or bidimensional, representing the actual columns and rows.
  // This way we gain an easier understanding of what is going on at each step of the logic.
  // In each matrix we will ignore index 0 since it is easier to start from 1,
  // the same way CSS grid columns and rows behave.

  // The order of these operation is important!

  console.log( "\nGenerating a new layout...\n\n");

  // The "null" character:
  const emptyChar = "X";
  // These are the matrices we are going to calculate:
  // The columns width matrix
  let widthMatrix = initUnidimensionalMatrix([], state.gridcolumns, emptyChar);
  // The meta-details matrix
  let metaDetailsMatrix = initBidimensionalMatrix([], state.gridcolumns, state.gridrows, emptyChar);
  // The image weight matrix
  let imageWeightMatrix = initBidimensionalMatrix([], state.gridcolumns, state.gridrows, emptyChar);
  // The vertical fragment size matrix
  let verticalFragmentSizeMatrix = initUnidimensionalMatrix([], state.gridcolumns, emptyChar);
  // The nth matrix: a bidimensional matrix the same size as the grid, holding in each cell what nth post should that cell belong to.
  // From this matrix we can extrapolate many details since the same nth value will be used to fill all the cells belonging to a post.
  // So we know the position and dimensions.
  let nthMatrix = initBidimensionalMatrix([], state.gridcolumns, state.gridrows, emptyChar);

  // Lets start PRELIMINARY CALCULATIONS!

  /*
  1. Calculate the columns width matrix.
     We will take into account the feature position, feature size and fragmentation value.
     The fragmentation value is interpreted in it's bit format, where 1 means a "cut".
     The fragmentation value represents the fragmentation of the remaining gridcolumns after the feature size was deducted.
   */

  let widthIdx = 1;
  // First, mark the feature.
  let i,j;
  for (i=state.featureposition; i < state.featureposition + state.featuresize; i++) {
    widthMatrix[i] = widthIdx;
  }

  // Next, go from left to right in the columns width matrix, and fill each columns with the same unique number,
  // Taking into account the fragmentation.
  // And remember the positions we are int the virtual matrix without the feature.
  let frgIdx = 0;
  widthIdx++;
  for (i=1; i <= state.gridcolumns; i++) {
    if (widthMatrix[i] === emptyChar) {
      frgIdx++;
      // If the previous position has a different number than the current one, it is clear we should increment and write.
      if (widthMatrix[i-1] !== widthIdx) {
        widthIdx++;
      } else {
        // If the previous position has the same value as the current one, we need to determine
        // if the fragmentation bit pattern imposes a "cut".
        const cutMarker = 1<<(state.gridcolumns-state.featuresize-frgIdx);
        // If there is a 1 at this position, make a cut aka increase the number.
        if ((cutMarker & state.fragmentation) === cutMarker) {
          widthIdx++;
        }
      }

      widthMatrix[i] = widthIdx;
    }
  }

  console.log( "The width matrix: ".padEnd(45,' ') + widthMatrix);

  /*
  2. Calculate the meta-details matrix.
     We will spread the meta-details range left-to-right. Each column will consume the range according to its width.
     Even it is a bidimensional matrix, for now we will only generate one row and copy it.
   */
  for (i=1; i <= state.gridcolumns; i++) {
    // Determine the other end of the current column.
    let end=i;
    while (widthMatrix[end+1] === widthMatrix[i]) {
      end++;
    }

    // Now calculate.
    if (i === 1) {
      metaDetailsMatrix[1][i] = state.metadetailsleft;
    } else if (end === state.gridcolumns) {
      metaDetailsMatrix[1][i] = state.metadetailsright;
    } else {
      metaDetailsMatrix[1][i] = Math.round(state.metadetailsleft - ((state.metadetailsleft - state.metadetailsright) * (i + end - 1) / (2 * state.gridcolumns)));
    }

    // Fill the entire column with the same meta-details value.
    for (j=i; j <= end; j++) {
      metaDetailsMatrix[1][j] = metaDetailsMatrix[1][i];
    }
    i=end;
  }
  // Copy the first row to all of the rest.
  for (i=2; i <= state.gridrows; i++) {
    metaDetailsMatrix[i] = metaDetailsMatrix[1].slice(); // .slice() creates a copy of the array, not reference.
  }

  console.log( "The meta-details matrix: ".padEnd(45,' ') + metaDetailsMatrix[1]);

  /*
  3. Calculate the image weight matrix.
     We will spread the image weight range left-to-right. Each column will consume the range according to its width.
     Even it is a bidimensional matrix, for now we will only generate one row and copy it.
   */
  for (i=1; i <= state.gridcolumns; i++) {
    // Determine the other end of the current column.
    let end=i;
    while (widthMatrix[end+1] === widthMatrix[i]) {
      end++;
    }

    // Now calculate.
    if (i === 1) {
      imageWeightMatrix[1][i] = state.imageweightleft;
    } else if (end === state.gridcolumns) {
      imageWeightMatrix[1][i] = state.imageweightright;
    } else {
      imageWeightMatrix[1][i] = Math.round(state.imageweightleft - ((state.imageweightleft - state.imageweightright) * (i + end - 1) / (2 * state.gridcolumns)));
    }

    // Fill the entire column with the same meta-details value.
    for (j=i; j <= end; j++) {
      imageWeightMatrix[1][j] = imageWeightMatrix[1][i];
    }
    i=end;
  }
  // Copy the first row to all of the rest.
  for (i=2; i <= state.gridrows; i++) {
    imageWeightMatrix[i] = imageWeightMatrix[1].slice(); // .slice() creates a copy of the array, not reference.
  }

  console.log( "The image weight matrix: ".padEnd(45,' ') + imageWeightMatrix[1]);

  /*
  4. Handle the boost feature emphasis.
     We will assign the maximum meta-details and image weight value to the feature, and assign its current value to the column holding the maximum values.
  */
  if (state.boostfeature && state.featuresize > 0) {
    // Find column with maximum meta-details value, if the feature isn't already at the max.
    let maxMetaDetailsPos = 1,
      maxImageWeightPos = 1;
    for (i = 1; i <= state.gridcolumns; i++) {
      if (metaDetailsMatrix[1][i] > metaDetailsMatrix[1][maxMetaDetailsPos]) {
        maxMetaDetailsPos = i;
      }

      if (imageWeightMatrix[1][i] > imageWeightMatrix[1][maxImageWeightPos]) {
        maxImageWeightPos = i;
      }
    }

    if (maxMetaDetailsPos !== state.featureposition) {
      // We have something to switch.
      let featureValue = metaDetailsMatrix[1][state.featureposition];
      let maxValue = metaDetailsMatrix[1][maxMetaDetailsPos];

      // Go and fill each column with the switched values.
      i = maxMetaDetailsPos;
      while (widthMatrix[i] === widthMatrix[maxMetaDetailsPos]) {
        metaDetailsMatrix[1][i] = featureValue;
        i++;
      }
      i = state.featureposition;
      while (widthMatrix[i] === widthMatrix[state.featureposition]) {
        metaDetailsMatrix[1][i] = maxValue;
        i++;
      }

      // Copy the first row to all of the rest.
      for (i=2; i <= state.gridrows; i++) {
        metaDetailsMatrix[i] = metaDetailsMatrix[1].slice(); // .slice() creates a copy of the array, not reference.
      }

      console.log( "The boosted feature meta-details matrix: ".padEnd(45,' ') + metaDetailsMatrix[1]);
    }

    if (maxImageWeightPos !== state.featureposition) {
      // We have something to switch.
      let featureValue = imageWeightMatrix[1][state.featureposition];
      let maxValue = imageWeightMatrix[1][maxImageWeightPos];

      // Go and fill each column with the switched values.
      i = maxImageWeightPos;
      while (widthMatrix[i] === widthMatrix[maxImageWeightPos]) {
        imageWeightMatrix[1][i] = featureValue;
        i++;
      }
      i = state.featureposition;
      while (widthMatrix[i] === widthMatrix[state.featureposition]) {
        imageWeightMatrix[1][i] = maxValue;
        i++;
      }

      // Copy the first row to all of the rest.
      for (i=2; i <= state.gridrows; i++) {
        imageWeightMatrix[i] = imageWeightMatrix[1].slice(); // .slice() creates a copy of the array, not reference.
      }

      console.log( "The boosted feature image weight matrix: ".padEnd(45,' ') + imageWeightMatrix[1]);
    }
  }

  /*
  5. Determine the vertical fragment size matrix.
     The fragment size will range in the number of grid rows and 1.
  */
  // First determine the max meta-details and image weight value.
  let maxMetaDetailsValue = metaDetailsMatrix[1][1],
    maxImageWeightValue = imageWeightMatrix[1][1];
  for (i = 1; i <= state.gridcolumns; i++) {
    if (metaDetailsMatrix[1][i] > maxMetaDetailsValue) {
      maxMetaDetailsValue = metaDetailsMatrix[1][i];
    }

    if (imageWeightMatrix[1][i] > maxImageWeightValue) {
      maxImageWeightValue = imageWeightMatrix[1][i];
    }
  }
  for (i=1; i <= state.gridcolumns; i++) {
    // Determine the other end of the current column.
    let end=i;
    while (widthMatrix[end+1] === widthMatrix[i]) {
      end++;
    }

    // Now calculate.
    verticalFragmentSizeMatrix[i] = Math.round((((metaDetailsMatrix[1][i] / maxMetaDetailsValue) + (imageWeightMatrix[1][i] / maxImageWeightValue)) / 2) * state.gridrows);
    // The vertical fragment size can't be more than the column width times 3 (a really tall post).
    if (verticalFragmentSizeMatrix[i] > (end - i + 1) * 3) {
      verticalFragmentSizeMatrix[i] = (end - i + 1) * 3;
    }
    // Safety measures.
    if (verticalFragmentSizeMatrix[i] < 1) {
      verticalFragmentSizeMatrix[i] = 1;
    }
    if (verticalFragmentSizeMatrix[i] > state.gridrows) {
      verticalFragmentSizeMatrix[i] = state.gridrows;
    }

    // Fill the entire column with the same fragment size.
    for (j = i; j <= end; j++) {
      verticalFragmentSizeMatrix[j] = verticalFragmentSizeMatrix[i];
    }
    i=end;
  }

  console.log( "The vertical fragment size matrix: ".padEnd(45,' ') + verticalFragmentSizeMatrix);

  /*
  6. Determine the nth bidimensional matrix.
     Each grid cell will be filled with the nth post that cell belongs to. From this matrix we can determine the post grid coordinates,
     its aspect ratio, area, etc.
  */

  // We start with the first post in the list.
  let currentNth = 1;

  // Start with the feature column.
  if (state.featuresize > 0) {
    i = 1;
    while (i <= verticalFragmentSizeMatrix[state.featureposition]) {
      j = state.featureposition;
      do {
        nthMatrix[i][j] = currentNth;
        j++;
      } while (widthMatrix[state.featureposition] === widthMatrix[j])

      i++;
    }

    currentNth++;

    if (i <= state.gridrows) {
      // We have room under the feature for a secondary feature post.
      // We will reduce the meta-details and image weight by 33% that of the main feature post.
      while (i <= state.gridrows) {
        j = state.featureposition;
        do {
          nthMatrix[i][j] = currentNth;

          // Adjust the meta-details and image weight.
          metaDetailsMatrix[i][j] = Math.round(metaDetailsMatrix[i][j] * 0.66);
          imageWeightMatrix[i][j] = Math.round(imageWeightMatrix[i][j] * 0.66);

          j++;
        } while (widthMatrix[state.featureposition] === widthMatrix[j])

        i++;
      }

      currentNth++;
    }
  }

  // Now start from the left top corner and go through each column, left to right.
  let currentColumnStartCol = 1;
  let currentPostStartRow;
  while (currentColumnStartCol <= state.gridcolumns) {
    if (nthMatrix[1][currentColumnStartCol] !== emptyChar) {
      currentColumnStartCol++;
      continue;
    }

    // Fill the current column with posts.
    currentPostStartRow = 1;
    while (currentPostStartRow <= state.gridrows) {
      i = currentPostStartRow;
      while (i <= currentPostStartRow + verticalFragmentSizeMatrix[currentColumnStartCol] - 1 && i <= state.gridrows) {
        j = currentColumnStartCol;
        do {
          nthMatrix[i][j] = currentNth;
          j++;
        } while (widthMatrix[currentColumnStartCol] === widthMatrix[j])

        i++;
      }
      currentNth++;
      currentPostStartRow = i;
    }
  }

  console.log( "\nThe nth matrix: ".padEnd(42,' ') + '0 - ' + nthMatrix[0].join(' '));
  for (i = 1; i < nthMatrix.length; i++) {
    console.log(' '.padEnd(41,' ') + i + ' - ' + nthMatrix[i].join(' '));
  }

  console.log( "\nThe final meta-details full matrix: ".padEnd(42,' ') + '0 - ' + metaDetailsMatrix[0].join(' '));
  for (i = 1; i < metaDetailsMatrix.length; i++) {
    console.log(' '.padEnd(41,' ') + i + ' - ' + metaDetailsMatrix[i].join(' '));
  }

  console.log( "\nThe final image weight full matrix: ".padEnd(42,' ') + '0 - ' + imageWeightMatrix[0].join(' '));
  for (i = 1; i < imageWeightMatrix.length; i++) {
    console.log(' '.padEnd(41,' ') + i + ' - ' + imageWeightMatrix[i].join(' '));
  }

  /*
  7. Finally, generate the posts layout for CSS Grid.
  */

  state.childarea = [];
  currentNth = 1;
  let currentPostDetails = {}

  while (currentPostDetails = getNthPostDetails(currentNth, nthMatrix, metaDetailsMatrix, imageWeightMatrix)) {
    state.childarea.push({
      'nthPost': currentNth,
      'gridArea': `${currentPostDetails.startGridRow} / ${currentPostDetails.startGridColumn} / ${currentPostDetails.endGridRow + 1} / ${currentPostDetails.endGridColumn + 1}`,
      'metaDetails': currentPostDetails.metaDetails,
      'imageWeight': currentPostDetails.imageWeight,
    });
    currentNth++;
  }
}

const getNthPostDetails = (currentNth, nthMatrix, metaDetailsMatrix, imageWeightMatrix) => {
  let postDetails = false;

  // Go through the nthMatrix and search for the currentNth value.
  for (let i = 1; i < nthMatrix.length; i++) {
    for (let j = 1; j < nthMatrix[i].length; j++) {
      if (nthMatrix[i][j] === currentNth) {
        // Found the left top corner.
        postDetails = {
          'startGridColumn': j,
          'startGridRow': i,
          'metaDetails': metaDetailsMatrix[i][j],
          'imageWeight': imageWeightMatrix[i][j],
        };

        // Find the right bottom corner.
        while (j < nthMatrix[i].length && nthMatrix[i][j] === nthMatrix[i][j+1]) {
          j++;
        }
        postDetails.endGridColumn = j;
        while (i < nthMatrix.length && nthMatrix[i][j] === nthMatrix[i+1][j]) {
          i++;
        }
        postDetails.endGridRow = i;

        return postDetails;
      }
    }
  }

  return postDetails;
}

const initUnidimensionalMatrix = (matrix, length, character = "X") => {
  // The 0 index will be filled with a different character for easier logic.
  matrix.push("/");

  // Go to equal the length, since the 0 index will be ignored.
  // Fill with "null" entries with the provided character.
  for (let i = 1; i <= length; i++) {
    matrix.push(character);
  }

  // Put an extra entry for easier logic.
  matrix.push("/");

  return matrix;
}

const initBidimensionalMatrix = (matrix, width, height, nullChar) => {
  // Put in a guard row, at index 0.
  matrix.push(initUnidimensionalMatrix([], width, "/"));

  // Go to equal the width, since the 0 index will be ignored.
  for (let i = 0; i < height; i++) {
    matrix.push(initUnidimensionalMatrix([], width, nullChar));
  }
  // Put in an extra guard row.
  matrix.push(initUnidimensionalMatrix([], width, "/"));

  return matrix;
}
