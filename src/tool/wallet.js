import { createWeb3Modal, defaultWagmiConfig, useWeb3ModalState, useWeb3Modal } from "@web3modal/wagmi/vue";
import { shibarium, shibariumTestnet } from "viem/chains";
// eslint-disable-next-line no-unused-vars
import {reconnect, signMessage, getAccount, sendTransaction, waitForTransaction, writeContract, readContract, prepareWriteContract, erc20ABI, fetchFeeData, disconnect} from "@wagmi/core";
// eslint-disable-next-line no-unused-vars
import { createStorage } from "@wagmi/core";
// eslint-disable-next-line no-unused-vars
import {parseEther, parseGwei} from "viem";

// 设置项目ID
const PROJECT_ID = "badc392e057140be3dd01ee221008ce0";

// 设置MeatData
const META_DATA = {
    name: 'Hoime',
    description: 'AppKit Example',
    url: 'https://web3.hoime.vip', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 设置链列表
const CHAIN_LIST = [shibarium, shibariumTestnet];

// 设置Wagmi配置信息
export const WAGMI_CONFIG = defaultWagmiConfig({
    projectId: PROJECT_ID,
    chains: CHAIN_LIST,
    metadata: META_DATA,
    auth: {
        email: false
    }
    // ...wagmiOptions // Optional - Override createConfig parameters
});


// 创建 modal
// eslint-disable-next-line no-unused-vars
export const MODAL = createWeb3Modal({
    wagmiConfig: WAGMI_CONFIG,
    projectId: PROJECT_ID,
    chains: CHAIN_LIST,
    // 设置链图标
    chainImages: {
        109: "https://pbs.twimg.com/profile_images/1781007982236401664/Ce2gwqjc_400x400.jpg"
    },
    // defaultChain: shibarium,
    enableAnalytics: false, // Optional - defaults to your Cloud configuration
    enableOnramp: false, // Optional - false as default
    themeMode: "light"
});


// eslint-disable-next-line no-unused-vars
export const USE_MODAL_RES = useWeb3ModalState();

export const { open, close } = useWeb3Modal();
export const { connector } = getAccount(WAGMI_CONFIG);

// eslint-disable-next-line no-unused-vars
reconnect(WAGMI_CONFIG);

// 获取账户信息
export async function get_account_info(){
    let account_info;
    account_info = await getAccount(WAGMI_CONFIG);
    return account_info;
}

// 关闭连接
export async function close_connect(){
    await disconnect(WAGMI_CONFIG, {connector});
}

