import { defineTool } from '@deepseek-ai/dsh-tools'

function run({version,part}) {const m=version.match(/^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/);if(!m)throw new Error('Expected semantic version x.y.z.');let [a,b,c]=m.slice(1).map(Number);if(part==='major'){a++;b=0;c=0}else if(part==='minor'){b++;c=0}else if(part==='patch')c++;else throw new Error('part must be major, minor, or patch.');return {version:`${a}.${b}.${c}`} }

const outputSchema = { type: 'object', additionalProperties: false, properties: {version:{type:'string'}} }
export const name = 'dsh-ghostnever-semver-bump'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_semver_bump',
    description: 'Increment major, minor or patch in a strict semantic version.',
    parameters: {version:{type:'string',required:true,description:'Strict x.y.z semantic version.'},part:{type:'string',required:true,description:'major, minor, or patch.'}},
    output: {
      schema: outputSchema,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      
      return run(args)
    }
  }))
}
