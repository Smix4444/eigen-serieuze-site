# Cloudflare Configuration Guide

## 1. DNS Setup

In Cloudflare DNS, add these records pointing your domain to Vercel:

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | @ | 76.76.21.21 | ✅ Proxied (orange cloud) |
| CNAME | www | cname.vercel-dns.com | ✅ Proxied |

> Check current Vercel IP in their docs — `76.76.21.21` is the current default.

## 2. SSL/TLS

Cloudflare → SSL/TLS → Overview → Set mode to **Full (strict)**.

## 3. WAF Custom Rules

Cloudflare → Security → WAF → Custom Rules. Add:

**Rule 1 — Block bad bots on API:**
- Expression: `(http.request.uri.path matches "^/api/") and not (http.user_agent contains "Mozilla")`
- Action: Block

**Rule 2 — Block anonymizer proxies:**
- Expression: `(cf.client.bot) or (ip.src in $cf.anonymizer_proxies)`
- Action: Block

**Rule 3 — Challenge high-risk geos on checkout:**
- Expression: `(ip.geoip.country in {"CN" "RU" "KP"}) and (http.request.uri.path matches "^/api/checkout")`
- Action: Managed Challenge

## 4. Rate Limiting

Cloudflare → Security → WAF → Rate Limiting Rules:

- Name: `Global API rate limit`
- Expression: `http.request.uri.path matches "^/api/"`
- Threshold: 100 requests / 10 seconds per IP
- Action: Block for 60 seconds

## 5. DDoS

Auto-enabled on all Cloudflare plans (L3/L4). For L7 HTTP DDoS:
- Security → DDoS → HTTP DDoS attack protection → Sensitivity: **High**

## 6. Security Headers (Transform Rules)

Cloudflare → Rules → Transform Rules → Modify Response Header → Add:

| Header | Value |
|--------|-------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | `default-src 'self' https:; img-src 'self' https://images.unsplash.com data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'` |

## 7. Vercel Integration

In Vercel project settings → Domains, add your custom domain. Vercel will verify via the Cloudflare DNS records above.

Enable **Vercel Edge Network** for static assets — Cloudflare CDN + Vercel Edge = double caching.
