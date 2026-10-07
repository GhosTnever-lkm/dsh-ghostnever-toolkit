import { defineTool } from '@deepseek-ai/dsh-tools'

function run({foreground,background}) { const lum=s=>{if(!/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(s))throw new Error('Use #RGB or #RRGGBB colors.');let h=s.slice(1);if(h.length===3)h=[...h].map(x=>x+x).join('');let c=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};const a=lum(foreground),b=lum(background),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);return {ratio:Number(ratio.toFixed(2)),aaNormal:ratio>=4.5,aaLarge:ratio>=3,aaaNormal:ratio>=7,aaaLarge:ratio>=4.5} }

const outputSchema = {ratio:{type:'number'},aaNormal:{type:'boolean'},aaLarge:{type:'boolean'},aaaNormal:{type:'boolean'},aaaLarge:{type:'boolean'}}
export const name = 'dsh-ghostnever-contrast-checker'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_contrast_check',
    description: 'Check WCAG contrast ratio between two hex colors.',
    parameters: {foreground:{type:'string',required:true,description:'Foreground hex color.'},background:{type:'string',required:true,description:'Background hex color.'}},
    output: {
      schema: { type: 'object', properties: outputSchema, required: Object.keys(outputSchema), additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      
      return run(args)
    }
  }))
}
