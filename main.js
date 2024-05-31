import { AutoRouter, json } from 'itty-router'

const router = AutoRouter()

router.post('/', async (request, env) => {
  const url = new URL(request.url)
	const subject = url.searchParams.get("subject")
	const body = url.searchParams.get("body") // this will be the body of the email. You can include \n for new lines. Probably supports HTML, haven't tried
	const to = url.searchParams.get("to")  // recipient email
	const name = url.searchParams.get("name")  // recipient name

  const mail = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
        personalizations: [{
            to: [{ email: to, name }],
        }],
        from: {
          email: "test@codabool.com",
          name: "", // the FROM name the recipient will see in their inbox
        },
        content: [{ type: 'text/plain', value: body }],
        subject,
    })
  })

  const text = await mail.text()
  if (!mail.ok || mail.status > 299) {
    console.error(`Error sending email: ${mail.status} ${mail.statusText} ${text}`)
    return new Response("not found", { status: 404 })
  }

  return new Response("email sent", { status: 200 })
})

export default { fetch: router.fetch }