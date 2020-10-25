export const initialState = {
  error: false,
  name: '',
  type: 'one-to-many',
  relations: {},
  code: '',
  definition: {},
  data: {},
};

const genCode = ({ one, many }) => `
(({ models, filter, projection, options, callback }) => {
  (async () => {
    console.log('vm start.');

    const rows = await models['${one.table}'].find(filter, projection, options).lean();
    const result = await Promise.all(rows.map(async (p) => {
      const many = await models['${many.table}'].find({ ['${many.field}']: p['${one.field}'] }).lean();
      return {
        ...p,
        many,
      };
    }));
    console.log('vm end');
    callback(false, result);
  })();
})
`;

export default (state = initialState, action) => {
  switch (action.type) {
    case 'QUERY_WIZARD_CLEAN':
       return {
         ...initialState,
       };
    case 'QUERY_DATA_CHANGE':
      return {
        ...state,
        ...action.payload,
      };
    case 'QUERY_RELATION_CHANGE':
      const relations = {
        ...state.relations,
        ...action.payload,
      };
      const error = !(
        relations.one
        && relations.one.table
        && relations.one.field
        && relations.many
        && relations.many.table
        && relations.many.field
      );
      const code = relations.one && relations.many && genCode(relations);
      return {
        ...state,
        relations,
        error,
        code,
      };
    default:
      return state;
  }
};
