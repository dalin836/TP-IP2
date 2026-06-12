import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

/**
 * =========================
 * HTTP LINK (queries/mutations)
 * =========================
 */
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_HASURA_HTTP, // https://xxx.hasura.app/v1/graphql
  headers: {
    'x-hasura-admin-secret': import.meta.env.VITE_HASURA_ADMIN_SECRET,
  },
})

/**
 * =========================
 * WS LINK (subscriptions)
 * =========================
 */
const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_HASURA_WS, // wss://xxx.hasura.app/v1/graphql
    connectionParams: {
      'x-hasura-admin-secret': import.meta.env.VITE_HASURA_ADMIN_SECRET,
    },
  }),
)

/**
 * =========================
 * SPLIT LINK (auto choose HTTP or WS)
 * =========================
 */
const link = split(
  ({ query }) => {
    const def = getMainDefinition(query)
    return (
      def.kind === 'OperationDefinition' &&
      def.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

/**
 * =========================
 * APOLLO CLIENT
 * =========================
 */
export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})