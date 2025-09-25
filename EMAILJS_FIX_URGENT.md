# 🔧 EMAILJS TEMPLATE FIX

## 🚨 URGENT: Update Your EmailJS Template

Your emails aren't sending because the template variables might not match exactly. Here's the exact template that WILL work:

## 📧 GO TO YOUR EMAILJS DASHBOARD NOW:

1. **Go to**: https://dashboard.emailjs.com/admin/templates
2. **Edit your template**: `template_8tkt9i3`
3. **Replace the ENTIRE content** with this **EXACT** template:

### **Subject Line:**
```
Tek Juice Voting - Your OTP Code
```

### **Email Body (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #f6931b; color: white; padding: 20px; text-align: center;">
    <h1>🏆 Tek Juice Voting</h1>
    <p>Employee of the Month</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 2px solid #f6931b;">
    <p>Hello <strong>{{employee_name}}</strong>,</p>
    
    <p>Your OTP code for voting is:</p>
    
    <div style="background: #f6931b; color: white; font-size: 24px; font-weight: bold; text-align: center; padding: 15px; margin: 20px 0;">
      {{otp_code}}
    </div>
    
    <p>This code expires in 10 minutes.</p>
    
    <p>© 2025 Tek Juice Group</p>
  </div>
</div>
```

## 🎯 CRITICAL VARIABLES:
Make sure your template has exactly these variables:
- `{{employee_name}}` 
- `{{otp_code}}`
- `{{to_email}}` (EmailJS automatically handles this)

## ⚡ AFTER UPDATING TEMPLATE:

1. **Save the template**
2. **Test send** from EmailJS dashboard
3. **Check your email** - should receive test email
4. **Redeploy** your Netlify site with updated code

---

## 🔧 IF STILL NOT WORKING:

Check these in EmailJS dashboard:
1. **Service Status**: Make sure Gmail service is active
2. **Template Test**: Use "Test" button in template
3. **Monthly Limit**: Check if you've exceeded free tier (200 emails/month)
4. **Gmail Permissions**: Ensure EmailJS has proper Gmail access

---

**UPDATE THE TEMPLATE NOW AND TEST IMMEDIATELY!** 🚀