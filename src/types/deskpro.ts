export type TicketData = {
  ticket: {
    id: string,
    subject: string,
    permalinkUrl: string,
  },
};

export type Settings = {
  client_id?: string,
  instance_url?: string
  use_deskpro_saas?: boolean,
  use_access_token?: boolean,

}