export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-[var(--color-brand-muted)] text-sm mb-10">Last updated: April 2026</p>
      <div className="space-y-8 text-sm text-[var(--color-brand-muted)] leading-relaxed">
        {[
          ['1. Data We Collect', 'We collect your email address and password (hashed) when you create an account. We also store your shipping address when you place an order, and your cart contents while you are logged in.'],
          ['2. How We Use It', 'Your data is used solely to operate the store — processing orders, maintaining your account, and syncing your cart. We do not sell, share, or transfer your data to third parties for marketing purposes.'],
          ['3. Storage', 'Data is stored securely in Supabase (PostgreSQL) with Row Level Security enabled. Your data is only accessible to you when authenticated. Passwords are never stored in plain text.'],
          ['4. Cookies', 'We use a single secure session cookie to keep you logged in. It is set with HttpOnly and SameSite=Strict flags. No third-party tracking cookies are used.'],
          ['5. Your Rights', 'You may request deletion of your account and all associated data at any time by contacting us at hello@vaultdrop.com. We will action requests within 30 days in compliance with GDPR.'],
          ['6. Contact', 'For any privacy questions, email hello@vaultdrop.com.'],
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
