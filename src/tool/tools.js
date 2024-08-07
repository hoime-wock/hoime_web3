import {
    getAccount,
    getBalance,
    getGasPrice,
    // eslint-disable-next-line no-unused-vars
    simulateContract,
    writeContract,
    // eslint-disable-next-line no-unused-vars
    estimateMaxPriorityFeePerGas,
    waitForTransactionReceipt
} from "@wagmi/core";
import {parseEther} from 'viem';
import {Launcher} from "@/assets/solidity/ABI";
import {connector, WAGMI_CONFIG} from "./wallet";


// 创建代币
export async function create_token(token_form){
    console.log("代币名称:", token_form.name);
    console.log("代币符号:", token_form.symbol);
    console.log("代币供应量:", token_form.supply);
    console.log("代币精度:", token_form.decimals);
    let transaction_hash = null;
    let abi = Launcher.abi;
    let contract_address = Launcher[WAGMI_CONFIG.state.chainId].address;
    console.log(contract_address)
    // 获取Gas价格
    let gas_price = await getGasPrice(WAGMI_CONFIG, {
        chainId: WAGMI_CONFIG.state.chainId
    });
    transaction_hash = await writeContract(WAGMI_CONFIG, {
        abi,
        // 合约地址
        address: contract_address,
        // 方法名
        functionName: "create_token",
        // 参数列表
        args: [token_form.name, token_form.symbol, token_form.supply, token_form.decimals],
        // 连接器
        connector,
        // 验证链
        chainId: WAGMI_CONFIG.state.chainId,
        // Gas价格
        gasPrice: gas_price,
        // 最大优先支付费用
        // maxPriorityFeePerGas: max_priority_fee,
        // 收取 2 BONE 的手续费
        value: parseEther("2")
    });
    return transaction_hash;
}

// 计算交易成本
export async function calculate_transaction_costs(){
    // 获取连接地址
    let link_address = await getAccount(WAGMI_CONFIG).address;
    // 获取链接地址余额
    let link_address_balance = (await getBalance(WAGMI_CONFIG, {
        address: link_address
    })).value;
    // 获取Gas价格
    let gas_price = await getGasPrice(WAGMI_CONFIG, {
        chainId: WAGMI_CONFIG.state.chainId
    });
    // 设置值
    let value = parseEther("2");
    // 交易成本
    let transaction_costs = 21000000n * gas_price + value;
    return {
        contract_address: Launcher[WAGMI_CONFIG.state.chainId].address,
        gas_price: Number(gas_price) / 10 ** 9,
        value: 2,
        transaction_costs: Number(transaction_costs) / 10 ** 18,
        status: link_address_balance > transaction_costs
    };
}

// 获取代币地址
export async function obtain_token_address(hash){
    let token_address = null;
    let transaction_result = await waitForTransactionReceipt(WAGMI_CONFIG, {
        chainId: WAGMI_CONFIG.state.chainId,
        hash: hash
    });
    token_address = transaction_result.logs[2].address;
    return token_address;
}