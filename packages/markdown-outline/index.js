import { defineTool } from '@deepseek-ai/dsh-tools'

function run({markdown}) { const headings=[]; for(const m of markdown.slice(0,200000).matchAll(/^(#{1,6})\s+(.+?)\s*#*\s*$/gm)) headings.push({level:m[1].length,title:m[2],slug:m[2].toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu,'').replace(/\s+/g,'-')}); return {headings, toc:headings.map(h=>`${'  '.repeat(h.level-1)}- [${h.title}](#${h.slug})`).join('\n')} }

const outputSchema = { type: 'object', additionalProperties: false, properties: {headings:{type:'array',items:{type:'object',properties:{level:{type:'number'},title:{type:'string'},slug:{type:'string'}},required:['level','title','slug']}},toc:{type:'string'}} }
export const name = 'dsh-ghostnever-markdown-outline'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_markdown_outline',
    description: 'Build a heading outline and table of contents from Markdown.',
    parameters: {markdown:{type:'string',required:true,description:'Markdown input, up to 200 KB.'}},
    output: {
      schema: outputSchema,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (args.markdown.length > 200000) throw new Error('Input exceeds 200 KB.');
      return run(args)
    }
  }))
}
