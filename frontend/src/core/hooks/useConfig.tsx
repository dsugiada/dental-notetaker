const useConfig = () => {
  /**
   * Get the backend url
   * @returns string
   */
  const getApiUrl = () => {
    const host = process.env.REACT_APP_BACKEND_HOST
    const port = process.env.REACT_APP_BACKEND_PORT
    const urlApi = `https://${host}:${port}/api`
    return urlApi
  }

  const getBaseUrl = () => {
    const host = process.env.REACT_APP_BACKEND_HOST
    const port = process.env.REACT_APP_BACKEND_PORT
    const urlBase = `https://${host}:${port}/`
    return urlBase
  }

  return { getApiUrl , getBaseUrl}
}

export default useConfig
