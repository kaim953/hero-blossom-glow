# Contact Form Setup Guide

This guide walks you through configuring the contact form to send emails to your own address.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Getting Your Resend API Key](#getting-your-resend-api-key)
4. [Configuring Secrets in Lovable](#configuring-secrets-in-lovable)
5. [Domain Verification (Production)](#domain-verification-production)
6. [Updating the Sender Address](#updating-the-sender-address)
7. [Testing the Form](#testing-the-form)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The contact form allows visitors to send messages directly to your email inbox. When someone submits the form, an email is sent to your configured email address with their name, email, and message.

The form uses [Resend](https://resend.com) as the email service provider. Resend offers:
- Free tier with 100 emails/day
- Simple API integration
- Reliable email delivery

---

## Prerequisites

Before you begin, make sure you have:

- ✅ A Resend account (free tier available at [resend.com](https://resend.com))
- ✅ Access to your Lovable project settings
- ✅ (Optional) A custom domain for production use

---

## Getting Your Resend API Key

### Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Click **Get Started** or **Sign Up**
3. Create your account using email or GitHub

### Step 2: Navigate to API Keys

1. Once logged in, click on **API Keys** in the left sidebar
2. Or go directly to: [resend.com/api-keys](https://resend.com/api-keys)

### Step 3: Create a New API Key

1. Click **Create API Key**
2. Give it a name (e.g., "Contact Form")
3. Select **Full access** permission
4. Click **Create**

### Step 4: Copy Your API Key

> ⚠️ **Important:** The API key is only shown once! Copy it immediately and store it somewhere safe.

Your API key will look something like: `re_xxxxxxxxxx_xxxxxxxxxxxxxxxxxxxx`

---

## Configuring Secrets in Lovable

You need to add two secrets to your Lovable project:

### Step 1: Open Backend Settings

1. In your Lovable project, click on the **Cloud** tab
2. Navigate to **Secrets**

### Step 2: Add RESEND_API_KEY

1. Click **Add Secret**
2. Enter the name: `RESEND_API_KEY`
3. Paste your Resend API key as the value
4. Click **Save**

### Step 3: Add CONTACT_EMAIL

1. Click **Add Secret**
2. Enter the name: `CONTACT_EMAIL`
3. Enter the email address where you want to receive contact form submissions (e.g., `contact@yourcompany.com`)
4. Click **Save**

---

## Domain Verification (Production)

### Why Verify a Domain?

For testing, Resend provides a shared sender address (`onboarding@resend.dev`). However, for production use, you should verify your own domain because:

- Emails from your domain look more professional
- Better email deliverability
- Reduces chance of emails going to spam
- Required for sending more than 100 emails/day

### How to Verify Your Domain

1. Go to [resend.com/domains](https://resend.com/domains)
2. Click **Add Domain**
3. Enter your domain (e.g., `yourcompany.com`)
4. Resend will provide DNS records to add to your domain

### DNS Records to Add

You'll need to add the following records at your domain registrar (e.g., GoDaddy, Cloudflare, Namecheap):

| Type | Name | Value |
|------|------|-------|
| MX | (varies) | (provided by Resend) |
| TXT | (varies) | (provided by Resend) |

> 💡 **Tip:** DNS changes can take up to 48 hours to propagate, but usually complete within a few hours.

5. Once verified, you'll see a green checkmark next to your domain

---

## Updating the Sender Address

After verifying your domain, update the edge function to use your domain:

### Step 1: Locate the Edge Function

Open the file: `supabase/functions/send-contact-email/index.ts`

### Step 2: Find the From Address

Look for this line (around line 132):

```typescript
from: "Contact Form <onboarding@resend.dev>",
```

### Step 3: Update to Your Domain

Change it to use your verified domain:

```typescript
from: "Contact Form <hello@yourdomain.com>",
```

You can customize the name and email:
- `"Company Name <contact@yourdomain.com>"`
- `"Support Team <support@yourdomain.com>"`
- `"Notifications <noreply@yourdomain.com>"`

### Step 4: Save and Deploy

Save the file. The edge function will automatically redeploy.

---

## Testing the Form

### Step 1: Submit a Test Message

1. Go to your website's contact form
2. Fill in all fields:
   - **Name:** Test User
   - **Email:** your-email@example.com
   - **Message:** This is a test message
3. Click **Send message**

### Step 2: Verify Delivery

1. Check the inbox of the email you configured as `CONTACT_EMAIL`
2. You should receive an email with the subject: "New Contact Form Submission from Test User"

### Step 3: Check Spam

If you don't see the email:
1. Check your spam/junk folder
2. Add the sender address to your contacts
3. Mark the email as "Not Spam" to improve future delivery

---

## Troubleshooting

### "Email service not configured"

**Cause:** The `RESEND_API_KEY` secret is not set.

**Solution:**
1. Go to Cloud → Secrets in Lovable
2. Add the `RESEND_API_KEY` secret with your Resend API key

---

### "Contact email not configured"

**Cause:** The `CONTACT_EMAIL` secret is not set.

**Solution:**
1. Go to Cloud → Secrets in Lovable
2. Add the `CONTACT_EMAIL` secret with your email address

---

### Emails not arriving

**Possible causes and solutions:**

1. **Check spam folder** - Emails from `onboarding@resend.dev` may be flagged as spam
2. **Domain not verified** - If using a custom domain, ensure it's verified at [resend.com/domains](https://resend.com/domains)
3. **Invalid API key** - Regenerate your API key and update the secret
4. **Email typo** - Double-check the `CONTACT_EMAIL` value for typos

---

### "Too many requests. Please try again later."

**Cause:** Rate limiting is active. The form allows 5 submissions per minute per user.

**Solution:** Wait 1 minute before trying again. This is intentional to prevent spam.

---

### Emails going to spam

**Solutions:**
1. Verify your own domain (recommended for production)
2. Ask recipients to add your sender address to their contacts
3. Ensure your domain has proper SPF and DKIM records (Resend provides these)

---

## Quick Reference

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `RESEND_API_KEY` | Your Resend API key | `re_xxxxxxxx_xxxxxxxxxxxx` |
| `CONTACT_EMAIL` | Email to receive submissions | `contact@yourcompany.com` |

---

## Need Help?

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Lovable Documentation](https://docs.lovable.dev)
