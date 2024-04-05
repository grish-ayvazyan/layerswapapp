import { Wallet } from "../stores/walletStore"
import { CryptoNetwork, Network, Token } from "./Network"

export type GetNetworkBalancesProps = {
    network: CryptoNetwork,
    address: string
}

export type GetBalanceProps = {
    network: Network,
    token: Token,
    address: string
}

export type GasProps = {
    network: Network,
    token: Token,
    address?: `0x${string}`,
    userDestinationAddress?: string,
    wallet?: Wallet
}

export type Balance = {
    network: string,
    amount: number,
    decimals: number,
    isNativeCurrency: boolean,
    token: string,
    request_time: string,
}

export type Gas = {
    token: string,
    gas: number,
    gasDetails?: {
        gasLimit?: number,
        maxFeePerGas?: number,
        gasPrice?: number,
        maxPriorityFeePerGas?: number
    },
    request_time: string
}

export type BalanceProvider = {
    getBalance: ({ network, address }: BalanceProps) => Promise<Balance[] | undefined> | Balance[] | undefined | void,
    getGas?: ({ network, address, token, userDestinationAddress, wallet }: GasProps) => Promise<Gas[] | undefined> | undefined | void,
    supportedNetworks: string[],
}