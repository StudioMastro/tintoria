declare module "culori" {
  export function parse(color: string): any;
  export function oklch(color: any): any;
  export function rgb(color: any): any;
  export function formatHex(color: any): string;
}
