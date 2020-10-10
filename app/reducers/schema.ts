export const initialState = {
  error: false,
  name: '',
  definition: {},
  label: '',
  icon: 'ac_unit',
  suggests: {},
  data: {},
  files: [],
};
export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SCHEMA_DATA_CHANGE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
