const useConfig = () => {
  /**
   * Get the backend url
   * @returns string
   */
  const getBaseUrl = () => {
    const host = process.env.REACT_APP_BACKEND_HOST
    const port = process.env.REACT_APP_BACKEND_PORT
    const url = `https://${host}:${port}`
    return url
  }

  const getApiUrl = () => {
    const baseUrl = getBaseUrl(); // Reuse getBaseUrl for consistency
    return `${baseUrl}/api`;
  };

  return { getBaseUrl, getApiUrl };
}

export default useConfig