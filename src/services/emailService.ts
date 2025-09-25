// Email service for OTP delivery using PHP backend
// Works with Outlook, Gmail, Yahoo, and all email providers
// No EmailJS dependency - uses PHP backend for reliable delivery

interface EmailConfig {
  endpoint: string;
  timeout: number;
  retryAttempts: number;
}

interface EmailResponse {
  success: boolean;
  message: string;
  email?: string;
  timestamp?: string;
  provider?: string;
}

// PHP Backend Configuration
const EMAIL_CONFIG: EmailConfig = {
  endpoint: 'https://lightgrey-frog-998612.hostingersite.com/sendotp.php',
  timeout: 15000, // 15 seconds
  retryAttempts: 2
};

// OTP storage for debugging and fallback
const otpStore: Map<string, { otp: string; timestamp: number; employeeName: string; attempts: number }> = new Map();
const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes
const MAX_OTP_ATTEMPTS = 5;

// Generate secure 6-digit OTP
export const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('🔢 Generated OTP:', otp);
  return otp;
};

// Send OTP email using PHP backend with retry logic
export const sendOTPEmail = async (
  recipientEmail: string, 
  recipientName: string, 
  otp: string
): Promise<boolean> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= EMAIL_CONFIG.retryAttempts; attempt++) {
    try {
      console.log(`🔥 === OTP SEND ATTEMPT ${attempt}/${EMAIL_CONFIG.retryAttempts} ===`);
      console.log('📧 Recipient Email:', recipientEmail);
      console.log('👤 Recipient Name:', recipientName);
      console.log('🔢 OTP Code:', otp);
      console.log('🔗 Backend Endpoint:', EMAIL_CONFIG.endpoint);

      // Store OTP for fallback/debugging
      const existingData = otpStore.get(recipientEmail);
      otpStore.set(recipientEmail, {
        otp,
        timestamp: Date.now(),
        employeeName: recipientName,
        attempts: (existingData?.attempts || 0) + 1
      });

      // Check if we've exceeded max attempts
      const storedData = otpStore.get(recipientEmail);
      if (storedData && storedData.attempts > MAX_OTP_ATTEMPTS) {
        throw new Error('Too many OTP attempts. Please wait before trying again.');
      }

      console.log('🚀 Sending request to PHP backend...');
      
      // Create request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ Request timeout reached');
        controller.abort();
      }, EMAIL_CONFIG.timeout);

      // Prepare request payload - ONLY these 3 fields
      const requestPayload = {
        to_email: recipientEmail.trim(),
        employee_name: recipientName.trim(),
        otp_code: otp.trim()
      };

      console.log('📋 Request Payload:', requestPayload);

      // Send request to PHP backend with proper headers
      const response = await fetch(EMAIL_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'omit' // Don't send cookies
      });

      clearTimeout(timeoutId);

      console.log('📡 HTTP Response Status:', response.status);
      console.log('📡 HTTP Response Headers:', response.headers);
      console.log('📡 HTTP Response OK:', response.ok);

      // Handle HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      // Parse JSON response
      const result: EmailResponse = await response.json();
      
      console.log('📤 PHP Backend Response:', result);
      
      if (result.success) {
        console.log('✅ SUCCESS: Email sent successfully via PHP backend!');
        console.log(`✅ OTP ${otp} sent to ${recipientEmail} via ${result.provider || 'email provider'}`);
        
        // Clear attempts counter on success
        if (storedData) {
          storedData.attempts = 0;
          otpStore.set(recipientEmail, storedData);
        }
        
        return true;
      } else {
        throw new Error(result.message || 'Unknown backend error');
      }
      
    } catch (error: any) {
      lastError = error;
      
      console.error(`❌ === EMAIL SEND ATTEMPT ${attempt} FAILED ===`);
      
      if (error.name === 'AbortError') {
        console.error('❌ Request timeout after', EMAIL_CONFIG.timeout / 1000, 'seconds');
      } else if (error.message.includes('CORS')) {
        console.error('❌ CORS Error - Backend needs CORS headers:', error.message);
      } else if (error.message.includes('fetch')) {
        console.error('❌ Network/Connection Error:', error.message);
      } else if (error.message.includes('JSON')) {
        console.error('❌ Invalid JSON Response:', error.message);
      } else {
        console.error('❌ Backend Error:', error.message);
      }
      
      console.error('❌ Full Error Object:', error);
      
      // Wait before retry (except on last attempt)
      if (attempt < EMAIL_CONFIG.retryAttempts) {
        const retryDelay = attempt * 1000; // 1s, 2s
        console.log(`⏳ Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  // All attempts failed
  console.error('❌ === ALL EMAIL SEND ATTEMPTS FAILED ===');
  console.error('❌ Final Error:', lastError?.message);
  
  return false;
};

// Enhanced OTP verification with stored OTPs
export const verifyStoredOTP = (email: string, inputOTP: string): { success: boolean; message: string } => {
  console.log('🔍 === OTP VERIFICATION STARTING ===');
  console.log('🔍 Email:', email);
  console.log('🔍 Input OTP:', inputOTP);
  
  const stored = otpStore.get(email);
  
  if (!stored) {
    console.log('❌ No stored OTP found for email:', email);
    return { 
      success: false, 
      message: 'No verification code found. Please request a new one.' 
    };
  }

  console.log('🔍 Stored OTP Data:', {
    otp: stored.otp,
    timestamp: new Date(stored.timestamp).toISOString(),
    employeeName: stored.employeeName,
    attempts: stored.attempts
  });

  // Check expiry
  const timeElapsed = Date.now() - stored.timestamp;
  const isExpired = timeElapsed > OTP_EXPIRY;
  
  console.log('🔍 Time Check:', {
    timeElapsed: Math.round(timeElapsed / 1000) + ' seconds',
    expiryLimit: OTP_EXPIRY / 1000 + ' seconds',
    isExpired
  });

  if (isExpired) {
    console.log('⏰ Stored OTP expired for:', email);
    otpStore.delete(email);
    return { 
      success: false, 
      message: 'Verification code has expired. Please request a new one.' 
    };
  }

  // Verify OTP (case-sensitive, trimmed)
  const cleanInput = inputOTP.trim();
  const cleanStored = stored.otp.trim();
  const isValid = cleanStored === cleanInput;
  
  console.log('🔍 OTP Comparison:', {
    stored: cleanStored,
    input: cleanInput,
    valid: isValid
  });

  if (isValid) {
    console.log('✅ OTP verified successfully for:', email);
    otpStore.delete(email); // Clear OTP after successful verification
    return { 
      success: true, 
      message: 'Email verified successfully!' 
    };
  }

  console.log('❌ Invalid OTP for:', email);
  return { 
    success: false, 
    message: 'Invalid verification code. Please check and try again.' 
  };
};

// Get stored OTP for debugging (admin use only)
export const getStoredOTP = (email: string): string | null => {
  const stored = otpStore.get(email);
  const otp = stored ? stored.otp : null;
  console.log('🔧 Debug - Retrieved stored OTP for', email, ':', otp);
  return otp;
};

// Validate email address format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email.trim());
  console.log('📧 Email validation:', { 
    email: email.trim(), 
    valid: isValid 
  });
  return isValid;
};

// Detect email provider for display purposes
export const getEmailProvider = (email: string): string => {
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (!domain) return 'Email Provider';
  
  const providers: Record<string, string> = {
    'tekjuice.co.uk': 'Tek Juice',
    'gmail.com': 'Gmail',
    'outlook.com': 'Microsoft Outlook',
    'hotmail.com': 'Hotmail',
    'live.com': 'Microsoft Live',
    'yahoo.com': 'Yahoo Mail',
    'yahoo.co.uk': 'Yahoo Mail UK',
    'icloud.com': 'iCloud Mail',
    'protonmail.com': 'ProtonMail'
  };
  
  // Check for exact matches first
  if (providers[domain]) {
    return providers[domain];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(providers)) {
    if (domain.includes(key.split('.')[0])) {
      return value;
    }
  }
  
  // Default formatting
  const domainName = domain.split('.')[0];
  return domainName.charAt(0).toUpperCase() + domainName.slice(1);
};

// Clean up expired OTPs from memory
export const cleanupExpiredOTPs = (): void => {
  const now = Date.now();
  let cleaned = 0;
  const toDelete: string[] = [];
  
  for (const [email, data] of otpStore.entries()) {
    if (now - data.timestamp > OTP_EXPIRY) {
      toDelete.push(email);
      cleaned++;
    }
  }
  
  // Delete expired entries
  toDelete.forEach(email => otpStore.delete(email));
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired OTP(s)`);
  }
};

