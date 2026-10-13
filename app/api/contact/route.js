/**
 * Concept: Route Handler (App Router) — server-side POST for the contact form.
 * Forwards to Web3Forms with WEB3FORMS_ACCESS_KEY from env (never exposed to the browser).
 */
export async function POST(request) {
  try {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      return Response.json(
        {
          ok: false,
          error:
            'Contact form is not configured yet. Add WEB3FORMS_ACCESS_KEY to .env.local.',
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !message) {
      return Response.json(
        { ok: false, error: 'Please fill in name, email, and message.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return Response.json(
        { ok: false, error: 'Message is a bit short — please write a little more.' },
        { status: 400 }
      );
    }

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Portfolio contact from ${name}`,
        from_name: name,
        email,
        message,
        to: 'erzaaduraku15@gmail.com',
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.success === false) {
      return Response.json(
        {
          ok: false,
          error:
            data.message ||
            'Could not send your message right now. Please try again or email me directly.',
        },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      {
        ok: false,
        error: 'Something went wrong. Please try again or email me directly.',
      },
      { status: 500 }
    );
  }
}