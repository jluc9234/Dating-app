import { StackServerApp, StackClientApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie", 
  urls: {
    signIn: "/sign-in",
    afterSignIn: "/",
    afterSignUp: "/",
    signUp: "/sign-up",
  },
});

export const stackClientApp = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID!,
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY!,
  urls: {
    signIn: "/sign-in",
    afterSignIn: "/",
    afterSignUp: "/",
    signUp: "/sign-up",
  },
});