(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,59544,e=>{"use strict";var t=e.i(43476),r=e.i(7670);let s={primary:"bg-[#22c55e] hover:bg-[#16a34a] text-[#0b0e11] font-semibold disabled:bg-[#22c55e]/30 disabled:text-[#0b0e11]/50",secondary:"bg-[#161b22] hover:bg-[#21262d] text-[#22c55e] border border-[#21262d] hover:border-[#22c55e]/30 disabled:opacity-40",danger:"bg-red-600 hover:bg-red-500 text-white font-bold disabled:bg-red-900 disabled:text-red-400",ghost:"bg-transparent hover:bg-[#161b22] text-zinc-400 hover:text-[#22c55e] disabled:text-zinc-700"},a={sm:"px-3 py-1.5 text-xs",md:"px-4 py-2 text-xs",lg:"px-6 py-3 text-sm"};function i({variant:e="primary",size:i="md",loading:o=!1,className:l,children:n,disabled:d,...c}){return(0,t.jsxs)("button",{className:(0,r.clsx)("inline-flex items-center justify-center gap-2 rounded font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/40 focus:ring-offset-1 focus:ring-offset-[#0b0e11]",s[e],a[i],l),disabled:d||o,...c,children:[o&&(0,t.jsxs)("svg",{className:"h-4 w-4 animate-spin",viewBox:"0 0 24 24",fill:"none",children:[(0,t.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),(0,t.jsx)("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"})]}),n]})}e.s(["Button",()=>i])},40285,e=>{"use strict";e.i(11643);var t=e.i(85056);let r=t.gql`
  query TraderLeaderboard($first: Int!, $orderBy: String!, $orderDirection: String!) {
    traders(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      totalVolume
      totalPnl
      tradeCount
      liquidationCount
    }
  }
`,s=t.gql`
  query LPLeaderboard($first: Int!, $orderBy: String!, $orderDirection: String!) {
    liquidityProviders(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      totalDeposited
      totalWithdrawn
      currentShares
      depositCount
      withdrawCount
    }
  }
`,a=t.gql`
  query ProtocolStats {
    protocols(first: 1) {
      id
      totalVolume
      totalFees
      totalProtocolFees
      totalInsuranceFees
      totalPositions
      activePositions
      totalLiquidations
      totalDeposits
      totalWithdrawals
    }
  }
`,i=t.gql`
  query AnalyticsDashboard {
    protocols(first: 1) {
      id
      totalVolume
      totalFees
      totalProtocolFees
      totalInsuranceFees
      totalBadDebt
      totalPositions
      activePositions
      totalLiquidations
      totalDeposits
      totalWithdrawals
      cumulativeFunding
    }
    liquidations(first: 50, orderBy: timestamp, orderDirection: desc) {
      trader
      liquidator
      isLong
      size
      collateral
      reward
      badDebt
      insuranceCovered
      timestamp
      txHash
    }
    fundingSnapshots(first: 60, orderBy: timestamp, orderDirection: desc) {
      fundingRate
      cumulativeFunding
      timestamp
    }
  }
`;t.gql`
  query DailyMetrics($first: Int!, $orderBy: String!, $orderDirection: String!) {
    dailyMetrics_collection(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      date
      volume
      fees
    }
  }
`,e.s(["ANALYTICS_DASHBOARD_QUERY",0,i,"LP_LEADERBOARD_QUERY",0,s,"PROTOCOL_STATS_QUERY",0,a,"TRADER_LEADERBOARD_QUERY",0,r])},13979,e=>{"use strict";var t=e.i(43476),r=e.i(71645),s=e.i(7670);e.i(47167);var a=e.i(510),i=e.i(11786),o=e.i(65821),l=e.i(40285),n=e.i(29975),d=e.i(75379),c=e.i(59544);function x(){let[e,a]=(0,r.useState)(""),[i,n]=(0,r.useState)(1),{data:x,isLoading:p,isError:u}=function(){let[e,t]=(0,r.useState)([]),[s,a]=(0,r.useState)(!0),[i,n]=(0,r.useState)(!1),d=(0,r.useCallback)(async()=>{try{let e=await o.subgraphClient.request(l.TRADER_LEADERBOARD_QUERY,{first:100,orderBy:"totalVolume",orderDirection:"desc"});if(!e.traders.length){t([]),a(!1);return}let r=e.traders.map(e=>{let t=parseFloat(e.totalPnl),r=parseFloat(e.totalVolume);return{address:e.id,accountValue:0,pnl:t,roi:r>0?t/r:0,volume:r}});r.sort((e,t)=>t.pnl-e.pnl),t(r)}catch(e){n(!0)}finally{a(!1)}},[]);return(0,r.useEffect)(()=>{d();let e=setInterval(d,12e4);return()=>clearInterval(e)},[d]),{data:e,isLoading:s,isError:i}}();(0,r.useEffect)(()=>{n(1)},[e]);let h=x.filter(t=>t.address.toLowerCase().includes(e.toLowerCase())),m=Math.max(1,Math.ceil(h.length/10)),f=h.slice((i-1)*10,10*i);return(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-3",children:[(0,t.jsx)("span",{className:"text-[10px] font-bold uppercase tracking-wider text-zinc-500",children:"All Time"}),(0,t.jsx)("input",{type:"text",placeholder:"Search wallet...",value:e,onChange:e=>a(e.target.value),className:"w-52 rounded border border-[#21262d] bg-[#0b0e11] px-2.5 py-1.5 font-mono text-xs text-[#e1e4e8] placeholder-zinc-600 transition-colors focus:border-[#22c55e]/50 focus:outline-none focus:ring-1 focus:ring-[#22c55e]/30"})]}),(0,t.jsx)("div",{className:"mt-3 overflow-x-auto",children:(0,t.jsxs)("table",{className:"w-full text-xs",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{className:"border-b border-[#21262d]",children:[(0,t.jsx)("th",{className:"px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500",children:"Rank"}),(0,t.jsx)("th",{className:"px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500",children:"Trader"}),(0,t.jsx)("th",{className:"px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500",children:"Account Value"}),(0,t.jsx)("th",{className:"px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500",children:"PNL"}),(0,t.jsx)("th",{className:"px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500",children:"ROI"}),(0,t.jsx)("th",{className:"px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500",children:"Volume"})]})}),(0,t.jsx)("tbody",{children:p?(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:6,className:"px-3 py-8 text-center text-xs text-zinc-500",children:(0,t.jsxs)("div",{className:"flex items-center justify-center gap-2",children:[(0,t.jsx)("div",{className:"h-3 w-3 animate-spin rounded-full border-2 border-zinc-600 border-t-[#22c55e]"}),"Scanning on-chain activity..."]})})}):u?(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:6,className:"px-3 py-8 text-center text-xs text-red-400",children:"Failed to load leaderboard data. Try again later."})}):f.length>0?f.map((e,r)=>(0,t.jsxs)("tr",{className:"border-b border-[#21262d]/50 last:border-b-0 transition-colors hover:bg-[#161b22]/50",children:[(0,t.jsx)("td",{className:"px-3 py-2.5 font-mono text-zinc-500",children:(i-1)*10+r+1}),(0,t.jsx)("td",{className:"px-3 py-2.5 font-mono text-[#e1e4e8]",children:(0,d.shortenAddress)(e.address)}),(0,t.jsx)("td",{className:"px-3 py-2.5 text-right font-mono text-[#e1e4e8]",children:(0,d.formatCompact)(e.accountValue)}),(0,t.jsxs)("td",{className:(0,s.clsx)("px-3 py-2.5 text-right font-mono",e.pnl>=0?"text-[#22c55e]":"text-red-400"),children:[e.pnl>=0?"+":"",(0,d.formatUsd)(e.pnl)]}),(0,t.jsxs)("td",{className:(0,s.clsx)("px-3 py-2.5 text-right font-mono",e.roi>=0?"text-[#22c55e]":"text-red-400"),children:[e.roi>=0?"+":"",(0,d.formatPercent)(e.roi)]}),(0,t.jsx)("td",{className:"px-3 py-2.5 text-right font-mono text-[#e1e4e8]",children:(0,d.formatCompact)(e.volume)})]},e.address)):(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:6,className:"px-3 py-6 text-center text-xs text-zinc-600",children:"No traders found"})})})]})}),!p&&(0,t.jsxs)("div",{className:"mt-3 flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-xs text-zinc-500",children:h.length>0?`${(i-1)*10+1}-${Math.min(10*i,h.length)} of ${h.length}`:"0 results"}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(c.Button,{variant:"ghost",size:"sm",disabled:i<=1,onClick:()=>n(e=>e-1),children:"Prev"}),(0,t.jsx)(c.Button,{variant:"ghost",size:"sm",disabled:i>=m,onClick:()=>n(e=>e+1),children:"Next"})]})]})]})}function p(){let[e,s]=(0,r.useState)(""),[x,p]=(0,r.useState)(1),{data:u,isLoading:h,isError:m}=function(){let e=(0,a.usePublicClient)(),[t,s]=(0,r.useState)([]),[d,c]=(0,r.useState)(!0),[x,p]=(0,r.useState)(!1),u=(0,r.useCallback)(async()=>{try{let t=await o.subgraphClient.request(l.LP_LEADERBOARD_QUERY,{first:100,orderBy:"totalDeposited",orderDirection:"desc"});if(!t.liquidityProviders.length){s([]),c(!1);return}let r=1,a=0;if(e)try{let[t,s]=await Promise.all([e.readContract({address:i.CONTRACTS.lpVault,abi:n.lpVaultAbi,functionName:"totalAssets"}),e.readContract({address:i.CONTRACTS.lpVault,abi:n.lpVaultAbi,functionName:"totalSupply"})]);r=(a=Number(s))>0?Number(t)/a:1}catch{}let d=[];for(let e of t.liquidityProviders){let t=parseFloat(e.currentShares);if(t<=0)continue;let s=1e6*t,i=t*r,o=a>0?s/a:0;d.push({address:e.id,shares:t,valueUsdc:i,poolShare:o,depositTime:0})}d.sort((e,t)=>t.poolShare-e.poolShare),s(d)}catch(e){p(!0)}finally{c(!1)}},[e]);return(0,r.useEffect)(()=>{u();let e=setInterval(u,12e4);return()=>clearInterval(e)},[u]),{data:t,isLoading:d,isError:x}}();(0,r.useEffect)(()=>{p(1)},[e]);let f=u.filter(t=>t.address.toLowerCase().includes(e.toLowerCase())),b=Math.max(1,Math.ceil(f.length/10)),g=f.slice((x-1)*10,10*x);return(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"flex items-center justify-end",children:(0,t.jsx)("input",{type:"text",placeholder:"Search wallet...",value:e,onChange:e=>s(e.target.value),className:"w-52 rounded border border-[#21262d] bg-[#0b0e11] px-2.5 py-1.5 font-mono text-xs text-[#e1e4e8] placeholder-zinc-600 transition-colors focus:border-[#22c55e]/50 focus:outline-none focus:ring-1 focus:ring-[#22c55e]/30"})}),(0,t.jsx)("div",{className:"mt-3 overflow-x-auto",children:(0,t.jsxs)("table",{className:"w-full text-xs",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{className:"border-b border-[#21262d]",children:[(0,t.jsx)("th",{className:"px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500",children:"Rank"}),(0,t.jsx)("th",{className:"px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500",children:"Provider"}),(0,t.jsx)("th",{className:"px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500",children:"Shares"}),(0,t.jsx)("th",{className:"px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500",children:"Value (USDC)"}),(0,t.jsx)("th",{className:"px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500",children:"Pool Share"}),(0,t.jsx)("th",{className:"px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500",children:"Deposited"})]})}),(0,t.jsx)("tbody",{children:h?(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:6,className:"px-3 py-8 text-center text-xs text-zinc-500",children:(0,t.jsxs)("div",{className:"flex items-center justify-center gap-2",children:[(0,t.jsx)("div",{className:"h-3 w-3 animate-spin rounded-full border-2 border-zinc-600 border-t-[#22c55e]"}),"Scanning on-chain deposits..."]})})}):m?(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:6,className:"px-3 py-8 text-center text-xs text-red-400",children:"Failed to load LP data. Try again later."})}):g.length>0?g.map((e,r)=>(0,t.jsxs)("tr",{className:"border-b border-[#21262d]/50 last:border-b-0 transition-colors hover:bg-[#161b22]/50",children:[(0,t.jsx)("td",{className:"px-3 py-2.5 font-mono text-zinc-500",children:(x-1)*10+r+1}),(0,t.jsx)("td",{className:"px-3 py-2.5 font-mono text-[#e1e4e8]",children:(0,d.shortenAddress)(e.address)}),(0,t.jsx)("td",{className:"px-3 py-2.5 text-right font-mono text-[#e1e4e8]",children:e.shares.toLocaleString(void 0,{maximumFractionDigits:0})}),(0,t.jsx)("td",{className:"px-3 py-2.5 text-right font-mono text-[#e1e4e8]",children:(0,d.formatUsd)(e.valueUsdc)}),(0,t.jsx)("td",{className:"px-3 py-2.5 text-right font-mono text-[#e1e4e8]",children:(0,d.formatPercent)(e.poolShare)}),(0,t.jsx)("td",{className:"px-3 py-2.5 text-right font-mono text-zinc-400",children:function(e){if(0===e)return"---";let t=Math.floor(Date.now()/1e3)-e;if(t<0)return"just now";if(t<3600)return`${Math.floor(t/60)}m ago`;if(t<86400)return`${Math.floor(t/3600)}h ago`;let r=Math.floor(t/86400);return`${r}d ago`}(e.depositTime)})]},e.address)):(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:6,className:"px-3 py-6 text-center text-xs text-zinc-600",children:"No providers found"})})})]})}),!h&&(0,t.jsxs)("div",{className:"mt-3 flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-xs text-zinc-500",children:f.length>0?`${(x-1)*10+1}-${Math.min(10*x,f.length)} of ${f.length}`:"0 results"}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(c.Button,{variant:"ghost",size:"sm",disabled:x<=1,onClick:()=>p(e=>e-1),children:"Prev"}),(0,t.jsx)(c.Button,{variant:"ghost",size:"sm",disabled:x>=b,onClick:()=>p(e=>e+1),children:"Next"})]})]})]})}let u=[{key:"traders",label:"Traders"},{key:"lp",label:"LP Providers"}];function h(){let[e,a]=(0,r.useState)("traders");return(0,t.jsxs)("div",{className:"mx-auto max-w-7xl px-4 py-8",children:[(0,t.jsx)("h1",{className:"text-2xl font-bold text-white",children:"Leaderboard"}),(0,t.jsx)("p",{className:"mt-1 text-xs text-zinc-500",children:"Top performers across trading and liquidity provision."}),(0,t.jsxs)("div",{className:"mt-6 rounded border border-[#21262d] bg-[#0f1216]",children:[(0,t.jsx)("div",{className:"flex gap-0.5 border-b border-[#21262d] px-2 pt-1",children:u.map(r=>(0,t.jsx)("button",{onClick:()=>a(r.key),className:(0,s.clsx)("rounded-t px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors",e===r.key?"bg-[#22c55e]/10 text-[#22c55e]":"text-zinc-600 hover:text-zinc-400"),children:r.label},r.key))}),(0,t.jsxs)("div",{className:"p-4",children:["traders"===e&&(0,t.jsx)(x,{}),"lp"===e&&(0,t.jsx)(p,{})]})]})]})}e.s(["default",()=>h],13979)}]);