export type DataType = 
  | "firstName"
  | "lastName"
  | "fullName"
  | "email"
  | "phone"
  | "address"
  | "city"
  | "country"
  | "zipCode"
  | "company"
  | "jobTitle"
  | "uuid"
  | "number"
  | "decimal"
  | "boolean"
  | "date"
  | "datetime"
  | "paragraph"
  | "sentence"
  | "word"
  | "url"
  | "image"
  | "color"
  | "username"
  | "password"

export interface FieldConfig {
  id: string
  name: string
  type: DataType
  options?: {
    min?: number
    max?: number
    decimals?: number
    format?: string
  }
}

export interface SchemaConfig {
  name: string
  fields: FieldConfig[]
  rowCount: number
}

export type ExportFormat = "json" | "csv" | "sql"

export const DATA_TYPE_INFO: Record<DataType, { label: string; category: string; icon: string }> = {
  firstName: { label: "First Name", category: "Person", icon: "User" },
  lastName: { label: "Last Name", category: "Person", icon: "User" },
  fullName: { label: "Full Name", category: "Person", icon: "User" },
  email: { label: "Email", category: "Person", icon: "Mail" },
  phone: { label: "Phone", category: "Person", icon: "Phone" },
  address: { label: "Address", category: "Location", icon: "MapPin" },
  city: { label: "City", category: "Location", icon: "Building" },
  country: { label: "Country", category: "Location", icon: "Globe" },
  zipCode: { label: "Zip Code", category: "Location", icon: "Hash" },
  company: { label: "Company", category: "Business", icon: "Building2" },
  jobTitle: { label: "Job Title", category: "Business", icon: "Briefcase" },
  uuid: { label: "UUID", category: "Identifier", icon: "Key" },
  number: { label: "Integer", category: "Number", icon: "Hash" },
  decimal: { label: "Decimal", category: "Number", icon: "Percent" },
  boolean: { label: "Boolean", category: "Basic", icon: "ToggleLeft" },
  date: { label: "Date", category: "DateTime", icon: "Calendar" },
  datetime: { label: "DateTime", category: "DateTime", icon: "Clock" },
  paragraph: { label: "Paragraph", category: "Text", icon: "AlignLeft" },
  sentence: { label: "Sentence", category: "Text", icon: "Type" },
  word: { label: "Word", category: "Text", icon: "Type" },
  url: { label: "URL", category: "Web", icon: "Link" },
  image: { label: "Image URL", category: "Web", icon: "Image" },
  color: { label: "Color", category: "Other", icon: "Palette" },
  username: { label: "Username", category: "Person", icon: "AtSign" },
  password: { label: "Password", category: "Security", icon: "Lock" },
}

