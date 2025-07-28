import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi'
import { useEffect } from 'react'
import { message } from 'antd'

export function useWallet() {
  const { open } = useAppKit()
  const { address, isConnected, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()

  const connectWallet = async () => {
    try {
      await open()
    } catch (error) {
      console.error('连接钱包失败:', error)
      message.error('连接钱包失败')
    }
  }

  const disconnectWallet = () => {
    try {
      disconnect()
      message.success('钱包已断开连接')
    } catch (error) {
      console.error('断开连接失败:', error)
      message.error('断开连接失败')
    }
  }

  return {
    address,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet
  }
}