import { defineTool } from '@deepseek-ai/dsh-tools'

function run({input}) { const v=JSON.parse(input); return {valid:true, rootType:Array.isArray(v)?'array':v===null?'null':typeof v, keys:v&&typeof v==='object'&&!Array.isArray(v)?Object.keys(v).slice(0,100):[], length:Array.isArray(v)?v.length:typeof v==='string'?v.length:undefined, formatted:JSON.stringify(v,null,2).slice(0,20000)} }

const outputSchema = {valid:{type:'boolean'},rootType:{type:'string'},keys:{type:'array',items:{type:'string'}},length:{type:'number'},formatted:{type:'string'}}
export const name = 'dsh-ghostnever-json-inspector'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_json_inspect',
    description: 'Parse, validate and summarize JSON safely.',
    parameters: {input:{type:'string',required:true,description:'JSON text (up to 100 KB).'}},
    output: {
      schema: { type: 'object', properties: outputSchema, required: Object.keys(outputSchema), additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (args.input.length > 100000) throw new Error('Input exceeds 100 KB.');
      return run(args)
    }
  }))
}
