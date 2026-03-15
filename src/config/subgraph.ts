import { GraphQLClient } from "graphql-request";

const SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_SUBGRAPH_URL ??
  "https://api.goldsky.com/api/public/project_cmmnsegqt32hm01rz4364gwuq/subgraphs/paraflux/1.0.2/gn";

export const subgraphClient = new GraphQLClient(SUBGRAPH_URL);
