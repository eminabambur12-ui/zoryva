import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, topic, message } = await request.json()

    if (!name || !email || !topic || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const topicLabels: Record<string, string> = {
      feedback: 'Feature idea or feedback',
      bug: 'Something is broken',
      billing: 'Billing or subscription question',
      account: 'Account help',
      other: 'Something else',
    }

    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey) {
      // If Resend not set up yet, just log and return success
      console.log('Contact form submission:', { name, email, topic, message })
      return NextResponse.json({ success: true })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Zoryva Contact <noreply@zoryva.app>',
        to: ['hello@zoryva.app'],
        reply_to: email,
        subject: `[Zoryva] ${topicLabels[topic] || topic} — from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1a1a1a; margin-bottom: 4px;">New message from Zoryva contact form</h2>
            <p style="color: #888; font-size: 14px; margin-bottom: 24px;">Submitted on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e6e6; color: #888; font-size: 13px; width: 120px;">Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e6e6; color: #1a1a1a; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e6e6; color: #888; font-size: 13px;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e6e6; color: #1a1a1a; font-size: 14px;"><a href="mailto:${email}" style="color: #c0392b;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e6e6; color: #888; font-size: 13px;">Topic</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0e6e6; color: #1a1a1a; font-size: 14px;">${topicLabels[topic] || topic}</td>
              </tr>
            </table>

            <div style="background: #fdf8f8; border-radius: 12px; padding: 20px;">
              <div style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Message</div>
              <p style="color: #1a1a1a; font-size: 15px; line-height: 1.6; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
            </div>

            <p style="color: #888; font-size: 12px; margin-top: 24px;">
              Hit reply to respond directly to ${name}.
            </p>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
