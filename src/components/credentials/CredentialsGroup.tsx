import React from "react";

import { CardLoading } from "components/Card";
import { IconButton } from "components/IconButton";
import { TabLayout } from "components/TabLayout";
import {
  AUTHENTICATORS,
  IAuthenticatorsResponse,
  IAuthenticatorsVariables,
} from "graphql/queries/authenticators";
import Link from "next/link";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { useQuery } from "urql";

import { Button } from "../Button";
import { CredentialCard } from "./CredentialCard";

export const CredentialsGroup = (): JSX.Element => {
  const [authenticators, refetchAuthenticators] = useQuery<
    IAuthenticatorsResponse,
    IAuthenticatorsVariables
  >({
    query: AUTHENTICATORS,
    variables: {
      Input: {},
    },
  });

  return (
    <TabLayout
      actions={
        <>
          <Link passHref href="/addCredential">
            <Button nested rightIcon={<FiPlus />}>
              Add Credential
            </Button>
          </Link>
          <IconButton
            onClick={(): void => {
              refetchAuthenticators({
                requestPolicy: "network-only",
              });
            }}
            icon={
              <FiRefreshCw
                className={authenticators.fetching ? "animate-spin" : ""}
              />
            }
          />
        </>
      }
    >
      <div className="flex flex-col h-full">
        {authenticators.fetching && <CardLoading />}
        {authenticators.data && !authenticators.fetching && (
          <div className="space-y-2">
            {authenticators.data.authenticators.map((credential) => (
              <CredentialCard key={credential.id} authenticator={credential} />
            ))}
          </div>
        )}
      </div>
    </TabLayout>
  );
};