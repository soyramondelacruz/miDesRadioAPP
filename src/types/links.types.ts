export type LinkValue =
  | string
  | {
      url: string;
      message?: string;
    };

export type LinksPayload = Record<string, LinkValue>;