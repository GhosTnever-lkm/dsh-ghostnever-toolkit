import { defineTool } from '@deepseek-ai/dsh-tools'

function run({value}) { const n=Number(value); const d=Number.isFinite(n)&&value.trim()!==''?new Date(Math.abs(n)<1e11?n*1000:n):new Date(value); if(!Number.isFinite(d.getTime())) throw new Error('Invalid date or timestamp.'); return {iso:d.toISOString(),unixSeconds:Math.floor(d.getTime()/1000),unixMilliseconds:d.getTime()} }

const outputSchema = {iso:{type:'string'},unixSeconds:{type:'number'},unixMilliseconds:{type:'number'}}
export const name = 'dsh-ghostnever-timestamp-converter'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_timestamp_convert',
    description: 'Convert Unix seconds or milliseconds to ISO date and back.',
    parameters: {value:{type:'string',required:true,description:'ISO date or Unix timestamp.'}},
    output: {
      schema: { type: 'object', properties: outputSchema, required: Object.keys(outputSchema), additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      
      return run(args)
    }
  }))
}
