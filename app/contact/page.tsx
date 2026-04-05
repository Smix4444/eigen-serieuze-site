import ContactForm from '@/components/contact/ContactForm'

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Contact</h1>
      <p className="text-[var(--color-brand-muted)] text-sm mb-10">
        Questions, collabs, or just want to talk fit — hit us up.
      </p>
      <ContactForm />
      <div className="mt-12 pt-8 border-t border-[var(--color-brand-border)] text-sm text-[var(--color-brand-muted)] space-y-2">
        <p>✉ hello@vaultdrop.com</p>
        <p>Instagram: @vaultdrop</p>
        <p>TikTok: @vaultdrop</p>
      </div>
    </div>
  )
}
