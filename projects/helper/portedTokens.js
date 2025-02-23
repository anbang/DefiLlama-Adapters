const utils = require("../helper/utils");
const sdk = require("@defillama/sdk");
const IOTEX_CG_MAPPING = require("./../xdollar-finance/iotex_cg_mapping.json")

async function transformFantomAddress() {
  const multichainTokens = (
    await utils.fetchURL("https://netapi.anyswap.net/bridge/v2/info")
  ).data.bridgeList;

  return (addr) => {
    // WFTM && FTM
    if (
      compareAddresses(addr, "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83") ||
      compareAddresses(addr, "0x0000000000000000000000000000000000000000") ||
      compareAddresses(addr, "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    ) {
      return "0x4e15361fd6b4bb609fa63c81a2be19d873717870";
    }
    if (compareAddresses(addr, "0x658b0c7613e890ee50b8c4bc6a3f41ef411208ad")) {
      // fETH
      return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    }
    if (compareAddresses(addr, "0x82f0b8b456c1a451378467398982d4834b6829c1")) {
      // MIM
      return "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3";
    }
    if (compareAddresses(addr, "0x260b3e40c714ce8196465ec824cd8bb915081812")) {
      return "polygon:0x4a81f8796e0c6ad4877a51c86693b0de8093f2ef"; // IRON ICE
    }
    const srcToken = multichainTokens.find(
      (token) => token.chainId === "250" && token.token === addr.toLowerCase()
    );
    if (srcToken !== undefined) {
      if (srcToken.srcChainId === "1") {
        return srcToken.srcToken;
      } else if (srcToken.srcChainId === "56") {
        if (srcToken.srcToken === "") {
          return "bsc:0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
        }
        return `bsc:${srcToken.srcToken}`;
      }
    }
    return `fantom:${addr}`;
  };
}

function compareAddresses(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

async function transformAvaxAddress() {
  const [bridgeTokensOld, bridgeTokensNew, bridgeTokenDetails] =
    await Promise.all([
      utils.fetchURL(
        "https://raw.githubusercontent.com/0xngmi/bridge-tokens/main/data/penultimate.json"
      ),
      utils
        .fetchURL(
          "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/avalanche_contract_address.json"
        )
        .then((r) => Object.entries(r.data)),
      utils.fetchURL(
        "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/token_list.json"
      ),
    ]);
    return (addr) => {
      if(compareAddresses(addr, "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7")){
        return "avax:0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"
      }
      const srcToken = bridgeTokensOld.data.find((token) =>
      compareAddresses(token["Avalanche Token Address"], addr)
      );
      if (
        srcToken !== undefined &&
        srcToken["Ethereum Token Decimals"] ===
        srcToken["Avalanche Token Decimals"]
      ) {
        return srcToken["Ethereum Token Address"];
      }
      const newBridgeToken = bridgeTokensNew.find((token) =>
        compareAddresses(addr, token[1])
      );
      if (newBridgeToken !== undefined) {
        const tokenName = newBridgeToken[0].split(".")[0];
        const tokenData = bridgeTokenDetails.data[tokenName];
        if (tokenData !== undefined) {
          return tokenData.nativeContractAddress;
        }
      }
      const map = {
        "0xaf2c034c764d53005cc6cbc092518112cbd652bb": "avax:0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
        "0x57319d41f71e81f3c65f2a47ca4e001ebafd4f33": "avax:0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
        "0x0000000000000000000000000000000000000000": "avax:0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
        "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx": "avax:0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
        "0xd45b7c061016102f9fa220502908f2c0f1add1d7": "0xffc97d72e13e01096502cb8eb52dee56f74dad7b",
        "0x47afa96cdc9fab46904a55a6ad4bf6660b53c38a": "0x028171bca77440897b824ca71d1c56cac55b68a3",
        "0x46a51127c3ce23fb7ab1de06226147f446e4a857": "0xbcca60bb61934080951369a648fb03df4f96263c",
        "0x532e6537fea298397212f09a61e03311686f548e": "0x3ed3b47dd13ec9a98b44e6204a523e766b225811",
        "0xdfe521292ece2a4f44242efbcd66bc594ca9714b": "avax:0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
        "0x686bef2417b6dc32c50a3cbfbcc3bb60e1e9a15d": "0x9ff58f4ffb29fa2266ab25e75e2a8b3503311656",
        "0x53f7c5869a859f0aec3d334ee8b4cf01e3492f21": "0x030ba81f1c18d280636f32af80b9aad02cf0854e",

        "0xd45b7c061016102f9fa220502908f2c0f1add1d7": "0xffc97d72e13e01096502cb8eb52dee56f74dad7b",
        "0x47afa96cdc9fab46904a55a6ad4bf6660b53c38a": "0x028171bca77440897b824ca71d1c56cac55b68a3",
        "0x46A51127C3ce23fb7AB1DE06226147F446e4a857": "0xbcca60bb61934080951369a648fb03df4f96263c",
        "0x574679Ec54972cf6d705E0a71467Bb5BB362919D": "avax:0x5817d4f0b62a59b17f75207da1848c2ce75e7af4",
        "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7": "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "0x2f28add68e59733d23d5f57d94c31fb965f835d0": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",// sUSDC(Avalanche) -> USDC(Ethereum)
        "0xf04d3a8eb17b832fbebf43610e94bdc4fd5cf2dd": "bsc:0xe9e7cea3dedca5984780bafc599bd69add087d56", // sBUSD(Avalanche) -> BUSD(BSC)
      }
      return map[addr.toLowerCase()] || `avax:${addr}`
  }
}

async function transformBscAddress() {
  const binanceBridge = (
    await utils.fetchURL(
      "https://api.binance.org/bridge/api/v2/tokens?walletNetwork="
    )
  ).data.data.tokens;

  return (addr) => {
    const srcToken = binanceBridge.find(
      (token) =>
        token.ethContractAddress !== "" &&
        token.bscContractAddress.toLowerCase() === addr.toLowerCase()
    );
    if (
      srcToken !== undefined &&
      srcToken.bscContractDecimal === srcToken.ethContractDecimal
    ) {
      return srcToken.ethContractAddress;
    }
    // BNB
    if (
      addr.toLowerCase() == "0x0000000000000000000000000000000000000000" ||
      addr.toLowerCase() == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    ) {
      return "bsc:0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
    }
    if (addr.toLowerCase() == "0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c") {
      return "avax:0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c";
    }
    if (addr.toLowerCase() == "0x2170ed0880ac9a755fd29b2688956bd959f933f8") {
      return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    }
    if (addr.toLowerCase() == "0xa35d95872d8eb056eb2cbd67d25124a6add7455e") {
      return "0x123"; // 2030FLOKI returns nonsense TVL
    }
    if (addr.toLowerCase() == "0x0cf8e180350253271f4b917ccfb0accc4862f262") {
      return "0x123"; // BTCBR returns nonsense TVL
    }
    if (addr.toLowerCase() == "0x6ded0f2c886568fb4bb6f04f179093d3d167c9d7") {
      return "0x09ce2b746c32528b7d864a1e3979bd97d2f095ab"; // BTCBR returns nonsense TVL
    }
    if (addr.toLowerCase() === "0x2f28add68e59733d23d5f57d94c31fb965f835d0".toLowerCase()) {
      return "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // sUSDC(BSC) -> USDC(Ethereum)
    }
    return `bsc:${addr}`;
  };
}

const PoSMappedTokenList =
  "https://api.bridge.matic.network/api/tokens/pos/erc20";
const PlasmaMappedTokenList =
  "https://api.bridge.matic.network/api/tokens/plasma/erc20";

async function transformPolygonAddress() {
  const posTokens = await utils.fetchURL(PoSMappedTokenList);
  const plasmaTokens = await utils.fetchURL(PlasmaMappedTokenList);
  const tokens = posTokens.data.tokens
    .concat(plasmaTokens.data.tokens)
    .reduce((tokenMap, token) => {
      tokenMap[token.childToken.toLowerCase()] = token.rootToken.toLowerCase();
      return tokenMap;
    }, {});

  return (addr) => {
    if (addr.toLowerCase() == '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      return "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0";
    }
    if (addr.toLowerCase() === "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619") {
      return "0x0000000000000000000000000000000000000000";
    }
    if (addr.toLowerCase() === "0x0000000000000000000000000000000000000000") {
      return "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0";
    }
    if (addr.toLowerCase() === "0x2f28Add68e59733D23D5F57d94c31fb965f835D0".toLowerCase()) {
      return "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // sUSDC(Polygon) -> USDC(Ethereum)
    }
    if (addr.toLowerCase() === "0xf04d3A8Eb17B832Fbebf43610e94BdC4fD5Cf2dd".toLowerCase()) {
      return "bsc:0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";// sBUSD(Polygon) -> BUSD(BSC)
    }
    if (addr.toLowerCase() === "0x8Eb3771A43a8C45AaBE6d61ED709eCe652281DC9".toLowerCase()) {
      return "avax:0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664";// sUSDC.e(Polygon) -> USDC.e(Avalanche)
    }
    return tokens[addr.toLowerCase()] || `polygon:${addr}`;
  };
}

const bridgeAdd = "0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d";
const abiXdaiBridgeAbi = {
  type: "function",
  stateMutability: "view",
  payable: false,
  outputs: [
    {
      type: "address",
      name: "",
    },
  ],
  name: "foreignTokenAddress",
  inputs: [
    {
      internalType: "address",
      type: "address",
      name: "_homeToken",
    },
  ],
  constant: true,
};
async function transformXdaiAddress() {
  return async (address) => {
    if (
      address === "0x0000000000000000000000000000000000000000" ||
      address.toLowerCase() === "0x44fa8e6f47987339850636f88629646662444217" ||
      address.toLowerCase() === "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d"
    ) {
      return `0x6b175474e89094c44da98b954eedeac495271d0f`;
    }
    if (
      address.toLowerCase() === "0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1"
    ) {
      return `0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2`;
    }
    if (
      address.toLowerCase() === "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83"
    ) {
      return `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`;
    }
    if (
      address.toLowerCase() === "0x4537e328bf7e4efa29d05caea260d7fe26af9d74"
    ) {
      return `0x1f9840a85d5af5bf1d1762f925bdaddc4201f984`;
    }
    if (
      address.toLowerCase() === "0x4ecaba5870353805a9f068101a40e0f32ed605c6"
    ) {
      return `0xdac17f958d2ee523a2206206994597c13d831ec7`;
    }
    if (
      address.toLowerCase() === "0x7122d7661c4564b7c6cd4878b06766489a6028a2"
    ) {
      return `0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0`;
    }
    if (
      address.toLowerCase() === "0x8e5bbbb09ed1ebde8674cda39a0c169401db4252"
    ) {
      return `0x2260fac5e5542a773aa44fbcfedf7c193bc2c599`;
    }

    // const result = await sdk.api.abi.call({
    //   target: bridgeAdd,
    //   abi: abiXdaiBridgeAbi,
    //   params: [address],
    //   chain: "xdai",
    // });
    // if (result.output === "0x0000000000000000000000000000000000000000") {
    //   return `xdai:${address}`;
    // }
    // // XDAI -> DAI
    // return result.output;
  };
}

async function transformOkexAddress() {
  const okexBridge = (
    await utils.fetchURL(
      "https://www.okex.com/v2/asset/cross-chain/currencyAddress"
    )
  ).data.data.tokens;
  // TODO
  return (addr) => {
    if (compareAddresses(addr, "0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c")) {
      return "avax:0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c";
    }
    // Native token -> OKB
    if (compareAddresses(addr, "0x0000000000000000000000000000000000000000")) {
      return "0x75231f58b43240c9718dd58b4967c5114342a86c";
    }
    return `okexchain:${addr}`;
  };
}

async function transformHecoAddress() {
  return (addr) => {
    if (addr.toLowerCase() == "0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c") {
      return "avax:0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c";
    }
    if (addr.toLowerCase() == "0x0000000000000000000000000000000000000000" || addr.toLowerCase() == "0xhecozzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz") {
      return "0x6f259637dcd74c767781e37bc6133cd6a68aa161";
    }
    return `heco:${addr}`;
  };
}

async function transformCeloAddress() {
  return (addr) => {
    if (addr.toLowerCase() === "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73") {
      //return "0xd71ecff9342a5ced620049e616c5035f1db98620" //sEUR
      return "celo-euro";
    }
    if (addr.toLowerCase() === "0x765de816845861e75a25fca122bb6898b8b1282a") {
      //return "0x8e870d67f660d95d5be530380d0ec0bd388289e1" //USDP
      return "celo-dollar";
    }
    if (addr.toLowerCase() === "0x471ece3750da237f93b8e339c536989b8978a438") {
      return "celo"; //CELO
    }
    return `celo:${addr}`;
  };
}

async function transformHarmonyAddress() {
  const bridge = (
    await utils.fetchURL("https://be4.bridge.hmny.io/tokens/?page=0&size=1000")
  ).data.content;

  return (addr) => {
    if (compareAddresses(addr, "0x6983D1E6DEf3690C4d616b13597A09e6193EA013")) {
      return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    }
    if (compareAddresses(addr, "0x224e64ec1bdce3870a6a6c777edd450454068fec")) {
      return "0xa47c8bf37f92abed4a126bda807a7b7498661acd";
    }
    if (compareAddresses(addr, "0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c")) {
      return "avax:0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c";
    }
    if (compareAddresses(addr, "0xd754ae7bb55feb0c4ba6bc037b4a140f14ebe018")) {
      return "bsc:0x19e6bfc1a6e4b042fb20531244d47e252445df01";
    }
    const srcToken = bridge.find((token) =>
      compareAddresses(addr, token.hrc20Address)
    );
    if (srcToken !== undefined) {
      const prefix = srcToken.network === "BINANCE" ? "bsc:" : "";
      return prefix + srcToken.erc20Address;
    }
    return `harmony:${addr}`;
  };
}

const optimismSynths = {
  "0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9":
    "0x57ab1ec28d129707052df4df418d58a2d46d5f51",
  "0xc5db22719a06418028a40a9b5e9a7c02959d0d08":
    "0xbbc455cb4f1b9e4bfc4b73970d360c8f032efee6",
  "0xe405de8f52ba7559f9df3c368500b6e6ae6cee49":
    "0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb",
  "0x298b9b95708152ff6968aafd889c6586e9169f1d":
    "0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6",
};

async function transformOptimismAddress() {
  const bridge = (
    await utils.fetchURL("https://static.optimism.io/optimism.tokenlist.json")
  ).data.tokens;

  return (addr) => {
    if (compareAddresses(addr, "0x4200000000000000000000000000000000000006")) {
      return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    }
    if (compareAddresses(addr, "0x5029c236320b8f15ef0a657054b84d90bfbeded3")) {
      return "0x15ee120fd69bec86c1d38502299af7366a41d1a6";
    }
    // OETH -> WETH
    if (compareAddresses(addr, "0x0000000000000000000000000000000000000000")) {
      return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    }
    const possibleSynth = optimismSynths[addr.toLowerCase()];
    if (possibleSynth !== undefined) {
      return possibleSynth;
    }
    const dstToken = bridge.find(
      (token) => compareAddresses(addr, token.address) && token.chainId === 10
    );
    if (dstToken !== undefined) {
      const srcToken = bridge.find(
        (token) => dstToken.logoURI === token.logoURI && token.chainId === 1
      );
      if (srcToken !== undefined) {
        return srcToken.address;
      }
    }
    return addr; //`optimism:${addr}` // TODO: Fix
  };
}

async function transformMoonriverAddress() {
  return (addr) => {
    if (compareAddresses(addr, "0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c")) {
      return "avax:0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c";
    }
    if (compareAddresses(addr, "0x0000000000000000000000000000000000000000")) {
      return "moonriver:0x98878B06940aE243284CA214f92Bb71a2b032B8A";
    }
    return `moonriver:${addr}`; //`optimism:${addr}` // TODO: Fix
  };
}

async function transformMoonbeamAddress() {
  return (addr) => {
    if (compareAddresses(addr, "0x8f552a71EFE5eeFc207Bf75485b356A0b3f01eC9")) { //usdc
      return "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    }
    if (compareAddresses(addr, "0x8e70cD5B4Ff3f62659049e74b6649c6603A0E594")) { //usdt
      return "0xdac17f958d2ee523a2206206994597c13d831ec7";
    }
    if (compareAddresses(addr, "0x30D2a9F5FDf90ACe8c17952cbb4eE48a55D916A7")) { //eth
      return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    }
    if (compareAddresses(addr, "0x1DC78Acda13a8BC4408B207c9E48CDBc096D95e0")) { // wtbc
      return "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
    }
    if (compareAddresses(addr, "0xc234A67a4F840E61adE794be47de455361b52413")) { // dai
      return "0x6b175474e89094c44da98b954eedeac495271d0f";
    }
    if (compareAddresses(addr, "0x1d4C2a246311bB9f827F4C768e277FF5787B7D7E")) { //movr
       return "moonriver:0x98878b06940ae243284ca214f92bb71a2b032b8a";
    }
    // if (compareAddresses(addr, "0x0000000000000000000000000000000000000802")) { //GLMR
    //    return "moonbeam";
    // }
    return `moonbeam:${addr}`; //`optimism:${addr}` // TODO: Fix
  };
}

async function transformArbitrumAddress() {
  const bridge = (
    await utils.fetchURL("https://bridge.arbitrum.io/token-list-42161.json")
  ).data.tokens;

  return (addr) => {
    if (compareAddresses(addr, "0x0000000000000000000000000000000000000000")) {
      return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"; // WETH
    }
    if (compareAddresses(addr, "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A")) {
      return "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3"; // MIM
    }
    if (compareAddresses(addr, "0xDBf31dF14B66535aF65AaC99C32e9eA844e14501")) {
      return "0xeb4c2781e4eba804ce9a9803c67d0893436bb27d"; // renBTC
    }
    if (compareAddresses(addr, "0x9ef758ac000a354479e538b8b2f01b917b8e89e7")) {
      return "polygon:0x3dc7b06dd0b1f08ef9acbbd2564f8605b4868eea"; // XDO
    }
    const dstToken = bridge.find((token) =>
      compareAddresses(addr, token.address)
    );
    if (dstToken !== undefined) {
      return dstToken.extensions.bridgeInfo[1].tokenAddress;
    }
    return `arbitrum:${addr}`;
  };
}

function fixAvaxBalances(balances) {
  for (const representation of [
    "avax:0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    "0x9dEbca6eA3af87Bf422Cea9ac955618ceb56EfB4",
  ]) {
    if (balances[representation] !== undefined) {
      balances["avalanche-2"] = Number(balances[representation]) / 1e18;
      delete balances[representation];
    }
  }
}

function fixHarmonyBalances(balances) {
  for (const representation of [
    "harmony:0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
    "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
    "harmony:0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a",
    "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a",
    "bsc:0xdE976f3344cd9F06E451aF3A94a324afC3E154F4",
    "bsc:0xde976f3344cd9f06e451af3a94a324afc3e154f4",
  ]) {
    if (balances[representation] !== undefined) {
      balances["harmony"] = Number(balances[representation]) / 1e18;
      delete balances[representation];
    }
  }
}
function fixOasisBalances(balances) {
  if (Object.keys(balances).includes('oasis-network')) {
      balances['oasis-network'] = balances['oasis-network'] / 10 ** 18;
  }
}
async function transformIotexAddress() {
  return (addr) => {
    const dstToken = Object.keys(IOTEX_CG_MAPPING).find(token => compareAddresses(addr, token))
    if (dstToken !== undefined) {
      return IOTEX_CG_MAPPING[dstToken].contract || IOTEX_CG_MAPPING[dstToken].coingeckoId
    }
    return `iotex:${addr}`;
  };
}

async function transformKccAddress() {
  return (addr) => {
    if (compareAddresses(addr, "0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c")) {
      return "avax:0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c";
    }
    if (
      compareAddresses(
        addr.toLowerCase(),
        "0x0039f574ee5cc39bdd162e9a88e3eb1f111baf48"
      )
    ) {
      return "0xdac17f958d2ee523a2206206994597c13d831ec7";
    }
    if (compareAddresses(addr, "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")) {
      return "okexchain:0xc946daf81b08146b1c7a8da2a851ddf2b3eaaf85";
    }
    if (compareAddresses(addr, "0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c")) {
      return "bsc:0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
    }
    if (compareAddresses(addr, "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d")) {
      return "0x4fabb145d64652a948d72533023f6e7a623c7c53";
    }
    if (compareAddresses(addr, "0xc9baa8cfdde8e328787e29b4b078abf2dadc2055")) {
      return "0x6b175474e89094c44da98b954eedeac495271d0f";
    }
    if (compareAddresses(addr, "0x218c3c3d49d0e7b37aff0d8bb079de36ae61a4c0")) {
      return "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
    }
    if (compareAddresses(addr, "0xf55af137a98607f7ed2efefa4cd2dfe70e4253b1")) {
      return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    }
    if (compareAddresses(addr, "0x980a5afef3d17ad98635f6c5aebcbaeded3c3430")) {
      return "okexchain:0xc946daf81b08146b1c7a8da2a851ddf2b3eaaf85";
    }
    return `kcc:${addr}`;
  };
}


 function transformMetisAddress() {
  const map = {
    "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000": "0x9e32b13ce7f2e80a01932b42553652e053d6ed8e",
    "0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc": "0xdac17f958d2ee523a2206206994597c13d831ec7",
    "0x420000000000000000000000000000000000000a": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    "0x5801d0e1c7d977d78e4890880b8e579eb4943276": "bsc:0x5801d0e1c7d977d78e4890880b8e579eb4943276",
    "0xea32a96608495e54156ae48931a7c20f0dcc1a21": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "0x2692be44a6e38b698731fddf417d060f0d20a0cb": "bsc:0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
  }
  return (addr) => {
     if (compareAddresses(addr, "0xa5B55ab1dAF0F8e1EFc0eB1931a957fd89B918f4")) {
      return "avax:0x50b7545627a5162F82A992c33b87aDc75187B218";
    }
    if (compareAddresses(addr, "0xE253E0CeA0CDD43d9628567d097052B33F98D611")) {
      return "avax:0xE253E0CeA0CDD43d9628567d097052B33F98D611";
    }

    if (compareAddresses(addr, "0x4651B38e7ec14BB3db731369BFE5B08F2466Bd0A")) {
      return "bsc:0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3";
    }

    if (compareAddresses(addr, "0xfe282Af5f9eB59C30A3f78789EEfFA704188bdD4")) {
      return "metis:0xfe282Af5f9eB59C30A3f78789EEfFA704188bdD4";
    }

    if (compareAddresses(addr, "0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8")) {
      return "bsc:0xad29abb318791d579433d831ed122afeaf29dcfe";
    }

    if (compareAddresses(addr, "0x4b9D2923D875edF43980BF5dddDEde3Fb20fC742")) {
      return "bsc:0xcc42724c6683b7e57334c4e856f4c9965ed682bd";
    }

    return map[addr.toLowerCase()] || `metis:${addr}`
  };
}

function transformBobaAddress() {
  return (addr) => {
    if (compareAddresses(addr, "0x0000000000000000000000000000000000000000")) {
      return "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000"; // WETH
    }
    const map = {
      "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH
      "0x66a2a913e447d6b4bf33efbec43aaef87890fbbc": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
      "0x5de1677344d3cb0d7d465c10b72a8f60699c062d": "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
      "0xf74195bb8a5cf652411867c5c2c5b8c2a402be35": "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
      "0xdc0486f8bf31df57a952bcd3c1d3e166e3d9ec8b": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // WBTC
      "0xa18bf3994c0cc6e3b63ac420308e5383f53120d7": "0x42bbfa2e77757c645eeaad1655e0911a7553efbc", // BOBA
      "0xe1e2ec9a85c607092668789581251115bcbd20de": "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07", // OMG
    }
    return map[addr.toLowerCase()] || `boba:${addr}`
  }
}

function transformNearAddress() {
  return (addr) => {
    const bridgedAssetIdentifier = '.factory.bridge.near'
    if (addr.endsWith(bridgedAssetIdentifier))
      return `0x${addr.slice(0, addr.length - bridgedAssetIdentifier.length)}`

    return addr
  }
}

function transformVelasAddress() {
  return (addr) => {
    const map = {
      "0x85219708c49aa701871ad330a94ea0f41dff24ca": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH
      "0xe2c120f188ebd5389f71cf4d9c16d05b62a58993": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
      "0x01445c31581c354b7338ac35693ab2001b50b9ae": "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
      "0xc111c29a988ae0c0087d97b33c6e6766808a3bd3": "bsc:0xe9e7cea3dedca5984780bafc599bd69add087d56", // BUSD
      "0x300a8be53b4b5557f48620d578e7461e3b927dd0": "0xf56842af3b56fd72d17cb103f92d027bba912e89", // BAMBOO
    }
    return map[addr.toLowerCase()] || `velas:${addr}`
  }
}

const chainTransforms = {
  celo: transformCeloAddress,
  fantom: transformFantomAddress,
  bsc: transformBscAddress,
  polygon: transformPolygonAddress,
  xdai: transformXdaiAddress,
  avax: transformAvaxAddress,
  heco: transformHecoAddress,
  harmony: transformHarmonyAddress,
  optimism: transformOptimismAddress,
  moonriver: transformMoonriverAddress,
  okex: transformOkexAddress,
  kcc: transformKccAddress,
  arbitrum: transformArbitrumAddress,
  iotex: transformIotexAddress,
  metis:transformMetisAddress,
  near: transformNearAddress,
  moonbeam: transformMoonbeamAddress,
  velas: transformVelasAddress,
};

async function getChainTransform(chain) {
  if (chain === "ethereum") {
    return (id) => id;
  }
  if (chainTransforms[chain] !== undefined) {

    return chainTransforms[chain]();
  }
  return (addr) => `${chain}:${addr}`;
}

module.exports = {
  getChainTransform,
  transformCeloAddress,
  transformFantomAddress,
  transformBscAddress,
  transformPolygonAddress,
  transformXdaiAddress,
  transformAvaxAddress,
  transformHecoAddress,
  transformHarmonyAddress,
  transformOptimismAddress,
  transformMoonriverAddress,
  fixAvaxBalances,
  transformOkexAddress,
  transformKccAddress,
  transformArbitrumAddress,
  fixHarmonyBalances,
  fixOasisBalances,
  transformIotexAddress,
  transformMetisAddress,
  transformBobaAddress,
  transformNearAddress,
  transformMoonbeamAddress,
  transformVelasAddress,
};
