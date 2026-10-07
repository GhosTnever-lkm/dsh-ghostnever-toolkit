import { defineTool } from '@deepseek-ai/dsh-tools'
import { randomUUID } from 'node:crypto';

function run({count=1}) { const n=Number(count); if(!Number.isInteger(n)||n<1||n>20) throw new Error('count must be an integer from 1 to 20.'); return {uuids:Array.from({length:n},()=>randomUUID())} }

const outputSchema = {uuids:{type:'array',items:{type:'string'}}}
export const name = 'dsh-ghostnever-uuid-batch'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_uuid_batch',
    description: 'Generate up to 20 random UUID v4 identifiers.',
    parameters: {count:{type:'number',required:false,description:'Count from 1 to 20.'}},
    output: {
      schema: { type: 'object', properties: outputSchema, required: Object.keys(outputSchema), additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      
      return run(args)
    }
  }))
}
