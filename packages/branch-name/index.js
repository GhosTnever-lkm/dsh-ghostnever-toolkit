import { defineTool } from '@deepseek-ai/dsh-tools'

function run({description,prefix='feature'}) {if(!/^(feature|fix|chore|docs|refactor|test)\/?$/.test(prefix))throw new Error('Unsupported prefix.');const slug=description.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60).replace(/-$/,'');if(!slug)throw new Error('Description needs Latin letters or digits.');return {branch:`${prefix.replace(/\/$/,'')}/${slug}`} }

const outputSchema = { type: 'object', additionalProperties: false, properties: {branch:{type:'string'}} }
export const name = 'dsh-ghostnever-branch-name'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_branch_name',
    description: 'Create a clean Git branch slug from a short description.',
    parameters: {description:{type:'string',required:true,description:'Change summary.'},prefix:{type:'string',required:false,description:'feature, fix, chore, docs, refactor, or test.'}},
    output: {
      schema: outputSchema,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (args.description.length > 300) throw new Error('Description too long.');
      return run(args)
    }
  }))
}
