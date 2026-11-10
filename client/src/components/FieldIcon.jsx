import {
  Code2,
  Server,
  Cpu,
  Terminal,
  ShieldCheck,
  PenTool,
  BarChart3,
  Smartphone,
  Cloud,
  Blocks,
  Compass,
} from 'lucide-react'

const ICON_MAP = {
  frontend: Code2,
  backend: Server,
  ml: Cpu,
  devops: Terminal,
  cyber: ShieldCheck,
  uxdesign: PenTool,
  datascience: BarChart3,
  mobile: Smartphone,
  cloud: Cloud,
  blockchain: Blocks,
}

export default function FieldIcon({ fieldId, className = 'h-5 w-5', strokeWidth = 1.5 }) {
  const IconComponent = ICON_MAP[fieldId] || Compass
  return <IconComponent className={className} strokeWidth={strokeWidth} />
}

