# Save calculator sign-ups to your Google Sheet

Takes about 5 minutes. You do this once.

## 1. Add the script to your sheet

1. Open your Google Sheet.
2. **Extensions → Apps Script**.
3. Delete whatever is in the editor, then paste in everything from `Code.gs` (this folder).
4. On the line `var SECRET = "PASTE-YOUR-LONG-RANDOM-SECRET-HERE";` replace the text in quotes with a long random
   string of your own (30+ letters and numbers, e.g. mash the keyboard). **Keep a copy — you need it in step 3.**
5. Click the **Save** icon.

## 2. Publish it as a web app

1. Top right: **Deploy → New deployment**.
2. Click the gear next to "Select type" → **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. **Deploy**, then **Authorize access** (choose your Google account → Advanced → Go to project → Allow).
5. Copy the **Web app URL** (it ends in `/exec`).

"Anyone" only means anyone who has the URL *and* the secret can add a row. Nobody can read your sheet through it.

## 3. Give the site the URL and secret

In Vercel → the **ishikaa-jain** project → **Settings → Environment Variables**, add (for Production):

| Name | Value |
| --- | --- |
| `SHEET_WEBHOOK_URL` | the Web app URL from step 2 |
| `SHEET_WEBHOOK_SECRET` | the exact secret you chose in step 1 |

Then **Deployments → ⋯ on the latest → Redeploy** so the site picks them up.

## 4. Test it

Open the live site, run the calculator, unlock it with a real name and email. A new tab called
**Calculator leads** appears in your sheet with one row per sign-up.

## Good to know

- If you later edit the script, use **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**
  (the URL stays the same).
- If the sheet is ever unreachable, the visitor still sees their results; the sign-up is just not saved, and
  the site logs `[lead] ...` in Vercel → Logs.
- Emails are collected with a line under the button saying they agree to get emails from Zero Noise.
  Only email people who signed up this way.

## Also send sign-ups to Kit (ConvertKit)

The site can save each sign-up to your Kit list too. It's independent of the sheet: use either or both.

1. In Kit: **Settings → Developer → API Keys → Create** (v4 key). Copy it.
2. In Vercel → **Settings → Environment Variables** add `KIT_API_KEY` = that key.
3. Optional: to start a sequence or segment these people, create a tag in Kit (e.g. "Calculator"), open it, and copy
   the number at the end of its URL. Add it as `KIT_TAG_ID`.
4. Redeploy.

Each person is added with their first name and email. Kit's own unsubscribe link is in every email you send.
