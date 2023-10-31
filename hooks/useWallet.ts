import toast from "react-hot-toast"
import { NetworkType } from "../Models/CryptoNetwork"
import { Layer } from "../Models/Layer"
import LayerSwapApiClient, { SwapItem } from "../lib/layerSwapApiClient"
import { StarknetWindowObject } from "get-starknet"
import { useSwapDataUpdate } from "../context/swap"
import { Wallet } from "../stores/walletStore"
import { LinkResults } from "@imtbl/imx-sdk"
import useStarknet from "../lib/wallets/starknet" 
import useImmutableX from "../lib/wallets/immutableX"
import useEVM from "../lib/wallets/evm"
import useTON from "../lib/wallets/ton"

export default function useWallet() {
    const { mutateSwap } = useSwapDataUpdate()
    const { connectStarknet, disconnectStarknet, getStarknetWallet } = useStarknet()
    const { connectImx, disconnectImx, getImxWallet } = useImmutableX()
    const { connectEVM, disconnectEVM, getEVMWallet } = useEVM()
    const { connectTON, disconnectTON, getTONWallet } = useTON()

    async function handleConnect(layer: Layer & { isExchange: false, type: NetworkType.Starknet }): Promise<StarknetWindowObject>
    async function handleConnect(layer: Layer & { isExchange: false, type: NetworkType.StarkEx }): Promise<LinkResults.Setup>
    async function handleConnect(layer: Layer & { isExchange: false, type: NetworkType }): Promise<void>
    async function handleConnect(layer: Layer & { isExchange: false, type: NetworkType }) {
        try {
            if (layer.type === NetworkType.Starknet) {
                const res = await connectStarknet(layer)
                return res
            }
            else if (layer.type === NetworkType.StarkEx) {
                const res = await connectImx(layer)
                return res
            }
            else if (layer.type === NetworkType.EVM) {
                return connectEVM()
            }
            else if (layer.type === NetworkType.TON) {
                return connectTON()
            }
        }
        catch {
            toast.error("Couldn't connect the account")
        }
    }

    const handleDisconnect = async (network: Layer, swap?: SwapItem) => {
        const networkType = network?.type
        try {
            if (swap?.source_exchange) {
                const apiClient = new LayerSwapApiClient()
                await apiClient.DisconnectExchangeAsync(swap.id, "coinbase")
                await mutateSwap()
            }
            else if (networkType === NetworkType.EVM) {
                await disconnectEVM()
            }
            else if (networkType === NetworkType.TON) {
                await disconnectTON()
            }
            else if (networkType === NetworkType.Starknet) {
                await disconnectStarknet(network)
            }
            else if (networkType === NetworkType.StarkEx) {
                disconnectImx(network)
            }
        }
        catch {
            toast.error("Couldn't disconnect the account")
        }
    }

    const getConnectedWallets = () => {
        let connectedWallets: Wallet[] = []

        const imx = getImxWallet()
        const starknet = getStarknetWallet()
        const evm = getEVMWallet()
        const ton = getTONWallet()
        connectedWallets = evm && [...connectedWallets,
            evm
        ] || [...connectedWallets]
        connectedWallets = ton && [...connectedWallets,
            ton
        ] || [...connectedWallets]
        connectedWallets = starknet && [...connectedWallets,
            starknet
        ] || [...connectedWallets]
        connectedWallets = imx && [...connectedWallets,
            imx
        ] || [...connectedWallets]

        return connectedWallets
    }

    const connectedWallets = getConnectedWallets()

    return {
        wallets: connectedWallets,
        connectWallet: handleConnect,
        disconnectWallet: handleDisconnect,
    }
}