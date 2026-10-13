import { defineTool } from '@deepseek-ai/dsh-tools'

function parseCsv(csv) {
  const rows = []
  let row = []
  let cell = ''
  let state = 'start'

  const endRow = () => {
    row.push(cell)
    rows.push(row)
    row = []
    cell = ''
    state = 'start'
  }

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i]
    const newline = char === '\n' || char === '\r'

    if (state === 'quoted') {
      if (char === '"' && csv[i + 1] === '"') {
        cell += '"'
        i++
      } else if (char === '"') {
        state = 'after-quote'
      } else {
        cell += char
      }
      continue
    }

    if (state === 'after-quote') {
      if (char === ',') {
        row.push(cell)
        cell = ''
        state = 'start'
      } else if (newline) {
        if (char === '\r' && csv[i + 1] === '\n') i++
        endRow()
      } else {
        throw new Error('Invalid CSV: unexpected text after a closing quote.')
      }
      continue
    }

    if (char === ',') {
      row.push(cell)
      cell = ''
      state = 'start'
    } else if (newline) {
      if (char === '\r' && csv[i + 1] === '\n') i++
      endRow()
    } else if (char === '"') {
      if (state !== 'start') throw new Error('Invalid CSV: quote inside an unquoted field.')
      state = 'quoted'
    } else {
      cell += char
      state = 'unquoted'
    }
  }

  if (state === 'quoted') throw new Error('Invalid CSV: quoted field is not closed.')
  if (state !== 'start' || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows
}

function run({csv}) {
  const rows = parseCsv(csv)
  const headers = rows.shift() || []
  return {
    columns: headers.length,
    rows: rows.length,
    headers: headers.slice(0, 100),
    emptyCells: rows.reduce((n, r) => n + headers.filter((_, i) => !(r[i] || '').trim()).length, 0),
    sample: rows.slice(0, 5).map((r) => Object.fromEntries(headers.slice(0, 100).map((h, i) => [h, r[i] ?? '']))),
  }
}

const outputSchema = { type: 'object', additionalProperties: false, properties: {columns:{type:'number'},rows:{type:'number'},headers:{type:'array',items:{type:'string'}},emptyCells:{type:'number'},sample:{type:'array',items:{type:'object',additionalProperties:true}}} }
export const name = 'dsh-ghostnever-csv-profiler'
export const inject = ['tools']

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dsh_ghostnever_csv_profile',
    description: 'Inspect a CSV sample: dimensions, headers and empty cells.',
    parameters: {csv:{type:'string',required:true,description:'CSV text up to 200 KB.'}},
    output: {
      schema: outputSchema,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }]
    },
    async execute(args) {
      if (args.csv.length > 200000) throw new Error('Input exceeds 200 KB.');
      return run(args)
    }
  }))
}
