import type { ButtonHTMLAttributes, ReactNode } from 'react'

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export function AppButton({ children, className = '', type = 'button', ...props }: AppButtonProps) {
  const classes = ['app-button', className].filter(Boolean).join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
