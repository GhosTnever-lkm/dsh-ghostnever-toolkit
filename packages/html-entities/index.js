import { defineTool } from '@deepseek-ai/dsh-tools'

function run({text,mode}) { if(mode==='escape') return {result:text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}; if(mode==='unescape') return {result:text.replace(/&(amp|lt|gt|quot|#39);/g,(_,x)=>({'amp':'&','lt':'<','gt':'>','quot':'"','#39':"'"}[x]))}; throw new Error('mode must be escape or unescape.'); }

const outputSchema = { type: 'object', additionalProperties: false, properties: {result:{type:'string'}} }
export const name = 'dsh-ghostnever-html-entities'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_html_entities',
    description: 'Escape or unescape HTML special characters.',
    parameters: {text:{type:'string',required:true,description:'Text up to 200 KB.'},mode:{type:'string',required:true,description:'escape or unescape'}},
    output: {
      schema: outputSchema,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (args.text.length > 200000) throw new Error('Input exceeds 200 KB.');
      return run(args)
    }
  }))
}
