export type LinkValue =
  | string
  | {
      url: string;
      message?: string;
    };

export type LinksMap = Record<string, LinkValue>;

export type LinkAction = {
  key: string;      // apunta a una clave dentro de links{}
  label: string;    // texto del botón
  enabled?: boolean;
  order?: number;   // menor = primero
  isWhatsApp?: boolean;
  section?: "primary" | "quick" | "social";
};

export type LinksPayloadV2 = {
  links: LinksMap;
  actions?: LinkAction[];
};

// Backward compatible: puede venir como mapa directo (v1) o como v2
export type LinksPayload = LinksMap | LinksPayloadV2;