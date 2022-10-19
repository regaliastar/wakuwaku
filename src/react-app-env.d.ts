declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare namespace NodeJS {
  export interface ProcessEnv {
    PRODUCT: string;
    BUILD_VERSION: string;
  }
}
