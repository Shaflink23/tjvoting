

import { ArrowRight, Vote } from 'lucide-react';
import heroImg from '../images/hero.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface HeroProps {
  onVoteClick?: () => void;
}

export default function Hero({ onVoteClick }: HeroProps) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 via-yellow-100 to-white flex flex-col">
      {/* Hero Section */}
      <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center py-8" style={{paddingLeft: '20px'}}>
        <div className="w-full md:w-1/2 space-y-8 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 leading-tight text-center md:text-left">
            Your Vote Matters in Shaping Our Future
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto md:mx-0 text-center md:text-left">
            “Cast your vote for TekJuice’s Employee of the Month from anywhere, securely and easily. Every vote counts in celebrating and motivating our team.”
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => onVoteClick ? onVoteClick() : navigate('/vote')}
              className="flex items-center justify-center space-x-2 bg-blue-900 text-white px-6 sm:px-8 py-3 rounded-full hover:bg-blue-800 transition-colors w-full sm:w-auto"
            >
              <span>Vote Now</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              className="flex items-center justify-center space-x-2 border-2 border-blue-900 text-blue-900 px-6 sm:px-8 py-3 rounded-full hover:bg-blue-50 transition-colors w-full sm:w-auto"
              onClick={() => setShowModal(true)}
            >
              <span>Learn More</span>
            </button>
          </div>
          <div className="flex items-center md:justify-start justify-center space-x-6 pt-4">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold" style={{color: '#F6931B'}}>100%</p>
              <p className="text-xs sm:text-sm text-gray-600">Secure</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold" style={{color: '#F6931B'}}>24/7</p>
              <p className="text-xs sm:text-sm text-gray-600">Available</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold" style={{color: '#F6931B'}}>Easy</p>
              <p className="text-xs sm:text-sm text-gray-600">To Use</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0 relative">
          {/* Restore original circle size and position for desktop */}
          <div className="absolute rounded-full hidden sm:block" style={{ backgroundColor: '#f6931b', width: '500px', height: '500px', top: '40px', left: '50%', transform: 'translateX(-50%)', marginTop: '-60px' }} />
          {/* Add a smaller circle for mobile view */}
          <div className="absolute rounded-full sm:hidden" style={{ backgroundColor: '#f6931b', width: '220px', height: '220px', top: '60px', left: '50%', transform: 'translateX(-50%)' }} />
          <img src={heroImg} alt="Online Voting Illustration" width={320} height={320} className="relative z-10 w-64 h-64 sm:w-[400px] sm:h-[400px] object-contain" />
          {/* Voting info card only on desktop */}
          <div className="absolute top-5 right-5 bg-white p-4 rounded-xl shadow-lg z-20 hidden sm:block">
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <Vote className="h-8 w-8 text-blue-900" />
              </div>
              <div>
                <p className="font-bold text-blue-900">Cast Your Vote</p>
                <p className="text-sm text-gray-500">Quick & Secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full border border-[#f6931b]">
            <h2 className="text-xl font-bold text-[#f6931b] mb-2">About Employee of the Month Voting</h2>
            <p className="text-gray-700 mb-4">
              Every month, Tek Juice Uganda celebrates the dedication and hard work of its team by allowing employees to vote for their peers. The Employee of the Month is chosen based on votes for outstanding performance, teamwork, and positive impact. Your participation helps foster a culture of recognition and motivation!
            </p>
            <button
              className="bg-[#f6931b] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#e67c13] transition"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}