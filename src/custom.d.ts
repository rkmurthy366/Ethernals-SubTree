declare module "*.svg" {
  const content: any;
  export default content;
}

interface Window {
  ethereum: any;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string;
    }
  }
}
