import { defineTool } from '@deepseek-ai/dsh-tools'

function run({csv}) { const rows=[]; let row=[],cell='',q=false; for(let i=0;i<csv.length;i++){let c=csv[i]; if(q&&c==='"'&&csv[i+1]==='"'){cell+='"';i++}else if(c==='"'){q=!q}else if(c===','&&!q){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&csv[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell=''}else cell+=c} if(cell||row.length){row.push(cell);rows.push(row)} const headers=rows.shift()||[];return {columns:headers.length,rows:rows.length,headers:headers.slice(0,100),emptyCells:rows.reduce((n,r)=>n+headers.filter((_,i)=>!(r[i]||'').trim()).length,0),sample:rows.slice(0,5).map(r=>Object.fromEntries(headers.slice(0,100).map((h,i)=>[h,r[i]??''])))} }

const outputSchema = {columns:{type:'number'},rows:{type:'number'},headers:{type:'array',items:{type:'string'}},emptyCells:{type:'number'},sample:{type:'array',items:{type:'object',additionalProperties:{type:'string'}}}}
export const name = 'dsh-ghostnever-csv-profiler'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_csv_profile',
    description: 'Inspect a CSV sample: dimensions, headers and empty cells.',
    parameters: {csv:{type:'string',required:true,description:'CSV text up to 200 KB.'}},
    output: {
      schema: { type: 'object', properties: outputSchema, required: Object.keys(outputSchema), additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (args.csv.length > 200000) throw new Error('Input exceeds 200 KB.');
      return run(args)
    }
  }))
}
