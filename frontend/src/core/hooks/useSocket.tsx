import { io } from 'socket.io-client'
import useConfig from './useConfig'

const useSocket = () => {
  const { getApiUrl } = useConfig()
  const url = getApiUrl()
  const socket = io('https://localhost:3001', { transports: ['websocket'] })

  console.log(url)
  /**
   * Send message
   * @param channel string
   * @param message string/object
   */
  const send = (channel: string, message: string | object) => {
    console.log('Send function working');
    socket.emit(channel, message)
  }

  return { socket, send }
}

export default useSocket