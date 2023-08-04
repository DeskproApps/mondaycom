import { useState } from "react";
import { H1, Stack } from "@deskpro/deskpro-ui";
import {
  Context,
  Property,
  proxyFetch,
  LoadingSpinner,
  HorizontalDivider,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";

/*
    Note: the following page component contains example code, please remove the contents of this component before you
    develop your app. For more information, please refer to our apps
    guides @see https://support.deskpro.com/en-US/guides/developers/anatomy-of-an-app
*/
export const Main = () => {
  const [ticketContext, setTicketContext] = useState<Context | null>(null);

  const [examplePosts, setExamplePosts] = useState<
    { id: string; title: string }[]
  >([]);

  // Add a "refresh" button @see https://support.deskpro.com/en-US/guides/developers/app-elements
  useInitialisedDeskproAppClient((client) => {
    client.registerElement("myRefreshButton", { type: "refresh_button" });
  });

  // Listen for the "change" event and store the context data
  // as local state @see https://support.deskpro.com/en-US/guides/developers/app-events
  useDeskproAppEvents({
    onChange: setTicketContext,
  });

  // Use the apps proxy to fetch data from a third party
  // API @see https://support.deskpro.com/en-US/guides/developers/app-proxy
  useInitialisedDeskproAppClient((client) =>
    (async () => {
      const fetch = await proxyFetch(client);

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );

      const posts = await response.json();

      setExamplePosts(posts.slice(0, 3));
    })()
  );

  // If we don't have a ticket context yet, show a loading spinner
  if (ticketContext === null) {
    return <LoadingSpinner />;
  }

  // Show some information about a given
  // ticket @see https://support.deskpro.com/en-US/guides/developers/targets and third party API
  return (
    <>
      <H1>Ticket Data</H1>
      <Stack gap={12} vertical>
        <Property label="Ticket ID" text={ticketContext.data.ticket.id} />
        <Property label="Ticket Subject" text={ticketContext.data.ticket.subject}/>
      </Stack>
      <HorizontalDivider width={2} />
      <H1>Example Posts</H1>
      {examplePosts.map((post) => (
        <div key={post.id}>
          <Property label="Post Title" text={post.title} />
          <HorizontalDivider width={2} />
        </div>
      ))}
    </>
  );
};
