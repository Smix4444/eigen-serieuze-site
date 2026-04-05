export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Terms of Use</h1>
      <p className="text-[var(--color-brand-muted)] text-sm mb-10">Last updated: April 2026</p>
      <div className="space-y-8 text-sm text-[var(--color-brand-muted)] leading-relaxed">
        {[
          ['1. Demo Store', 'VAULT is a demonstration e-commerce platform. No real payments are processed and no physical goods are shipped. All transactions are mock.'],
          ['2. Accounts', 'You are responsible for maintaining the security of your account credentials. Do not share your password. We reserve the right to suspend accounts that violate these terms.'],
          ['3. Intellectual Property', 'All content on this site — including design, text, and graphics — is the property of VAULT. You may not reproduce or redistribute any content without express written permission.'],
          ['4. Limitation of Liability', 'VAULT is provided "as is" without warranties of any kind. We are not liable for any damages arising from use of this platform.'],
          ['5. Governing Law', 'These terms are governed by the laws of England and Wales.'],
          ['6. Contact', 'Legal queries: hello@vaultdrop.com'],
        ].map(([title, body]) => (
          <div key={title}>
            <h2 className="text-white font-bold uppercase tracking-wide text-base mb-2">{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
