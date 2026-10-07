import { defineTool } from '@deepseek-ai/dsh-tools'

function run({bytes}) { const n=Number(bytes);if(!Number.isFinite(n)||n<0)throw new Error('bytes must be a non-negative number.');const fmt=(base,units)=>{if(!n)return `0 ${units[0]}`;const i=Math.min(Math.floor(Math.log(n)/Math.log(base)),units.length-1);return `${(n/base**i).toFixed(i?2:0)} ${units[i]}`};return {bytes:n,binary:fmt(1024,['B','KiB','MiB','GiB','TiB']),decimal:fmt(1000,['B','kB','MB','GB','TB'])} }

const outputSchema = {bytes:{type:'number'},binary:{type:'string'},decimal:{type:'string'}}
export const name = 'dsh-ghostnever-byte-size'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_byte_size',
    description: 'Convert bytes into readable binary and decimal size units.',
    parameters: {bytes:{type:'number',required:true,description:'Non-negative bytes.'}},
    output: {
      schema: { type: 'object', properties: outputSchema, required: Object.keys(outputSchema), additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      
      return run(args)
    }
  }))
}
