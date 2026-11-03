import { useId, type CSSProperties, type ReactNode, type KeyboardEvent } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppRouter } from '@/lib/navigation'

export const C = { bg: '#FAF7F2', ink: '#292524', muted: '#78716C', red: '#C21F3A', pale: '#FBE9ED', line: '#EAE3DC', white: '#FFFFFF', blue: '#879498' }
type ContentProps = { children: ReactNode; style?: CSSProperties }
export function Txt({ children, style, muted }: ContentProps & { muted?: boolean }) {
  return <span className={muted ? 'text muted' : 'text'} style={style}>{children}</span>
}
export function Screen({ title, children, back = false, tabs = false, footer }: {
  title?: string; children: ReactNode; back?: boolean; tabs?: boolean; footer?: ReactNode
}) {
  const router = useAppRouter()
  return <div className="app-frame">
    {title && <header className="screen-header">
      {back && <button className="back-button" aria-label="이전 화면" onClick={router.back}>‹</button>}
      <h1>{title}</h1>
    </header>}
    <main className="screen-body">{children}</main>
    {footer && <div className="screen-footer">{footer}</div>}
    {tabs && <BottomTabs/>}
  </div>
}
export function Button({ title, onClick, secondary = false, disabled = false, style }: {
  title: string; onClick: () => void; secondary?: boolean; disabled?: boolean; style?: CSSProperties
}) {
  return <button type="button" className={`button ${secondary ? 'secondary' : ''}`} disabled={disabled} onClick={onClick} style={style}>{title}</button>
}
export function Field({ label, value, onValueChange, placeholder, keyboardType, multiline, secureTextEntry }: {
  label: string; value: string; onValueChange: (v: string) => void; placeholder?: string
  keyboardType?: 'phone-pad' | 'number-pad' | 'default'; multiline?: boolean; secureTextEntry?: boolean
}) {
  const id = useId()
  return <div className="field"><label htmlFor={id}>{label}</label>{multiline
    ? <textarea id={id} value={value} onChange={e => onValueChange(e.target.value)} placeholder={placeholder}/>
    : <input id={id} type={secureTextEntry ? 'password' : keyboardType === 'phone-pad' ? 'tel' : 'text'}
      inputMode={keyboardType === 'number-pad' ? 'numeric' : undefined} value={value}
      onChange={e => onValueChange(e.target.value)} placeholder={placeholder}/>}
  </div>
}
export function Card({ children, onClick, style }: ContentProps & { onClick?: () => void }) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onClick?.() }
  }
  return <div className={`card ${onClick ? 'clickable' : ''}`} style={style}
    role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}
    onClick={onClick} onKeyDown={onClick ? onKeyDown : undefined}>{children}</div>
}
export function Row({ children, style }: ContentProps) { return <div className="row" style={style}>{children}</div> }
export function Divider() { return <hr className="divider"/> }
export function Notice({ text, retry }: { text: string; retry?: () => void }) {
  return <Card><p className="muted" role="status">{text}</p>{retry && <Button title="다시 시도" secondary onClick={retry}/>}</Card>
}
export function Spinner() { return <div className="spinner" role="status" aria-label="불러오는 중"/> }
function BottomTabs() {
  return <nav className="bottom-tabs" aria-label="주요 메뉴">{[
    ['⌂','홈','/shop'],['▤','주문내역','/orders'],['▢','장바구니','/cart'],['♙','마이','/my'],
  ].map(([icon,label,path]) => <NavLink key={path} to={path} className="tab">
    <span aria-hidden="true" className="tab-icon">{icon}</span><span>{label}</span>
  </NavLink>)}</nav>
}
