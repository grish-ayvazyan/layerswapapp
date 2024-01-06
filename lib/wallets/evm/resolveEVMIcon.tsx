import MetaMaskIcon from "../../../components/icons/Wallets/MetaMask"
import WalletConnectIcon from "../../../components/icons/Wallets/WalletConnect"
import BitKeep from "../../../components/icons/Wallets/BitKeep"
import RainbowIcon from "../../../components/icons/Wallets/Rainbow"
import CoinbaseIcon from "../../../components/icons/Wallets/Coinbase"
import { Coins } from "lucide-react"
import Phantom from "../../../components/icons/Wallets/Phantom"
import { Connector } from "wagmi"

export const ResolveEVMWalletIcon = ({ connector }: { connector: Connector<any, any>}) => {
    let icon: ((props: any) => JSX.Element) | null = null;

    // Check first by id then by name
    switch (connector?.id?.toLowerCase()) {
        case KnownKonnectorIds.MetaMask:
            icon = MetaMaskIcon;
        case KnownKonnectorIds.WalletConnect:
            icon = WalletConnectIcon;
        case KnownKonnectorIds.Rainbow:
            icon = RainbowIcon;
        case KnownKonnectorIds.BitKeep:
            icon = BitKeep;
        case KnownKonnectorIds.CoinbaseWallet:
            icon = CoinbaseIcon;
    }

    if (icon == null) {
        debugger;
        switch (connector?.name?.toLowerCase()) {
            case KnownKonnectorNames.Phantom:
                icon = Phantom;
        }
    }

    if (icon == null) {
        icon = CoinsIcon
    }

    return icon;
}

const KnownKonnectorIds = {
    MetaMask: 'metamask',
    WalletConnect: 'walletconnect',
    Rainbow: 'rainbow',
    BitKeep: 'bitkeep',
    CoinbaseWallet: 'coinbasewallet',
}

const KnownKonnectorNames = {
    Phantom: 'phantom',
}

const CoinsIcon = (props) => {
    return <Coins {...props} strokeWidth={2} />
}
