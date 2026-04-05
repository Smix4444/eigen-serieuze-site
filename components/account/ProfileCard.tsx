interface Props { email: string; username: string | null }

export default function ProfileCard({ email, username }: Props) {
  const initial = (username ?? email)[0]?.toUpperCase() ?? '?'
  return (
    <div className="bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] p-6 flex items-center gap-4">
      <div className="w-14 h-14 bg-[var(--color-brand-border)] flex items-center justify-center text-2xl font-black uppercase">
        {initial}
      </div>
      <div>
        <p className="font-bold uppercase tracking-wide">{username ?? 'Member'}</p>
        <p className="text-[var(--color-brand-muted)] text-sm">{email}</p>
      </div>
    </div>
  )
}
