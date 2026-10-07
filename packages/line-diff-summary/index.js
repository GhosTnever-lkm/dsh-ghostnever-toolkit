import { defineTool } from '@deepseek-ai/dsh-tools'

function run({before,after}) {const a=before.split(/\r?\n/),b=after.split(/\r?\n/);if(a.length>300||b.length>300)throw new Error('Each input is limited to 300 lines.');let dp=Array.from({length:a.length+1},()=>new Uint16Array(b.length+1));for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)dp[i][j]=a[i]===b[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);let i=0,j=0,added=0,removed=0;const changes=[];while(i<a.length||j<b.length){if(i<a.length&&j<b.length&&a[i]===b[j]){i++;j++}else if(j<b.length&&(i===a.length||dp[i][j+1]>=dp[i+1][j])){added++;changes.push({type:'add',line:b[j++]})}else{removed++;changes.push({type:'remove',line:a[i++]})}}return {added,removed,changes:changes.slice(0,100)} }

const outputSchema = {added:{type:'number'},removed:{type:'number'},changes:{type:'array',items:{type:'object',properties:{type:{type:'string'},line:{type:'string'}},required:['type','line']}}}
export const name = 'dsh-ghostnever-line-diff-summary'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_line_diff_summary',
    description: 'Summarize added and removed lines between two text versions.',
    parameters: {before:{type:'string',required:true,description:'Original text (up to 300 lines).'},after:{type:'string',required:true,description:'Updated text (up to 300 lines).'}},
    output: {
      schema: { type: 'object', properties: outputSchema, required: Object.keys(outputSchema), additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (args.before.length+args.after.length > 100000) throw new Error('Combined text exceeds 100 KB.');
      return run(args)
    }
  }))
}
