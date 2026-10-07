import { defineTool } from '@deepseek-ai/dsh-tools'

function run({text}) {let count=0;const patterns=[/\bsk-[A-Za-z0-9_-]{16,}\b/g,/\bgh[pousr]_[A-Za-z0-9]{20,}\b/g,/\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,/\bAKIA[0-9A-Z]{16}\b/g,/\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi,/\b(password|passwd|secret|api[_-]?key)\s*[:=]\s*['"]?[^\s,'";]+/gi];let result=text;for(const p of patterns)result=result.replace(p,m=>{count++;const k=m.indexOf(':')>=0?m.slice(0,m.indexOf(':')+1):m.match(/^Bearer/i)?'Bearer ':'';return k+'[REDACTED]'});return {redactedText:result,replacements:count} }

const outputSchema = {redactedText:{type:'string'},replacements:{type:'number'}}
export const name = 'dsh-ghostnever-secret-redactor'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_secret_redact',
    description: 'Mask common API token patterns in supplied text.',
    parameters: {text:{type:'string',required:true,description:'Text up to 100 KB. Processed locally by this tool.'}},
    output: {
      schema: { type: 'object', properties: outputSchema, required: Object.keys(outputSchema), additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (args.text.length > 100000) throw new Error('Input exceeds 100 KB.');
      return run(args)
    }
  }))
}
