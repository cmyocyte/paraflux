import { gql } from "graphql-request";

// ─── Trader Leaderboard ─────────────────────────────────────────────
export interface SubgraphTrader {
  id: string;
  totalVolume: string;
  totalPnl: string;
  tradeCount: string;
  liquidationCount: string;
}

export const TRADER_LEADERBOARD_QUERY = gql`
  query TraderLeaderboard($first: Int!, $orderBy: String!, $orderDirection: String!) {
    traders(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      totalVolume
      totalPnl
      tradeCount
      liquidationCount
    }
  }
`;

// ─── LP Leaderboard ─────────────────────────────────────────────────
export interface SubgraphLP {
  id: string;
  totalDeposited: string;
  totalWithdrawn: string;
  currentShares: string;
  depositCount: string;
  withdrawCount: string;
}

export const LP_LEADERBOARD_QUERY = gql`
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
`;

// ─── Protocol Stats (volume, fees, etc.) ────────────────────────────
export interface SubgraphProtocol {
  id: string;
  totalVolume: string;
  totalFees: string;
  totalProtocolFees: string;
  totalInsuranceFees: string;
  totalBadDebt?: string;
  totalPositions: string;
  activePositions: string;
  totalLiquidations: string;
  cumulativeFunding?: string;
  totalDeposits: string;
  totalWithdrawals: string;
}

export const PROTOCOL_STATS_QUERY = gql`
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
`;

// ─── Analytics Dashboard (single query for entire analytics page) ────
export interface SubgraphLiquidation {
  trader: string;
  liquidator: string;
  isLong: boolean;
  size: string;
  collateral: string;
  reward: string;
  badDebt: string;
  insuranceCovered: string;
  timestamp: string;
  txHash: string;
}

export interface SubgraphFundingSnapshot {
  fundingRate: string;
  cumulativeFunding: string;
  timestamp: string;
}

export interface AnalyticsDashboardResult {
  protocols: SubgraphProtocol[];
  liquidations: SubgraphLiquidation[];
  fundingSnapshots: SubgraphFundingSnapshot[];
}

export const ANALYTICS_DASHBOARD_QUERY = gql`
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
`;

// ─── Daily Metrics ──────────────────────────────────────────────────
export interface SubgraphDailyMetrics {
  id: string;
  date: string;
  volume: string;
  fees: string;
}

export const DAILY_METRICS_QUERY = gql`
  query DailyMetrics($first: Int!, $orderBy: String!, $orderDirection: String!) {
    dailyMetrics_collection(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      date
      volume
      fees
    }
  }
`;
