# 📧 Real OTP Email Setup Guide

## 🚀 Production Deployment Options

### ✅ **WORKS EVERYWHERE** - No Backend Required

Your OTP system is now ready to work on:
- ✅ **Netlify** (Recommended - Free tier available)
- ✅ **Vercel** 
- ✅ **cPanel/Shared Hosting**
- ✅ **GitHub Pages** (with GitHub Actions)
- ✅ **Any static hosting**

---

## 📧 EmailJS Setup (For Real Email Sending)

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for free account
3. Verify your email

### Step 2: Connect Your Email Service (Outlook/Gmail)

#### For **Microsoft Outlook/Hotmail**:
1. In EmailJS dashboard → **Email Services**
2. Click **Add New Service**
3. Select **Outlook**
4. Enter your Outlook credentials
5. Copy the **Service ID** (e.g., `service_tekjuice`)

#### For **Gmail** (Alternative):
1. Select **Gmail**
2. Use OAuth to connect
3. Copy the **Service ID**

### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Template ID: `template_otp`
4. Use this template:

```html
Subject: Your Tek Juice Voting OTP Code

Hello {{to_name}},

Your verification code for the Tek Juice Employee of the Month voting is:

**{{otp_code}}**

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
{{company_name}}
```

### Step 4: Get Your Keys
1. Copy your **Public Key** from Settings
2. Copy your **Service ID**
3. Copy your **Template ID**

### Step 5: Update Configuration
Open `src/services/emailService.ts` and update:

```typescript
const EMAIL_CONFIG: EmailConfig = {
  serviceId: 'service_your_actual_id', // Replace with your Service ID
  templateId: 'template_otp',          // Replace with your Template ID
  publicKey: 'your_actual_public_key'  // Replace with your Public Key
};
```

---

## 🌐 Deployment Instructions

### **Option 1: Netlify (Recommended)**

1. Build your project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Drag & drop `dist` folder to Netlify
   - Or connect GitHub repo for auto-deploy

3. ✅ **Your OTP emails will work immediately!**

### **Option 2: cPanel/Shared Hosting**

1. Build project: `npm run build`
2. Upload `dist` folder contents to `public_html`
3. ✅ **Works with any cPanel hosting!**

### **Option 3: Vercel**

1. Connect GitHub repo to Vercel
2. Auto-deploy on push
3. ✅ **Emails work out of the box!**

---

## 🎯 Current Status

### ✅ **Working Now (Development)**
- Demo mode with console logging
- Real OTP generation
- Email validation
- Outlook email detection

### ✅ **Will Work in Production** (After EmailJS setup)
- Real email sending to Outlook/Gmail
- Professional email templates
- Automatic resend functionality
- Works on any hosting platform

---

## 🔧 Email Provider Support

| Provider | Status | Notes |
|----------|--------|-------|
| **Microsoft Outlook** | ✅ Full Support | Recommended |
| **Hotmail/Live** | ✅ Full Support | Same as Outlook |
| **Gmail** | ✅ Full Support | OAuth required |
| **Yahoo** | ✅ Full Support | SMTP available |
| **Corporate Email** | ✅ Full Support | Via SMTP |

---

## 🚀 Ready for Production!

Your voting system is now ready for production deployment with real OTP emails. The system will:

1. **Generate secure 6-digit OTPs**
2. **Send professional emails** to any email provider
3. **Work on any hosting platform**
4. **Handle Outlook emails perfectly**
5. **Provide great user experience**

Just set up EmailJS (15 minutes) and deploy anywhere! 🎉