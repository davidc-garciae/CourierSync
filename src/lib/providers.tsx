"use client";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./apollo-client";

export function ApolloProviderWrapper({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
