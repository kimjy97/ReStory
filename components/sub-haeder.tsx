import { ArrowLeft, LucideProps } from "lucide-react"
import Link from "next/link"
import { ForwardRefExoticComponent, RefAttributes } from "react"

interface IProps {
  title: string
  Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}

export function Header({ title, Icon }: IProps) {
  return (
    <header className="h-[56px] flex items-center bg-background border-b border-border select-none relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">홈으로</span>
            </Link>
            <div className="w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary" />
              <h1 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}