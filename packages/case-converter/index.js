import { defineTool } from '@deepseek-ai/dsh-tools'

function run({text,style}) { const words=text.replace(/([a-z0-9])([A-Z])/g,'$1 $2').match(/[\p{L}\p{N}]+/gu)||[];const low=words.map(w=>w.toLowerCase());let result;switch(style){case'camel':result=low.map((w,i)=>i?w[0].toUpperCase()+w.slice(1):w).join('');break;case'pascal':result=low.map(w=>w[0].toUpperCase()+w.slice(1)).join('');break;case'snake':result=low.join('_');break;case'kebab':result=low.join('-');break;case'title':result=low.map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');break;default:throw new Error('style: camel, pascal, snake, kebab, title.')}return {result} }

const outputSchema = { type: 'object', additionalProperties: false, properties: {result:{type:'string'}} }
export const name = 'dsh-ghostnever-case-converter'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_case_convert',
    description: 'Convert text between camel, Pascal, snake, kebab and title case.',
    parameters: {text:{type:'string',required:true,description:'Text up to 20 KB.'},style:{type:'string',required:true,description:'camel, pascal, snake, kebab, or title.'}},
    output: {
      schema: outputSchema,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (args.text.length > 20000) throw new Error('Input exceeds 20 KB.');
      return run(args)
    }
  }))
}
