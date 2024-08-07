<template>
  <div class="common">
    <div class="content">
      <div style="width: 750px">
        <el-card v-loading="loading" element-loading-text="Creating...">
          <template #header>
            <div class="card-header">
              <span>Token Launch Pad</span>
            </div>
          </template>
          <el-steps :active="step" align-center>
            <el-step title="Step 1" description="Fill Token Info" />
            <el-step title="Step 2" description="Confirm Transaction" />
            <el-step title="Step 3" description="Complete Create" />
          </el-steps>
          <br />
          <!--第一步 填写信息-->
          <div v-show="step === 1">
            <el-form ref="TokenForm" :model="form" :rules="form_rules" label-width="auto" label-position="top">
              <el-form-item label="Token Name" prop="name">
                <el-input v-model="form.name" placeholder="Bitcoin" />
              </el-form-item>
              <el-form-item label="Token Symbol" prop="symbol">
                <el-input v-model="form.symbol" placeholder="BTC" />
              </el-form-item>
              <el-form-item label="Total Supply" prop="supply">
                <el-input v-model="form.supply" type="number" min="0" max="999999999999999999999" maxlength="21" placeholder="21000000" />
              </el-form-item>
              <el-form-item label="Token Decimals" prop="decimals">
                <el-input-number v-model="form.decimals" :min="1" :max="18"/>
              </el-form-item>
              <el-form-item>
                <el-tag type="danger" effect="dark">Creation Fee: 2 BONE</el-tag>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="next_step" style="width: 100%">Next Step</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!--第二步 确认支付信息-->
          <div v-show="step === 2">
            <el-descriptions title="Token Info" :column="1" border>
              <el-descriptions-item label="Token Name" label-class-name="token_info_label" label-align="left" align="center">{{ form.name }}</el-descriptions-item>
              <el-descriptions-item label="Token Symbol" label-align="left" align="center">{{ form.symbol }}</el-descriptions-item>
              <el-descriptions-item label="Total Supply" label-align="left" align="center">{{ form.supply }}</el-descriptions-item>
              <el-descriptions-item label="Token Decimals" label-align="left" align="center">{{ form.decimals }}</el-descriptions-item>
            </el-descriptions>
            <br />
            <el-descriptions title="Transaction Details" :column="1" border>
              <el-descriptions-item label="Contract Address" label-class-name="transaction_details_label" label-align="left" align="center">{{ transaction_address.contract_address }}</el-descriptions-item>
              <el-descriptions-item label="Your Wallet Address" label-align="left" align="center">{{ transaction_address.wallet_address }}</el-descriptions-item>
              <el-descriptions-item label="Gas Price" label-align="left" align="center">{{ transaction_costs.gas_price }} Gwei</el-descriptions-item>
              <el-descriptions-item label="Creation Fee" label-align="left" align="center">{{ transaction_costs.value }} BONE</el-descriptions-item>
              <el-descriptions-item label="Total Transaction Cost" label-align="left" align="center">{{ transaction_costs.transaction_costs }} BONE</el-descriptions-item>
            </el-descriptions>
            <br />
            <div style="width: 100%;">
              <el-button type="info" @click="step = 1" style="width: 48%; float: left">Back</el-button>
              <el-button type="primary" @click="create_new_token" style="width: 48%;">Create Token</el-button>
            </div>
          </div>
          <!--第三部 交易状态-->
          <div v-show="step === 3">
            <!--成功-->
            <div v-if="transaction_status">
              <el-result icon="success" title="Transaction Success" />
              <el-descriptions title="Transaction Info" :column="1" border>
                <el-descriptions-item label="Transaction Hash" label-class-name="transaction_details_label" label-align="left" align="center">0x5494458542ad4fe44f471e0417d9f7e5f160855e21c267b14731936a688ea166</el-descriptions-item>
                <!--<el-descriptions-item label="Transaction Hash" label-class-name="transaction_details_label" label-align="left" align="center">{{ transaction_info.hash }}</el-descriptions-item>-->
                <el-descriptions-item label="Your Token Address" label-align="left" align="center">{{ transaction_info.token_address }}</el-descriptions-item>
              </el-descriptions>
              <br />
              <el-button type="primary" @click="go" style="width: 100%">Go to Shibarium</el-button>
            </div>
            <!--失败-->
            <div v-else>
              <el-result icon="error" title="Transaction Failed" />
              <div class="info">
                <p>Possible Reason:</p>
                <p>1.You canceled the transaction</p>
                <p>2.Your wallet does not have enough balance to pay</p>
                <p>3.Network fluctuations</p>
              </div>
              <br />
              <el-button type="info" @click="reset_info" style="width: 100%">Reset Info</el-button>
            </div>
            <br />
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>


