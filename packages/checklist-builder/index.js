import { defineTool } from '@deepseek-ai/dsh-tools'

function run({items,checked=[]}) {if(!Array.isArray(items)||items.length>100)throw new Error('Provide up to 100 items.');const done=new Set(checked);return {markdown:items.map((x,i)=>`- [${done.has(i)?'x':' '}] ${String(x).replace(/[\r\n]+/g,' ').slice(0,300)}`).join('\n'),items:items.length,checked:done.size} }

const outputSchema = {markdown:{type:'string'},items:{type:'number'},checked:{type:'number'}}
export const name = 'dsh-ghostnever-checklist-builder'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_checklist_build',
    description: 'Turn a list of tasks into a Markdown checklist.',
    parameters: {items:{type:'array',required:true,items:{type:'string'},description:'Up to 100 checklist items.'},checked:{type:'array',required:false,items:{type:'number'},description:'Optional zero-based indices to mark complete.'}},
    output: {
      schema: { type: 'object', properties: outputSchema, required: Object.keys(outputSchema), additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      
      return run(args)
    }
  }))
}
