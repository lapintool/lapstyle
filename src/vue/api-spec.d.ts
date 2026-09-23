export type ApiProp = {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  desc: string;
};

export type ApiEvent = {
  name: string;
  payload?: string;
  desc: string;
};

export type ApiSlot = {
  name: string;
  desc: string;
};

export type VueComponentSpec = {
  name: string;
  tag: string;
  page: string;
  summary: string;
  cssRoot: string;
  minimal: string;
  props: ApiProp[];
  events: ApiEvent[];
  slots: ApiSlot[];
  patterns?: string[];
};

export type PageApi = {
  tag: string;
  component: string;
  summary: string;
  minimal: string;
  props: ApiProp[];
  events: ApiEvent[];
  slots: ApiSlot[];
  cssRoot: string;
  patterns: string[];
};

export const vueComponents: Record<string, VueComponentSpec>;
export const pages: Record<
  string,
  {
    id: string;
    title: string;
    components: string[];
    summary?: string;
    minimal?: string;
  }
>;
export const COMPONENT_ORDER: string[];
export function apiFor(id: string): PageApi | undefined;
export const componentApis: Record<string, PageApi | undefined>;
