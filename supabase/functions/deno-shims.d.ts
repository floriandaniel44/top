// Local TypeScript shims for Deno Edge Functions and remote imports
// Purpose: silence editor/TS errors locally. These do NOT change runtime behavior.

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Declare remote modules imported via URL so TypeScript doesn't complain in the editor
declare module "https://deno.land/std@0.190.0/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "https://esm.sh/resend@4.0.0" {
  export class Resend {
    constructor(apiKey?: string | undefined);
    emails: { send: (opts: any) => Promise<any> };
  }
  export default Resend;
}

declare module "https://esm.sh/@supabase/supabase-js@2.38.4" {
  export function createClient(url: string, key: string): any;
}
