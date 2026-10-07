import { defineTool } from '@deepseek-ai/dsh-tools'
import { createHash } from 'node:crypto';

function run({text,algorithm}) { const a=algorithm.toLowerCase(); if(!['sha256','sha384','sha512'].includes(a)) throw new Error('Choose sha256, sha384, or sha512.'); return {algorithm:a,hex:createHash(a).update(text,'utf8').digest('hex')} }

const outputSchema = {algorithm:{type:'string'},hex:{type:'string'}}
export const name = 'dsh-ghostnever-text-hash'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_text_hash',
    description: 'Calculate SHA-256, SHA-384 or SHA-512 for supplied text.',
    parameters: {text:{type:'string',required:true,description:'Text up to 1 MB.'},algorithm:{type:'string',required:true,description:'sha256, sha384, or sha512.'}},
    output: {
      schema: { type: 'object', properties: outputSchema, required: Object.keys(outputSchema), additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (args.text.length > 1000000) throw new Error('Input exceeds 1 MB.');
      return run(args)
    }
  }))
}
