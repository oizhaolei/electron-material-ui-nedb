import { mongo2Material } from '../utils/utils';

export const initialState = {
  error: false,
  name: '',
  definition: {},
  suggests: {},
  changeList: [],
  changes: {},
  materialDefinition: [],
};
export default (state = initialState, { type, payload }) => {
  let newState;
  // let newDefinition;
  switch (type) {
    // case 'COLUMN_ADDED':
    //   newDefinition = {
    //     ...state.definition,
    //     [payload.newData.field]: {
    //       type: payload.newData.type,
    //     },
    //   };
    //   return {
    //     ...state,
    //     definition: newDefinition,
    //   };
    // case 'COLUMN_UPDATED':
    //   newDefinition = {
    //     ...state.definition,
    //   };
    //   delete newDefinition[payload.oldData.field];
    //   newDefinition = {
    //     ...newDefinition,
    //     [payload.newData.field]: {
    //       type: payload.newData.type,
    //     },
    //   };
    //   return {
    //     ...state,
    //     definition: newDefinition,
    //   };
    // case 'COLUMN_DELETED':
    //   newDefinition = {
    //     ...state.definition,
    //   };
    //   delete newDefinition[payload.oldData.field];
    //   return {
    //     ...state,
    //     definition: newDefinition,
    //   };
    case 'SCHEMA_CLEAN':
       return {
         ...initialState,
       };
    case 'SCHEMA_INIT':
      newState = {
        ...state,
        ...payload,
      };

      newState = {
        ...newState,
        materialDefinition: mongo2Material(newState),
      };
      return newState;
    case 'SCHEMA_DATA_CLEAR':
      return {
        ...state,
        changeList: [],
        changes: {},
      };
    case 'SCHEMA_DATA_CHANGE':
      return {
        ...state,
        changeList: payload.list,
        changes: {
          ...state.changes,
          [payload.field]: payload.value,
        },
      };
    default:
      return state;
  }
};
