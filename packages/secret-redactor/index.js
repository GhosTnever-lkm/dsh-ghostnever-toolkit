import { defineTool } from '@deepseek-ai/dsh-tools'

function run({text}) {
  let replacements = 0
  const redact = (pattern, replacement = '[REDACTED]') => {
    text = text.replace(pattern, (...args) => {
      replacements += 1
      return typeof replacement === 'function' ? replacement(...args) : replacement
    })
  }

  // Preserve JSON/YAML/env assignment syntax while masking its value.
  const credentialName = '(?:aws[_-]?(?:access[_-]?key[_-]?id|secret[_-]?access[_-]?key)|password|passwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|private[_-]?key|token)'
  redact(new RegExp(`(["']?${credentialName}["']?\\s*[:=]\\s*)(["'])(.*?)\\2`, 'gi'),
    (_match, prefix, quote, _value) => `${prefix}${quote}[REDACTED]${quote}`)
  redact(new RegExp(`(["']?${credentialName}["']?\\s*[:=]\\s*)(?!["'])([^\\s,;}\\]]+)`, 'gi'),
    (_match, prefix) => `${prefix}[REDACTED]`)

  redact(/https?:\/\/(?:discord(?:app)?\.com)\/api\/webhooks\/\d+\/[A-Za-z0-9._-]+/gi)
  redact(/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g)
  redact(/\bsk-[A-Za-z0-9_-]{16,}\b/g)
  redact(/\bgh[pousr]_[A-Za-z0-9]{20,}\b/g)
  redact(/\bgithub_pat_[A-Za-z0-9_]{20,}\b/g)
  redact(/\bAKIA[0-9A-Z]{16}\b/g)
  redact(/\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi, 'Bearer [REDACTED]')
  return { redactedText: text, replacements }
}

const outputSchema = { type: 'object', additionalProperties: false, properties: {redactedText:{type:'string'},replacements:{type:'number'}} }
export const name = 'dsh-ghostnever-secret-redactor'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_secret_redact',
    description: 'Mask common API token patterns in supplied text.',
    parameters: {text:{type:'string',required:true,description:'Text up to 100 KB. Processed locally by this tool.'}},
    output: {
      schema: outputSchema,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (args.text.length > 100000) throw new Error('Input exceeds 100 KB.');
      return run(args)
    }
  }))
}
