import { Template } from "./nginx/Template";

declare global {
    namespace NodeJS {
      interface Global {
          Template: typeof Template | undefined;
      }
    }
  }