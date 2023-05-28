// import {getDataApi} from '../../../../src/CommonApi'
// ** Get table Data

export const getData = params => {
  return async dispatch => {
    fetch('http://localhost:3030/test/serveall')
    .then(response => response.json())
    .then(incoming => {
      console.log("incoming", incoming)
      if (incoming) {
          dispatch({
            type: 'GET_DATA',
            allData: incoming.data,
            data:incoming.data,
            totalPages: 1,
            params
          })
        
      }
    })
    .catch(err => console.error(err))
   
   
  }
}


export const getSupplierData = params => {
  localStorage.setItem('supplierTableFilter', JSON.stringify(params))
  return async dispatch => {
    const res = await getDataApi(`/getsuppliers`, params)
    if (res && res.responseCode === 200) {
      dispatch({
        type: 'GET_DATA',
        allData: res.mainData,
        data: res.mainData.suppliers,
        totalPages: res.mainData.count,
        singleUnit: params.supplier,
        params
      })
    }
  }
}

export const getProductData = params => {
  localStorage.setItem('productTableFilter', JSON.stringify(params))
  return async dispatch => {
    const res = await getDataApi(`/getproducts`, params)
    if (res && res.responseCode === 200) {
      dispatch({
        type: 'GET_PRODUCT_DATA',
        allData: res.mainData,
        data: res.mainData.products,
        totalPages: res.mainData.count,
        singleUnit: params.product,
        params
      })
    }
  }
}

export const getCategoryData = params => {
  localStorage.setItem('categoryfilter', JSON.stringify(params))
  return async dispatch => {
    const res = await getDataApi(`/getcategories`, params)
    if (res && res.responseCode === 200) {
      dispatch({
        type: 'GET_CATEGORY_DATA',
        allData: res.mainData,
        data: res.mainData.categories,
        totalPages: res.mainData.count,
        singleUnit: params.category,
        params
      })
    }
  }
}

export const updateCategoryData = params => {
  return async dispatch => {
    dispatch({
      type: 'GET_CATEGORY_DATA',
      data: params
    })
  }
}