// Simple data generators
const firstNames = ["James", "Emma", "Oliver", "Sophia", "William", "Ava", "Benjamin", "Isabella", "Lucas", "Mia", "Henry", "Charlotte", "Alexander", "Amelia", "Sebastian", "Harper", "Jack", "Evelyn", "Daniel", "Luna"]
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"]
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "Seattle", "Denver", "Boston", "Portland", "Miami"]
const countries = ["United States", "Canada", "United Kingdom", "Germany", "France", "Australia", "Japan", "Brazil", "India", "Mexico", "Spain", "Italy", "Netherlands", "Sweden", "Norway", "Denmark", "Finland", "Ireland", "New Zealand", "Singapore"]
const companies = ["Tech Solutions Inc", "Global Innovations", "Digital Dynamics", "Cloud Systems", "Data Analytics Co", "Smart Technologies", "Future Labs", "Quantum Computing", "AI Research Group", "Cyber Security Ltd", "Web Services Inc", "Mobile Apps Co", "Software Solutions", "Network Systems", "IT Consulting Group"]
const jobTitles = ["Software Engineer", "Product Manager", "Data Analyst", "UX Designer", "DevOps Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Project Manager", "Business Analyst", "QA Engineer", "Technical Lead", "Solutions Architect", "Data Scientist", "Cloud Engineer"]
const domains = ["gmail.com", "yahoo.com", "outlook.com", "company.com", "example.org", "mail.com", "proton.me", "icloud.com"]
const streets = ["Main St", "Oak Ave", "Maple Dr", "Cedar Ln", "Pine Rd", "Elm St", "Washington Ave", "Park Blvd", "Lake Dr", "River Rd", "Hill St", "Valley Dr", "Forest Ave", "Mountain Rd", "Ocean Blvd"]
const loremWords = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat"]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function generateValue(type: DataType, options?: FieldConfig['options']): string | number | boolean {
  switch (type) {
    case "firstName":
      return randomItem(firstNames)
    case "lastName":
      return randomItem(lastNames)
    case "fullName":
      return `${randomItem(firstNames)} ${randomItem(lastNames)}`
    case "email": {
      const first = randomItem(firstNames).toLowerCase()
      const last = randomItem(lastNames).toLowerCase()
      return `${first}.${last}@${randomItem(domains)}`
    }
    case "phone":
      return `+1 (${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`
    case "address":
      return `${randomInt(100, 9999)} ${randomItem(streets)}`
    case "city":
      return randomItem(cities)
    case "country":
      return randomItem(countries)
    case "zipCode":
      return String(randomInt(10000, 99999))
    case "company":
      return randomItem(companies)
    case "jobTitle":
      return randomItem(jobTitles)
    case "uuid":
      return generateUUID()
    case "number": {
      const min = options?.min ?? 1
      const max = options?.max ?? 1000
      return randomInt(min, max)
    }
    case "decimal": {
      const min = options?.min ?? 0
      const max = options?.max ?? 1000
      const decimals = options?.decimals ?? 2
      const value = Math.random() * (max - min) + min
      return Number(value.toFixed(decimals))
    }
    case "boolean":
      return Math.random() > 0.5
    case "date": {
      const start = new Date(2020, 0, 1)
      const end = new Date()
      const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
      return date.toISOString().split('T')[0]
    }
    case "datetime": {
      const start = new Date(2020, 0, 1)
      const end = new Date()
      const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
      return date.toISOString()
    }
    case "paragraph": {
      const sentences = randomInt(3, 6)
      return Array.from({ length: sentences }, () => {
        const words = randomInt(8, 15)
        const sentence = Array.from({ length: words }, () => randomItem(loremWords)).join(' ')
        return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
      }).join(' ')
    }
    case "sentence": {
      const words = randomInt(8, 15)
      const sentence = Array.from({ length: words }, () => randomItem(loremWords)).join(' ')
      return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
    }
    case "word":
      return randomItem(loremWords)
    case "url":
      return `https://www.${randomItem(loremWords)}.com/${randomItem(loremWords)}`
    case "image":
      return `https://picsum.photos/seed/${randomInt(1, 1000)}/400/300`
    case "color":
      return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
    case "username": {
      const first = randomItem(firstNames).toLowerCase()
      return `${first}${randomInt(1, 999)}`
    }
    case "password":
      return Array.from({ length: 12 }, () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
        return chars.charAt(Math.floor(Math.random() * chars.length))
      }).join('')
    default:
      return ""
  }
}

export function generateData(schema: SchemaConfig): Record<string, unknown>[] {
  return Array.from({ length: schema.rowCount }, () => {
    const row: Record<string, unknown> = {}
    schema.fields.forEach((field) => {
      row[field.name] = generateValue(field.type, field.options)
    })
    return row
  })
}

export function exportToJSON(data: Record<string, unknown>[]): string {
  return JSON.stringify(data, null, 2)
}

export function exportToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return ""
  const headers = Object.keys(data[0])
  const rows = data.map(row => 
    headers.map(h => {
      const val = row[h]
      if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
        return `"${val.replace(/"/g, '""')}"`
      }
      return String(val)
    }).join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

export function exportToSQL(data: Record<string, unknown>[], tableName: string): string {
  if (data.length === 0) return ""
  const headers = Object.keys(data[0])
  const createTable = `CREATE TABLE ${tableName} (\n${headers.map(h => `  ${h} TEXT`).join(',\n')}\n);\n\n`
  const inserts = data.map(row => {
    const values = headers.map(h => {
      const val = row[h]
      if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`
      if (typeof val === 'boolean') return val ? '1' : '0'
      return String(val)
    }).join(', ')
    return `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values});`
  }).join('\n')
  return createTable + inserts
}
