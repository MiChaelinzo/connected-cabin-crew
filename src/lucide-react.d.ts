declare module 'lucide-react/dist/esm/icons/*' {
  import { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'
  
  interface LucideProps extends Partial<Omit<SVGProps<SVGSVGElement>, 'ref'>> {
    size?: string | number
    absoluteStrokeWidth?: boolean
  }
  
  type LucideIcon = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>
  
  const icon: LucideIcon
  export default icon
}