<script>
// eslint-disable-next-line no-unused-vars
import { ElLoading } from 'element-plus'
// eslint-disable-next-line no-unused-vars
import {get_account_info, open, WAGMI_CONFIG} from "@/tool/wallet";
// eslint-disable-next-line no-unused-vars
import {create_token, calculate_transaction_costs, obtain_token_address} from "@/tool/tools";
//badc392e057140be3dd01ee221008ce0
export default {
  name: "LaunchPad",
  mounted() {
    document.title = "Token Launch Pad - Hoime Web3";
  },
  data(){
    return {
      step: 1,
      form_rules: {
        name: [{required: true, message: "Please enter the token name", trigger: "blur"}],
        symbol: [{required: true, message: "Please enter the token symbol", trigger: "blur"}],
        supply: [{required: true, message: "Please enter the token supply", trigger: "blur"}],
        decimals: [{required: true, message: "Please enter the token decimals", trigger: "blur"}]
      },
      form: {
        name: "",
        symbol: "",
        supply: "",
        decimals: 18
      },
      // 交易地址
      transaction_address: {
        contract_address: null,
        wallet_address: null
      },
      // 交易成本
      transaction_costs: {
        contract_address: null,
        gas_price: 0,
        value: 0,
        transaction_costs: 0,
        status: false
      },
      // 交易信息
      transaction_info: {
        hash: null,
        address: null,
        token_address: null
      },
      // 交易状态
      transaction_status: false
    }
  },
  components: {
  },
  methods: {
    // 获取钱包信息
    async obtain_wallet_info(){
      // 获取账户信息
      let account_info = await get_account_info();
      this.transaction_address.wallet_address = account_info.address;
    },
    // 下一步
    async next_step(){
      // 获取账户信息
      let account_info = await get_account_info();
      // 钱包是否链接
      if(account_info.isDisconnected){
        await open();
        return false;
      }
      // 效验表单
      let status = await this.$refs.TokenForm.validate((valid) => {if (!valid) {return false;}});
      if(status){
        // 将符号大写
        this.form.symbol = this.form.symbol.toUpperCase();
        // 获取钱包信息
        await this.obtain_wallet_info();
        // 获取交易成本
        this.transaction_costs = await calculate_transaction_costs();
        // 设置地址
        this.transaction_address.wallet_address = account_info.address;
        this.transaction_address.contract_address = this.transaction_costs.contract_address;
        // 设置到第二步
        this.step = 2;
      }else {
        return false;
      }
    },
    // 创建新的代币
    async create_new_token(){
      // 获取账户信息
      let account_info = await get_account_info();
      // 钱包是否链接
      if(account_info.isDisconnected){
        await open();
        return false;
      }
      // 加载中
      let loading = ElLoading.service({
        lock: true,
        text: "Creating..., Do Not Refresh The Page!",
        background: "rgba(0, 0, 0, 0.7)"
      });
      console.log(this.transaction_costs.status);
      if(this.transaction_costs.status){
        // 开始交易
        try {
          // 获取交易Hash
          this.transaction_info.hash = await create_token(this.form);
          // 等待15秒
          await new Promise(resolve => setTimeout(resolve, 15000));
          // 获取代币地址
          this.transaction_info.token_address = await obtain_token_address(this.transaction_info.hash);
          // 关闭弹窗
          loading.close();
          // 更新交易状态
          this.transaction_status = true;
          this.step = 3;
        }catch(error){
          console.log(error);
          loading.close();
          this.transaction_status = false;
          this.step = 3;
          return false;
        }
      }else {
        loading.close();
        // 更新交易状态
        this.transaction_status = false;
        this.step = 3;
        return false;
      }
    },
    // 前往
    async go(){
      let link = document.createElement("a");
      link.target = "_blank";
      link.href = "https://puppyscan.shib.io/token/" + this.transaction_info.token_address;
      document.body.appendChild(link);
      link.click();
    },
    // 重置信息
    async reset_info(){
      this.form.name = "";
      this.form.symbol = "";
      this.form.supply = "";
      this.form.decimals = 18;
      // 回到第一步
      this.step = 1;
    }
  }
}
</script>

<style scoped>
.common {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 24px;
}

.info {
  width: 75%;
  font-size: 18px;
  text-align: center;
  color: rgb(154, 155, 158);
  margin: auto;
}

.info p{
  margin-bottom: 6px;
  text-align: left;
}


</style>