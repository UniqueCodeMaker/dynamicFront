const isUserLoggedInToken = () => localStorage.getItem('token')
const base_url = process.env.REACT_APP_BASE_URL
/*const refreshToken = async () => {
  let now = new Date().valueOf()
  now = parseInt(now / 1000)
  const expiredAt = localStorage.getItem('expiredAt')
  if (expiredAt < now) {
    const data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${isUserLoggedInToken()}`
      }
    }
    
    try {
      const response = await fetch(`${base_url}/dummytext`, data)
      //console.log(response)
      if (response.status === 200) {
        const responseJson = await response.json()
        localStorage.setItem('token', responseJson.access_token)
        localStorage.setItem('expiredAt', responseJson.expiredAt)
      } else {
        localStorage.clear()
        window.location = "/login"
      }
    } catch (error) {
      localStorage.clear()
      window.location = "/login"
    }
  }
}*/
export const logoutOrderTron = async () => {
  const data = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${isUserLoggedInToken()}`
    }
  }
    
  try {
    const response = await fetch(`${base_url}/logout`, data)
    if (response.status === 200) {
    } else {
    }
  } catch (error) {
    
  }
}

export const refreshSettings = async () => {
  const data = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${isUserLoggedInToken()}`
    }
  }
    
  try {
    const response = await fetch(`${base_url}/refreshSettings`, data)
    console.log(response, "themeSetting")
    if (response.status === 200) {
      const responseJson = await response.json()
      return responseJson
    } else {
      localStorage.clear()
      window.location = "/login"
    }
  } catch (error) {
    localStorage.clear()
    window.location = "/login"
  }
}

export const getDataApi = async (subUrl, params) => {
  //refreshToken()
  let qs = ""
  if (params) {
    qs = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
    console.log(qs)
  }
  const data = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${isUserLoggedInToken()}`
    }
  }
  
  try {
    const response = await fetch(`${base_url}${subUrl}?${qs}`, data)
    const ErrorFormAPI = {
      status: "ServerError",
      responseCode: response.status,
      message: `Something went wrong server side so please try after some time. \n Server error code: ${response.status}`
    }

    if (response.status === 200) {
      const responseJson = await response.json()
      if (!responseJson.status) {
        if (responseJson.page) {
          if (responseJson.page === 'accountlist') {
            //localStorage.removeItem('userData')
            //window.location = "/accounts"
          } else if (responseJson.page === 'dashboard') {
            //localStorage.setItem('error', responseJson.message)
            //window.location = "/companyclient/dashboard"
          }
        }
      }
      const resp = {mainData: responseJson, responseCode:response.status}
      return resp
    } else {
      //localStorage.clear()
      //window.location = "/login"
    }
  } catch (error) {
    //console.log(error)
    //localStorage.clear()
    //window.location = "/login"
  }
}

export const postMehodWithBody = async (prop) => {
  
  // return 
  const userData = JSON.parse(localStorage.getItem('userData'))
  console.log("postMehodWithBody", prop)
  prop.bodydata.table_prefix = userData.table_prefix
  const data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${isUserLoggedInToken()}`
    },
    body: JSON.stringify(prop.bodydata)
  }
  try {
    const response = await fetch(`${base_url}${prop.url}`, data)
    const responseJson = await response.json()
    const ErrorFormAPI = {
      status: "ServerError",
      responseCode: response.status,
      message: `${responseJson.message}`
    }
    if (response.status === 200) {
      return responseJson
    } else {
      //localStorage.clear()
      //window.location = "/login"
    }
  } catch (error) {
    //console.log(error)
    //localStorage.clear()
    //window.location = "/login"
  }
}

export const getUserData = async (prop) => {
  //refreshToken()
  //const userData = JSON.parse(localStorage.getItem('userData'))
  const data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${isUserLoggedInToken()}`
    },
    body: JSON.stringify(prop.bodydata)
  }
  try {
    const response = await fetch(`${base_url}${prop.url}`, data)
    const responseJson = await response.json()
    //console.log(responseJson)
    const ErrorFormAPI = {
      status: "ServerError",
      responseCode: response.status,
      message: `${responseJson.message}`
    }
    if (response.status === 200) {
      return responseJson
    } else {
      //localStorage.clear()
      //window.location = "/login"
    }
  } catch (error) {
    //console.log(error)
   // localStorage.clear()
    //window.location = "/login"
  }
}

export const uploadImageFile = async (prop) => {
  //refreshToken()
  const userData = JSON.parse(localStorage.getItem('userData'))
  const data = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${isUserLoggedInToken()}`
    },
    body: prop.bodydata
  }
  try {
    const response = await fetch(`${base_url}${prop.url}${userData.table_prefix}`, data)
    const responseJson = await response.json()
    //console.log(responseJson)
    const ErrorFormAPI = {
      status: "ServerError",
      responseCode: response.status,
      message: `${responseJson.message}`
    }
    if (response.status === 200) {
      return responseJson
    } else {
      return ErrorFormAPI
    }
  } catch (error) {
    return error
  }
}