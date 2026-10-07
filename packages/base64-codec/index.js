import { defineTool } from '@deepseek-ai/dsh-tools'

function run({text,mode}) { if(mode==='encode') return {result:Buffer.from(text,'utf8').toString('base64')}; if(mode==='decode') { if(!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(text)) throw new Error('Invalid Base64.'); return {result:Buffer.from(text,'base64').toString('utf8')} } throw new Error('mode must be encode or decode.'); }

const outputSchema = {result:{type:'string'}}
export const name = 'dsh-ghostnever-base64-codec'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_base64_codec',
    description: 'Encode UTF-8 text to Base64 or decode Base64 to UTF-8.',
    parameters: {text:{type:'string',required:true,description:'Input up to 100 KB.'},mode:{type:'string',required:true,description:'encode or decode'}},
    output: {
      schema: { type: 'object', properties: outputSchema, required: Object.keys(outputSchema), additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (args.text.length > 100000) throw new Error('Input exceeds 100 KB.');
      return run(args)
    }
  }))
}
