import { StackClientApp } from '@stackframe/react';

// Check if required environment variables are set
const projectId = import.meta.env.VITE_STACK_PROJECT_ID;
const publishableClientKey = import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY;

// Provide helpful error message if credentials are not configured
if (!projectId || projectId === 'your-project-id-here') {
  console.error(`
🔧 Stack Auth Configuration Required

The Stack Auth project ID is not configured. To fix this:

1. Your Stack Auth project ID is: 9bb2febd-dd1c-40bb-ab17-89c37ee698a6
2. It should already be set in .env.local
3. Generate and set your publishable client key from the Stack Auth console
4. Visit your Stack Auth project to generate API keys

Current project ID: ${projectId || 'undefined'}
`);
}

if (!publishableClientKey || publishableClientKey === 'your-publishable-client-key-here') {
  console.error(`
🔧 Stack Auth Configuration Required

The Stack Auth publishable client key is not configured. To fix this:

1. Go to your Stack Auth project console
2. Click "Generate keys" to create your publishable client key
3. Update VITE_STACK_PUBLISHABLE_CLIENT_KEY in .env.local
4. Save your keys immediately - you can only view them once

Project ID: 9bb2febd-dd1c-40bb-ab17-89c37ee698a6
Current key: ${publishableClientKey || 'undefined'}
`);
}

export const stackClientApp = new StackClientApp({
  projectId: projectId || 'your-project-id-here',
  publishableClientKey: publishableClientKey || 'your-publishable-client-key-here',
  tokenStore: 'cookie',
});