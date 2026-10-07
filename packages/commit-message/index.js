import { defineTool } from '@deepseek-ai/dsh-tools'

function run({type,summary,scope,breaking=false}) {const allowed=['feat','fix','docs','style','refactor','perf','test','build','ci','chore','revert'];if(!allowed.includes(type))throw new Error('Unsupported Conventional Commit type.');const s=summary.trim().replace(/[\r\n]+/g,' ');if(!s||s.length>72)throw new Error('Summary must be 1 to 72 characters.');const sc=scope?`(${scope.replace(/[^a-zA-Z0-9._-]/g,'').slice(0,30)})`:'';return {message:`${type}${sc}${breaking?'!':''}: ${s}` } }

const outputSchema = {message:{type:'string'}}
export const name = 'dsh-ghostnever-commit-message'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_commit_message',
    description: 'Format a Conventional Commit subject from type and summary.',
    parameters: {type:{type:'string',required:true,description:'feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.'},summary:{type:'string',required:true,description:'Subject summary, max 72 characters.'},scope:{type:'string',required:false,description:'Optional scope.'},breaking:{type:'boolean',required:false,description:'Set true for breaking change.'}},
    output: {
      schema: { type: 'object', properties: outputSchema, required: Object.keys(outputSchema), additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      
      return run(args)
    }
  }))
}
