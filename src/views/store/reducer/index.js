// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {},
  allData: []
}

const DataTablesReducer = (state = initialState, action) => {
  switch (action.type) {

    case 'GET_PRODUCT_DATA':
      return {
        ...state,
        allData: action.allData,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_CATEGORY_DATA':
      return {
        ...state,
        allData: action.allData,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_DATA':
      return {
        ...state,
        allData: action.allData,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_USER':
      return { ...state, selectedUser: action.selectedUser }
    
    
    case 'GET_TAX_DATA':
     
    return {
      ...state,
      // allData: action.allData,
      data: action.data
      // total: action.totalPages,
      // params: action.params
    }

      default:
      return state
  }

}

export default DataTablesReducer