// Test backend connectivity
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log('🧪 Testing backend connection...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(EMAIL_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to_email: 'test@example.com',
        employee_name: 'Connection Test',
        otp_code: '000000'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    console.log('🧪 Connection Test Response Status:', response.status);
    
    // We expect a 400 status for invalid email, which means backend is working
    const isWorking = response.status === 400 || response.status === 200;
    console.log('🧪 Backend Status:', isWorking ? 'ONLINE' : 'OFFLINE');
    
    return isWorking;
    
  } catch (error: any) {
    console.error('🧪 Backend connection test failed:', error.message);
    return false;
  }
};

// Get OTP storage stats for debugging
export const getOTPStats = (): { total: number; active: number; expired: number } => {
  const now = Date.now();
  let active = 0;
  let expired = 0;
  
  for (const [, data] of otpStore.entries()) {
    if (now - data.timestamp > OTP_EXPIRY) {
      expired++;
    } else {
      active++;
    }
  }
  
  return {
    total: otpStore.size,
    active,
    expired
  };
};

// Force clear all stored OTPs (admin function)
export const clearAllOTPs = (): number => {
  const count = otpStore.size;
  otpStore.clear();
  console.log(`🗑️ Cleared ${count} stored OTP(s)`);
  return count;
};

// Auto-cleanup expired OTPs every 5 minutes
const cleanupInterval = setInterval(() => {
  cleanupExpiredOTPs();
}, 5 * 60 * 1000);

// Export cleanup interval for potential clearing
export const stopAutoCleanup = (): void => {
  clearInterval(cleanupInterval);
  console.log('🛑 Auto-cleanup stopped');
};

console.log('🚀 Email service initialized with PHP backend');
console.log('📡 Backend endpoint:', EMAIL_CONFIG.endpoint);