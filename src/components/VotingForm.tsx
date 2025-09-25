import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, User } from 'lucide-react';
import { useApp } from '../App';
import { generateOTP, sendOTPEmail, validateEmail, getEmailProvider, getStoredOTP, verifyStoredOTP } from '../services/emailService';

interface VotingFormProps {
  onBack: () => void;
}

const VotingForm: React.FC<VotingFormProps> = ({ onBack }) => {
  const { employees, currentUser, setCurrentUser, addVote } = useApp();
  const [selectedAuthEmployee, setSelectedAuthEmployee] = useState(''); // Who is authenticating
  const [selectedVoteEmployee, setSelectedVoteEmployee] = useState(''); // Who they want to vote for
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authStep, setAuthStep] = useState<'input' | 'otp' | 'change'>('input');
  const [authError, setAuthError] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [emailProvider, setEmailProvider] = useState('');
  
  // Universal credentials for all Tek Juice employees
  const universalPassword = 'Consultant2025!';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsOtpSending(true);
    
    // Validate email format
    if (!validateEmail(authEmail)) {
      setAuthError('Please enter a valid email address.');
      setIsOtpSending(false);
      return;
    }

    // Check if password is correct
    if (authPassword !== universalPassword) {
      setAuthError('Invalid password. Please check and try again.');
      setIsOtpSending(false);
      return;
    }

    // Find employee by email
    const employee = employees.find(emp => emp.email.toLowerCase() === authEmail.toLowerCase());
    
    if (!employee) {
      setAuthError('This email is not registered with Tek Juice. Please contact your administrator.');
      setIsOtpSending(false);
      return;
    }

    // Check if this employee matches the selected one
    if (selectedAuthEmployee !== employee.id) {
      setAuthError('Please select your name from the dropdown above.');
      setIsOtpSending(false);
      return;
    }

    try {
      // Generate new OTP for real sending
      const newOtp = generateOTP();
      setGeneratedOtp(newOtp);
      setEmailProvider(getEmailProvider(authEmail));
      
      console.log(`🚀 Attempting to send OTP to ${employee.name} at ${authEmail}...`);
      
      // Send real OTP email to employee's actual email
      const emailSent = await sendOTPEmail(authEmail, employee.name, newOtp);
      
      if (emailSent) {
        console.log('✅ OTP sent successfully, moving to OTP step');
        setAuthStep('otp');
        setAuthError('');
      } else {
        console.log('❌ Email sending failed, showing debug OTP');
        const debugOTP = getStoredOTP(authEmail);
        setAuthStep('otp');
        setAuthError(`Email failed, but you can test with OTP: ${debugOTP || newOtp} (Debug Mode)`);
      }
    } catch (error) {
      console.error('❌ Auth error:', error);
      setAuthError('Failed to send OTP email. Please try again.');
    }
    
    setIsOtpSending(false);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    const enteredOtp = otpDigits.join('');
    console.log('🔍 OTP Verification attempt:', enteredOtp);
    
    // Use enhanced verification that checks both generated and stored OTPs
    const verification = verifyStoredOTP(authEmail, enteredOtp);
    
    if (verification.success || enteredOtp === generatedOtp) {
      console.log('✅ OTP verification successful');
      // Set the authenticated user and go to confidential page
      const authenticatedUser = employees.find(emp => emp.id === selectedAuthEmployee);
      setCurrentUser(authenticatedUser || null);
      setStep('confidential');
      // Close modal after successful authentication
      setShowAuthModal(false);
    } else {
      console.log('❌ OTP verification failed');
      setAuthError(verification.message || 'Incorrect OTP. Please check your email and try again.');
    }
  };

  // Handle OTP digit input
  const handleOtpDigitChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newDigits = [...otpDigits];
      newDigits[index] = value;
      setOtpDigits(newDigits);
      // Auto-focus next input if filled
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-digit-${index + 1}`);
        if (nextInput) (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleChangePassword = () => {
    setAuthStep('change');
  };

  const handleSaveNewPassword = () => {
    setAuthStep('input');
    setAuthPassword('');
    setAuthError('Password changed! Use new password next time.');
  };
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'who' | 'confidential' | 'vote'>('who');
  const [timeLeft, setTimeLeft] = useState('');

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date('2025-09-30T23:59:59').getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        setTimeLeft('Voting has ended');
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };
    
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please select who you are first.');
      return;
    }
    if (!selectedVoteEmployee) {
      setError('Please select an employee to vote for.');
      return;
    }
    if (!comment.trim()) {
      setError('Please provide a reason for your vote.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const success = addVote({
      voterId: currentUser.id,
      employeeId: selectedVoteEmployee,
      comment: comment.trim()
    });

    if (success) {
      setSubmitted(true);
    } else {
      if (currentUser.id === selectedVoteEmployee) {
        setError('You cannot vote for yourself.');
      } else {
        setError('You have already voted this month.');
      }
    }

    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ background: '#f8f6f4', minHeight: '100vh' }}>
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vote Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for participating in the Employee of the Month voting.
          </p>
          <button
            onClick={onBack}
            className="bg-[#f6931b] text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-500 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden" style={{ background: '#F8F6F4' }}>
      {/* Auth Modal Popup controls the flow until verified - MOVED OUTSIDE MAIN FORM */}
      {showAuthModal && selectedAuthEmployee && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full border border-[#f6931b]">
            {authStep === 'input' && (
              <form onSubmit={handleAuth}>
                <h2 className="text-xl font-bold text-[#f6931b] mb-2">Verify Identity</h2>
                <p className="text-gray-700 mb-4">Enter your registered Tek Juice email and the universal password to verify your identity.</p>
                <input
                  type="email"
                  className="w-full mb-3 px-3 py-2 border rounded"
                  placeholder="Email"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  className="w-full mb-3 px-3 py-2 border rounded"
                  placeholder="Password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  required
                />
                {authError && <div className="text-red-500 mb-2">{authError}</div>}
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={isOtpSending}
                    className="bg-[#f6931b] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#e67c13] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOtpSending ? 'Sending OTP...' : 'Verify'}
                  </button>
                  <button type="button" className="bg-gray-200 px-4 py-2 rounded-full font-semibold" onClick={() => { setShowAuthModal(false); setSelectedAuthEmployee(''); setAuthEmail(''); setAuthPassword(''); setAuthError(''); setOtpDigits(['', '', '', '', '', '']); }}>Cancel</button>
                </div>
              </form>
            )}
            {authStep === 'otp' && (
              <form onSubmit={handleOtpSubmit}>
                <h2 className="text-2xl font-bold text-[#f6931b] mb-4 text-center">📧 Verify your Email</h2>
                <div className="text-center mb-4">
                  <p className="text-gray-700 mb-2">Enter the 6-digit code sent to:</p>
                  <p className="font-semibold text-[#f6931b] bg-orange-50 px-4 py-2 rounded-lg inline-block">
                    {authEmail}
                  </p>
                  {emailProvider && (
                    <p className="text-sm text-gray-500 mt-2">Check your {emailProvider} inbox</p>
                  )}
                </div>
                <p className="text-gray-500 mb-4 text-center">
                  Didn't get the code? 
                  <span 
                    className={`ml-1 font-semibold cursor-pointer hover:underline ${
                      isOtpSending ? 'text-gray-400 cursor-not-allowed' : 'text-[#f6931b]'
                    }`}
                    onClick={async () => {
                      if (isOtpSending) return;
                      
                      setIsOtpSending(true);
                      console.log('🔄 Resending OTP...');
                      
                      try {
                        const newOtp = generateOTP();
                        setGeneratedOtp(newOtp);
                        
                        // Find employee for proper name
                        const employee = employees.find(emp => emp.email.toLowerCase() === authEmail.toLowerCase());
                        const employeeName = employee ? employee.name : 'Employee';
                        
                        const emailSent = await sendOTPEmail(authEmail, employeeName, newOtp);
                        
                        if (emailSent) {
                          console.log('✅ OTP resent successfully');
                          setAuthError('');
                        } else {
                          console.log('❌ Resend failed');
                          setAuthError('Failed to resend OTP. Please try again.');
                        }
                      } catch (error) {
                        console.error('❌ Resend error:', error);
                        setAuthError('Failed to resend OTP. Please try again.');
                      }
                      
                      setIsOtpSending(false);
                    }}
                  >
                    {isOtpSending ? 'Sending...' : 'Resend it'}
                  </span>
                </p>
                <div className="flex justify-center gap-3 mb-6">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-digit-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={`w-14 h-14 text-2xl font-bold text-center rounded-lg border-2 ${digit ? 'border-[#f6931b]' : 'border-gray-300'} focus:border-[#f6931b] outline-none`}
                      value={digit}
                      onChange={e => handleOtpDigitChange(idx, e.target.value)}
                    />
                  ))}
                </div>
                {authError && <div className="text-red-500 mb-2 text-center">{authError}</div>}
                <button type="submit" className="w-full bg-[#f6931b] text-white py-3 rounded-full font-semibold text-lg hover:bg-[#e67c13] transition">Verify</button>
                <button type="button" className="w-full mt-2 bg-blue-100 text-blue-900 py-2 rounded-full font-semibold" onClick={handleChangePassword}>Change Password</button>
              </form>
            )}
            {authStep === 'change' && (
              <div>
                <h2 className="text-xl font-bold text-[#f6931b] mb-2">Change Password</h2>
                <input
                  type="password"
                  className="w-full mb-3 px-3 py-2 border rounded"
                  placeholder="New Password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                />
                <button className="bg-[#f6931b] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#e67c13] transition" onClick={handleSaveNewPassword}>Save Password</button>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center bg-[#f6931b] text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-500 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee of the Month</h1>
          <p className="text-gray-600 mb-8">Cast your vote and help recognize outstanding colleagues.</p>
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 'who' && !selectedAuthEmployee && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  <User className="inline h-5 w-5 mr-2" />
                  Who are you?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {employees.map((employee) => (
                    <button
                      key={employee.id}
                      type="button"
                      onClick={() => {
                        setSelectedAuthEmployee(employee.id);
                        setShowAuthModal(true);
                        setAuthStep('input');
                        setAuthEmail('');
                        setAuthPassword('');
                        setAuthError('');
                      }}
                      className={`p-3 rounded-xl border-2 transition-all text-left flex flex-col items-center justify-center h-[150px] ${
                        currentUser?.id === employee.id
                          ? 'border-[#f6931b] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2" style={{height:'60px'}}>
                        <div className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-full flex items-center justify-center overflow-hidden shadow" style={{ background: '#f6931b', boxSizing: 'border-box', border: '3px solid #fff' }}>
                          {employee.avatar && employee.avatar.length > 0 ? (
                            <img 
                              src={employee.avatar}
                              alt={employee.name}
                              className="w-full h-full object-cover rounded-full"
                              style={{width:'56px',height:'56px'}}
                            />
                          ) : (
                            <span className="text-white font-bold text-lg select-none">
                              {(() => {
                                const names = employee.name.trim().split(' ');
                                const first = names[0]?.[0] || '';
                                const last = names.length > 1 ? names[names.length - 1][0] : '';
                                return (first + last).toUpperCase();
                              })()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="font-semibold text-sm mt-1 text-center w-full truncate">{employee.name}</div>
                      <div className="text-xs text-gray-700 mt-1 text-center w-full truncate">{employee.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 'confidential' && currentUser && (
              <div className="flex flex-col items-center justify-center">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl shadow-md p-8 max-w-lg text-center mb-8">
                  <h2 className="text-xl font-bold mb-4" style={{ color: '#F6931B' }}>
                    Hi {currentUser.name.split(' ')[0]}, thanks for taking the initiative to vote for Tekjuice Employee of the Month.
                  </h2>
                  <p className="text-gray-700 text-base mb-4">
                    As you participate in the Employee of the Month voting, please be assured that your selection and comments are completely confidential. Your vote will not be visible to anyone else, including the admin team. We value your honest feedback and encourage you to recognize outstanding colleagues with confidence and integrity.
                  </p>
                  <p className="text-gray-500 text-sm italic">
                    Thank you for helping us celebrate excellence in our workplace.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('vote')}
                  className="bg-[#F6931B] text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-500 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
            {step === 'vote' && currentUser && (
              <>
                {!selectedVoteEmployee ? (
                  <div className="w-full">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                      <h1 className="text-2xl lg:text-3xl font-bold text-[#f6931b] mb-4">🏆 Employee of the Month Finalists</h1>
                      <p className="text-base lg:text-lg text-gray-700 max-w-4xl mx-auto mb-4">
                        Congratulations to our outstanding finalists! These exceptional colleagues have been selected based on their exemplary performance across our key criteria.
                      </p>
                      
                      {/* Countdown Timer */}
                      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-orange-200 rounded-xl p-4 max-w-md mx-auto">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-2xl">⏰</span>
                          <h3 className="text-lg font-bold text-gray-800">Voting Ends Soon!</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">September 30th, 2025 at 11:59 PM</p>
                        <div className="text-2xl font-bold text-[#f6931b] font-mono">
                          {timeLeft}
                        </div>
                      </div>
                    </div>

                    {/* Voting Criteria Section */}
                                        {/* Voting Criteria Section */}
                    <div className="mb-8">
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl shadow-md p-6">
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 text-center">
                          📋 Voting Criteria
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-[#f6931b] rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-white text-xl">⏰</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">Time Keeping</h3>
                            <p className="text-sm text-gray-600">Punctuality & reliability</p>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-[#f6931b] rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-white text-xl">🤝</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">Team Work</h3>
                            <p className="text-sm text-gray-600">Collaboration & support</p>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-[#f6931b] rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-white text-xl">🎯</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">Performance</h3>
                            <p className="text-sm text-gray-600">TRS Task excellence</p>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-[#f6931b] rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-white text-xl">👔</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">Dress Code</h3>
                            <p className="text-sm text-gray-600">Professional appearance</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Finalists Selection Header */}
                    <div className="text-center mb-6">
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Cast Your Vote</h2>
                      <p className="text-gray-600">Select one of our outstanding finalists below</p>
                    </div>

                    {/* Finalists Cards - Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                      {(() => {
                        // Specific finalists for this month
                        const finalistNames = ['Comfort', 'Angel', 'Vincent', 'Andrew'];
                        const finalists = employees.filter(emp => 
                          finalistNames.some(name => 
                            emp.name.toLowerCase().includes(name.toLowerCase())
                          ) && emp.id !== currentUser?.id
                        );
                        
                        // If we don't have all 4 finalists in the database, show available ones
                        const displayFinalists = finalists.length > 0 ? finalists : employees.slice(0, 4);
                        
                        return displayFinalists.map((employee) => (
                          <button
                            key={employee.id}
                            type="button"
                            onClick={() => setSelectedVoteEmployee(employee.id)}
                            className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-center flex flex-col items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-h-[280px] ${
                              selectedVoteEmployee === employee.id
                                ? 'border-[#f6931b] bg-gradient-to-b from-orange-50 to-orange-100 shadow-orange-200'
                                : 'border-gray-200 hover:border-orange-300 bg-white'
                            }`}
                          >
                            {/* Finalist Badge */}
                            <div className="absolute -top-2 -right-2 bg-[#f6931b] text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                              FINALIST
                            </div>
                            
                            {/* Avatar */}
                            <div className="flex items-center justify-center mb-4">
                              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center overflow-hidden shadow-lg" style={{ background: '#f6931b', boxSizing: 'border-box', border: '4px solid #fff' }}>
                                {employee.avatar && employee.avatar.length > 0 ? (
                                  <img 
                                    src={employee.avatar}
                                    alt={employee.name}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <span className="text-white font-bold text-lg lg:text-xl select-none">
                                    {(() => {
                                      const names = employee.name.trim().split(' ');
                                      const first = names[0]?.[0] || '';
                                      const last = names.length > 1 ? names[names.length - 1][0] : '';
                                      return (first + last).toUpperCase();
                                    })()}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Employee Info */}
                            <div className="text-center">
                              <div className="font-bold text-base lg:text-lg text-gray-800 mb-1 leading-tight">{employee.name}</div>
                              <div className="text-xs lg:text-sm text-gray-600 mb-3 leading-tight min-h-[32px] line-clamp-2">{employee.title}</div>
                              
                              {/* Excellence Indicators */}
                              <div className="flex justify-center space-x-1 mb-2">
                                <span className="text-yellow-500 text-sm">⭐</span>
                                <span className="text-yellow-500 text-sm">⭐</span>
                                <span className="text-yellow-500 text-sm">⭐</span>
                                <span className="text-yellow-500 text-sm">⭐</span>
                                <span className="text-yellow-500 text-sm">⭐</span>
                              </div>
                              
                              <div className="text-xs text-[#f6931b] font-semibold">
                                Outstanding Performance
                              </div>
                            </div>
                          </button>
                        ));
                      })()}
                    </div>

                    {/* Why These Finalists */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-8">
                      <h3 className="text-lg font-bold text-blue-800 mb-3 text-center">🌟 Why These Finalists?</h3>
                      <p className="text-blue-700 text-center text-sm leading-relaxed">
                        These four exceptional colleagues have consistently demonstrated excellence across all our evaluation criteria. 
                        <strong> Comfort</strong>, <strong>Angel</strong>, <strong>Vincent</strong>, and <strong>Andrew</strong> have shown remarkable <strong>punctuality</strong>, fostered excellent <strong>teamwork</strong>, 
                        delivered outstanding <strong>performance results</strong>, and maintained professional <strong>dress standards</strong>. 
                        Each finalist represents the best of Tek Juice values and work ethic.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#f6931b]/[.12] border-2 border-[#f6931b] rounded-2xl shadow-lg p-8 max-w-lg text-center mx-auto">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#b45309' }}>
                      Why do you think {employees.find(e => e.id === selectedVoteEmployee)?.name.split(' ')[0]} deserves to be Employee of the Month?
                    </h2>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-[#f6931b] rounded-lg focus:ring-2 focus:ring-[#f6931b] focus:border-transparent mb-4 bg-white/80"
                      placeholder={`Share what makes this employee exceptional...`}
                    />
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#f6931b] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting Vote...' : 'Submit Vote'}
                    </button>
                  </div>
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default VotingForm;