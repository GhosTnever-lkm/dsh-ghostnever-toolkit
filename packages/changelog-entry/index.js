import { defineTool } from '@deepseek-ai/dsh-tools'

function run({version,date,added=[],changed=[],fixed=[],removed=[]}) {const groups=[['Added',added],['Changed',changed],['Fixed',fixed],['Removed',removed]].filter(([,a])=>a.length);if(groups.some(([,a])=>!Array.isArray(a)||a.length>30))throw new Error('Each section must be an array of up to 30 items.');return {markdown:`## [${version}] - ${date||new Date().toISOString().slice(0,10)}\n\n${groups.map(([h,a])=>`### ${h}\n${a.map(x=>`- ${String(x).slice(0,500)}`).join('\n')}`).join('\n\n')}`} }

const outputSchema = {markdown:{type:'string'}}
export const name = 'dsh-ghostnever-changelog-entry'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_changelog_entry',
    description: 'Format release notes using Keep a Changelog sections.',
    parameters: {version:{type:'string',required:true,description:'Version or release label.'},date:{type:'string',required:false,description:'ISO date (optional).'},added:{type:'array',required:false,items:{type:'string'},description:'Added items.'},changed:{type:'array',required:false,items:{type:'string'},description:'Changed items.'},fixed:{type:'array',required:false,items:{type:'string'},description:'Fixed items.'},removed:{type:'array',required:false,items:{type:'string'},description:'Removed items.'}},
    output: {
      schema: { type: 'object', properties: outputSchema, required: Object.keys(outputSchema), additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (!/^[\\w.+-]{1,40}$/.test(version)) throw new Error('Invalid version label.');
      return run(args)
    }
  }))
}
