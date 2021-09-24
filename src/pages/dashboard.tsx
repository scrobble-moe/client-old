import React from 'react';

import { Card } from 'components/Card';
import { FaClipboard, FaClipboardCheck } from 'react-icons/fa';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Progress,
  Text,
  Tooltip,
  useClipboard,
} from '@chakra-ui/react';

export interface IUserResponse {
  users: [
    {
      id: string;
      email: string;
      role: "ADMIN" | "USER";
      username: string;
      thumb: string;
      accounts: [
        {
          id: string;
          accountId: string;
          provider: string;
        }
      ];
      scrobbles: [
        {
          id: string;
          providerMediaId: string;
          episode: number;
        }
      ];
      servers: [
        {
          id: string;
          uuid: string;
          name: string;
          secret: string;
        }
      ];
    }
  ];
}

export interface IProviderLoginUrlResponse {
  providerLoginUrl: [
    {
      provider: string;
      url: string;
    }
  ];
}

const Dashboard = (): JSX.Element => {
  const [clipboardServer, setClipboardServer] = React.useState<string>("");
  const { hasCopied, onCopy } = useClipboard(clipboardServer);

  const [linkableAccounts, setLinkableAccounts] = React.useState([
    "ANILIST",
    "KITSU",
  ]);
  const USER = gql`
    query UserQuery($Input: UserFindManyInput!) {
      users(userFindManyInput: $Input) {
        id
        email
        role
        username
        thumb
        accounts {
          id
          accountId
          provider
        }
        scrobbles {
          id
          providerMediaId
          episode
        }
        servers {
          id
          uuid
          name
          secret
        }
      }
    }
  `;

  const PROVIDER_LOGIN_URLS = gql`
    query ProviderLoginUrlQuery($Input: ProviderLoginUrlInput!) {
      providerLoginUrl(providerLoginUrlInput: $Input) {
        provider
        url
      }
    }
  `;

  const { ...usersData } = useQuery<IUserResponse>(USER, {
    variables: {
      Input: {
        take: 5,
      },
    },
  });

  const [getProviderLoginUrls, { ...providerLoginUrls }] =
    useLazyQuery<IProviderLoginUrlResponse>(PROVIDER_LOGIN_URLS, {
      variables: {
        Input: {
          providers: linkableAccounts,
        },
      },
    });

  React.useEffect(() => {
    if (usersData.data) {
      const filteredLinkableAccounts = linkableAccounts.filter(
        (linkableAccount) =>
          !usersData.data?.users[0].accounts
            .map((account) => account.provider)
            .includes(linkableAccount)
      );

      setLinkableAccounts(filteredLinkableAccounts);

      getProviderLoginUrls();
    }
  }, [usersData.data]);

  return (
    <>
      {usersData.loading && (
        <Box>
          <Text>Loading...</Text>
        </Box>
      )}
      {usersData.error && (
        <Box>
          <Text>Error</Text>
        </Box>
      )}
      {usersData.data && (
        <>
          <Card>
            <Flex direction="row">
              <Image
                h="4rem"
                w="4rem"
                mr="2rem"
                src={usersData.data.users[0].thumb}
                rounded="full"
              />
              <Heading as="h5" my="auto">
                {usersData.data.users[0].username}
              </Heading>
              <Box ml="auto" my="auto">
                {linkableAccounts.map((account, index) => (
                  <>
                    {providerLoginUrls.loading && (
                      <Button
                        key={index}
                        mx="1"
                        marginTop={2}
                        as="a"
                        target="_blank"
                        size="sm"
                      >
                        Loading
                      </Button>
                    )}

                    {providerLoginUrls.data && (
                      <Button
                        key={index}
                        mx="1"
                        marginTop={2}
                        as="a"
                        href={
                          providerLoginUrls.data.providerLoginUrl.find(
                            (providerLoginUrl) =>
                              providerLoginUrl.provider === account
                          )?.url
                        }
                        size="sm"
                      >
                        Link {account}
                      </Button>
                    )}
                  </>
                ))}
                {usersData.data.users[0].accounts.map((account) => (
                  <Tooltip
                    key={account.id}
                    mx="1"
                    hasArrow
                    aria-label={account.accountId}
                    label={account.accountId}
                    placement="auto"
                  >
                    <Button
                      marginTop={2}
                      as="a"
                      href={`https://anilist.co/user/${account.accountId}`}
                      target="_blank"
                      size="sm"
                    >
                      {account.provider}
                    </Button>
                  </Tooltip>
                ))}
              </Box>
            </Flex>
          </Card>
          <Card>
            <Flex justify="space-between" mb="2">
              <Heading as="h5" my="auto">
                Plex Servers:
              </Heading>
              <Button href="/addServer" my="auto" px="10" as="a" size="sm">
                Add server
              </Button>
            </Flex>
            {usersData.data.users[0].servers.map((server) => (
              <Card nested key={server.id}>
                <Flex justify="space-between">
                  <Text isTruncated>{server.name}</Text>
                  <Flex>
                    <Input
                      w="16rem"
                      value={`https://scrobble.moe/api/${server.secret}`}
                      isReadOnly
                      placeholder="Welcome"
                    />
                    <Button
                      onClick={(): void => {
                        setClipboardServer(
                          `https://scrobble.moe/api/${server.secret}`
                        );
                        onCopy();
                      }}
                      ml={2}
                    >
                      {hasCopied ? <FaClipboardCheck /> : <FaClipboard />}
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Card>
          <Card>
            {usersData.data.users[0].scrobbles.map((scrobble) => (
              <Card nested key={scrobble.id}>
                <Flex>
                  <Heading as="h5">{scrobble.providerMediaId}</Heading>
                  <Progress
                    w="full"
                    my="auto"
                    mx="4"
                    value={100 / scrobble.episode}
                  />
                  <Button
                    my="auto"
                    px="10"
                    as="a"
                    href={`https://anilist.co/anime/${scrobble.providerMediaId}`}
                    target="_blank"
                    size="sm"
                  >
                    View on AniList
                  </Button>
                </Flex>
              </Card>
            ))}
          </Card>
        </>
      )}
    </>
  );
};

export default Dashboard;
