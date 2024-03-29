import React from 'react';

import { Button, LinkButton } from 'components/Button';
import { IProviderLoginUrl, Provider } from 'graphql/queries/providerLoginUrl';
import { IUser } from 'graphql/queries/user';
import Image from 'next/image';
import { FiLink, FiXCircle } from 'react-icons/fi';

export interface UserCardProps {
  user: IUser;
  unlinkedAccounts: Provider[];
  providerLoginUrls: IProviderLoginUrl[];
}

export const UserCard = ({
  user,
  unlinkedAccounts,
  providerLoginUrls,
}: UserCardProps): JSX.Element => {
  return (
    <div className="flex p-2 space-x-4 bg-gray-100 select-none md:rounded-lg">
      <div className="my-auto">
        <Image
	  alt="User Avatar"
          width="64"
          height="64"
          className="rounded-full bg-secondaryBg"
          src={user.thumb}
        />
      </div>
      <div className="flex flex-col">
        <h1 className="my-auto text-2xl">{user.username}</h1>
        <div className="flex my-auto space-x-2">
          {unlinkedAccounts.map((account, index) => (
            <LinkButton
              key={index}
              href={
                providerLoginUrls.find(
                  (providerLoginUrl) => providerLoginUrl.provider === account
                )?.url ?? ""
              }
              leftIcon={
                <Image
		  alt="Provider"
                  className="my-auto"
                  width="16"
                  height="16"
                  src={account === "ANILIST" ? "/anilist.svg" : "/kitsu.svg"}
                />
              }
              rightIcon={<FiLink />}
            >
              <p>Unlinked</p>
            </LinkButton>
          ))}
          {user.accounts.map((account) => (
            <Button
              key={account.id}
              rightIcon={<FiXCircle />}
              leftIcon={
                <Image
		  alt="Provider"
                  className="my-auto"
                  width="16"
                  height="16"
                  src={
                    account.provider === "ANILIST"
                      ? "/anilist.svg"
                      : "/kitsu.svg"
                  }
                />
              }
            >
              <p>{account.accountId}</p>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
