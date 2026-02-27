export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ColorScheme {
  id: string;
  scope: 'standard' | 'custom';
  ownerProjectId: string | null;
  name: string;
  spec: ColorSchemeSpec;
}

export interface ColorSchemeSpec {
  colors: FiberColor[];
}

export interface FiberColor {
  index: number;
  name: string;
  hex: string;
}

export interface AuthTokens {
  accessToken: string;
}
