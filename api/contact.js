import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  /* ── CORS preflight ── */
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  /* ── Validation ── */
  const { name, email, projectType, message } = req.body ?? {}

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Champs requis manquants (name, email, message)' })
  }

  /* ── Vérification env vars ── */
  if (!process.env.RESEND_API_KEY) {
    console.error('[Contact] RESEND_API_KEY manquante')
    return res.status(500).json({ error: 'Configuration serveur incorrecte' })
  }

  try {
    const result = await resend.emails.send({
      /* Resend impose un domaine vérifié en from.
         Si ton domaine n'est pas vérifié, garde onboarding@resend.dev
         pour les tests, puis passe à noreply@tondomaine.com en prod.   */
      from: process.env.FROM_EMAIL ?? 'onboarding@resend.dev',
      to:   process.env.ADMIN_EMAIL ?? 'wthomasss06@gmail.com',
      reply_to: email,
      subject: `🚀 Nouveau contact Portfolio — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;
                    background:#0d0d0d;border-radius:12px;
                    border:1px solid rgba(255,85,0,0.2);">
          <h2 style="color:#FF5500;margin-bottom:24px;">
            📬 Nouveau message via le portfolio
          </h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;font-weight:700;color:#aaa;width:140px;">Nom</td>
              <td style="padding:8px 0;color:#f2ede8;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:700;color:#aaa;">Email</td>
              <td style="padding:8px 0;color:#f2ede8;">
                <a href="mailto:${email}" style="color:#FF5500;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:700;color:#aaa;">Type projet</td>
              <td style="padding:8px 0;color:#f2ede8;">${projectType || '—'}</td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid rgba(255,85,0,0.2);margin:20px 0;" />
          <p style="font-weight:700;color:#aaa;margin-bottom:8px;">Message :</p>
          <p style="color:#f2ede8;line-height:1.7;
                    background:rgba(255,85,0,0.06);padding:16px;
                    border-radius:8px;border-left:4px solid #FF5500;">
            ${message.replace(/\n/g, '<br/>')}
          </p>
          <p style="margin-top:24px;font-size:12px;color:#555;">
            Envoyé depuis elvis-portfolio · ${new Date().toLocaleString('fr-FR')}
          </p>
        </div>
      `,
    })

    console.log('[Contact] Email envoyé :', result)
    return res.status(200).json({ success: true })

  } catch (error) {
    console.error('[Contact] Erreur Resend :', error?.message ?? error)
    return res.status(500).json({
      error: 'Erreur lors de l\'envoi',
      detail: error?.message ?? 'Inconnue',
    })
  }
}