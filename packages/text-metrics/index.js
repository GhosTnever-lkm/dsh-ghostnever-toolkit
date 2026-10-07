import { defineTool } from '@deepseek-ai/dsh-tools'

function run({text}) { const words=text.trim()?text.trim().split(/\s+/u).length:0; return {characters:text.length,charactersNoSpaces:[...text].filter(c=>! /\s/u.test(c)).length,words,lines:text?text.split(/\r\n|\r|\n/).length:0,paragraphs:text.trim()?text.trim().split(/\n\s*\n/u).length:0,estimatedTokens:Math.ceil([...text].length/4)} }

const outputSchema = {characters:{type:'number'},charactersNoSpaces:{type:'number'},words:{type:'number'},lines:{type:'number'},paragraphs:{type:'number'},estimatedTokens:{type:'number'}}
export const name = 'dsh-ghostnever-text-metrics'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_text_metrics',
    description: 'Count characters, words, lines and estimate tokens.',
    parameters: {text:{type:'string',required:true,description:'Text up to 500 KB.'}},
    output: {
      schema: { type: 'object', properties: outputSchema, required: Object.keys(outputSchema), additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (args.text.length > 500000) throw new Error('Input exceeds 500 KB.');
      return run(args)
    }
  }))
}
