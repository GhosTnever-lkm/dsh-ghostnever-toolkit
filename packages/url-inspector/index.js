import { defineTool } from '@deepseek-ai/dsh-tools'

function run({url}) { const u=new URL(url); return {protocol:u.protocol,hostname:u.hostname,port:u.port,pathname:u.pathname,query:Object.fromEntries(u.searchParams.entries()),hash:u.hash,hasCredentials:!!(u.username||u.password)} }

const outputSchema = { type: 'object', additionalProperties: false, properties: {protocol:{type:'string'},hostname:{type:'string'},port:{type:'string'},pathname:{type:'string'},query:{type:'object',additionalProperties:{type:'string'}},hash:{type:'string'},hasCredentials:{type:'boolean'}} }
export const name = 'dsh-ghostnever-url-inspector'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_url_inspect',
    description: 'Parse a URL into scheme, host, path and query parameters.',
    parameters: {url:{type:'string',required:true,description:'Absolute URL string.'}},
    output: {
      schema: outputSchema,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (args.url.length > 4000) throw new Error('URL exceeds 4000 characters.');
      return run(args)
    }
  }))
}
