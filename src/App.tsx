import { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import wensiImg from './images/wensi tj.png';
import Hero from './components/Hero';
import VotingForm from './components/VotingForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

export interface Employee {
  id: string;
  name: string;
  title: string;
  avatar: string;
  email: string;
}

export interface Vote {
  id: string;
  voterId: string;
  employeeId: string;
  comment: string;
  timestamp: Date;
}

interface AppContextType {
  employees: Employee[];
  votes: Vote[];
  currentUser: Employee | null;
  isAdmin: boolean;
  addVote: (vote: Omit<Vote, 'id' | 'timestamp'>) => boolean;
  setCurrentUser: (user: Employee | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Updated employee data with real emails for universal authentication
const mockEmployees: Employee[] = [
  { id: '1', name: 'Wensi Nuwagaba', title: 'Chief Executive Officer', avatar: wensiImg, email: 'wensi@tekjuice.co.uk' },
  { id: '2', name: 'Shamsa Naiga', title: 'Operations Manager', avatar: '', email: 'shamsa@tekjuice.co.uk' },
  { id: '3', name: 'Norbert Niwagaba', title: 'Legal and Compliance Officer - Tek Juice Africa', avatar: '', email: 'nobert@tekjuice.co.uk' },
  { id: '4', name: 'Shafik Kinyera', title: 'Developer', avatar: '', email: 'shafik@tekjuice.co.uk' },
  { id: '5', name: 'Pamela Abemigisha', title: 'Server Manager & Designer', avatar: '', email: 'pamela@tekjuice.co.uk' },
  { id: '6', name: 'Nabisere Rhoda', title: 'Account Associate (Acting EC PA)', avatar: '', email: 'nabisere@tekjuice.co.uk' },
  { id: '7', name: 'Patience Ndagire', title: 'Social Media Specialist', avatar: '', email: 'Patience.Ndagire@tekjuice.co.uk' },
  { id: '8', name: 'Sheila Tumwebaze', title: 'Personal Assistant to CTO', avatar: '', email: 'sheilla@tekjuice.co.uk' },
  { id: '9', name: 'Comfort Nahabwe', title: 'Finance & Procurement Manager', avatar: '', email: 'comfort@tekjuice.co.uk' },
  { id: '10', name: 'Tushabe Trinity Francesco', title: 'Pen Tester & Ethical Hacker', avatar: '', email: 'trinity@tekjuice.co.uk' },
  { id: '11', name: 'John Vian Tusimwe', title: 'Digital Marketing Manager- Africa Connect & Tekjuice', avatar: '', email: 'john@tekjuice.co.uk' },
  { id: '12', name: 'Evelyn Naigaga Luganda', title: 'Project Manager, Social Gems', avatar: '', email: 'evelyn@tekjuice.co.uk' },
  { id: '13', name: 'Mark Turyahabwa', title: 'Flutter/Dart Development', avatar: '', email: 'mark@tekjuice.co.uk' },
  { id: '14', name: 'Haley Susan Tushabe', title: 'Senior Marketing Executive – Social Gems', avatar: '', email: 'suzan@tekjuice.co.uk' },
  { id: '15', name: 'Angel Umwiza', title: 'Developer/Team Lead', avatar: '', email: 'angel@tekjuice.co.uk' },
  { id: '16', name: 'Mildred Nakiganda', title: 'Flutter/Dart Development', avatar: '', email: 'millie@tekjuice.co.uk' },
  { id: '17', name: 'Martha Twesiime', title: 'Sales and Marketing Associate', avatar: '', email: 'martha@tekjuice.co.uk' },
  { id: '18', name: 'Emmanuel Mbonye', title: 'Back-End Developer', avatar: '', email: 'emmanuel@tekjuice.co.uk' },
  { id: '19', name: 'Nampeera Christine', title: 'Brand Influencer Recruitment Expert', avatar: '', email: 'christine@tekjuice.co.uk' },
  { id: '20', name: 'Elia Igga', title: 'UI/UX Designer', avatar: '', email: 'elia@tekjuice.co.uk' },
  { id: '21', name: 'Monica Cyrus', title: 'Team Lead - Kenya', avatar: '', email: 'monica@tekjuice.co.uk' },
  { id: '22', name: 'Abiya Natalie', title: 'Social Media Specialist - Kenya', avatar: '', email: 'natalie@tekjuice.co.uk' },
  { id: '23', name: 'Jean Biryahwaho', title: 'Lifestyle and Entertainment Relations Specialist', avatar: '', email: 'jean@tekjuice.co.uk' },
  { id: '24', name: 'Elisha Mugenyi', title: 'Developer', avatar: '', email: 'elisha@tekjuice.co.uk' },
  { id: '25', name: 'Ssali Emma James', title: 'Employee', avatar: '', email: 'emma@tekjuice.co.uk' },
  { id: '26', name: 'Calvin Cedric Ssali', title: 'Employee', avatar: '', email: 'ssalinivlac@gmail.com' },
  { id: '27', name: 'Thiru Kim Mungai', title: 'Sales Representative - Kenya', avatar: '', email: 'thiru@tekjuice.co.uk' },
  { id: '28', name: 'Cynthia Wangari', title: 'Brand Ambassador - Kenya', avatar: '', email: 'cynthiakarey71@gmail.com' },
  { id: '29', name: 'Anslem Seguya', title: 'Employee', avatar: '', email: 'anslembarn@gmail.com' },
  { id: '30', name: 'Steven Kawooya', title: 'Employee', avatar: '', email: 'kawooyastevenug@gmail.com' },
  { id: '31', name: 'Albert Watbin', title: 'Employee', avatar: '', email: 'albertwatbin@gmail.com' },
  { id: '32', name: 'Bernard Ewalu', title: 'Head of Lead Influencers – Africa', avatar: '', email: 'bernard@tekjuice.co.uk' },
  { id: '33', name: 'Aaron Amanya', title: 'Creative Designer', avatar: '', email: 'aaron@tekjuice.co.uk' },
  { id: '34', name: 'Joyce Biira Makoma', title: 'Product Designer', avatar: '', email: 'biira@tekjuice.co.uk' },
  { id: '35', name: 'Edward Ssemwanga', title: 'React/SPFx Development', avatar: '', email: 'edward@tekjuice.co.uk' },
  { id: '36', name: 'Fred Kwesigwa', title: 'UI/UX Designer', avatar: '', email: 'fred@tekjuice.co.uk' },
  { id: '37', name: 'Timothy Ntambi', title: 'Technical Team Lead- Tek Talent Africa', avatar: '', email: 'timothy@tekjuice.co.uk' },
  { id: '38', name: 'Ivan Odeke', title: 'Full Stack Developer', avatar: '', email: 'iodekeivan@gmail.com' },
  { id: '39', name: 'Gillian Odelle', title: 'Market Place Projects & Brand Coordination Lead', avatar: '', email: 'gillian@tekjuice.co.uk' },
  { id: '40', name: 'Victor Wandulu', title: 'UI/UX Designer: Kampala Nights and Market Place', avatar: '', email: 'wandulu@tekjuice.co.uk' },
  { id: '41', name: 'Hanifah Wanyana', title: 'Shopping Channel Host', avatar: '', email: 'hanifah@tekjuice.co.uk' },
  { id: '42', name: 'Phillip Okiror Jotham', title: 'Developer', avatar: '', email: 'p.jothamokiror@gmail.com' },
  { id: '43', name: 'Windsor Kitaka', title: 'Technical Team Lead', avatar: '', email: 'windsor@tekjuice.co.uk' },
  { id: '44', name: 'Allan Nsereko', title: 'Back End Developer', avatar: '', email: 'allan@tekjuice.co.uk' },
  { id: '45', name: 'Raymond Kalumba', title: 'Back End Developer', avatar: '', email: 'raymond@tekjuice.co.uk' },
  { id: '46', name: 'William Naluswa', title: 'Back End Developer', avatar: '', email: 'william@tekjuice.co.uk' },
  { id: '47', name: 'Obonyo Emmanuel', title: 'Front End Developer', avatar: '', email: 'emmyobonyo@tekjuice.co.uk' },
  { id: '48', name: 'May Mwagale', title: 'Technical Product Manager', avatar: '', email: 'may@tekjuice.co.uk' },
  { id: '49', name: 'Elijah Kasujja', title: 'Employee', avatar: '', email: 'elijah@tekjuice.co.uk' },
  { id: '50', name: 'Edith Ahurira', title: 'Employee', avatar: '', email: 'ahuriraedith256@gmail.com' },
  { id: '51', name: 'George Kidde', title: 'Front End Developer', avatar: '', email: 'george@tekjuice.co.uk' },
  { id: '52', name: 'Vincent Kigongo', title: 'Full Stack Developer', avatar: '', email: 'vincent@tekjuice.co.uk' },
  { id: '53', name: 'Andrew Ntwali', title: 'Full Stack Developer', avatar: '', email: 'andrew@tekjuice.co.uk' },
  { id: '54', name: 'Joel Ssekyanzi', title: 'Employee', avatar: '', email: 'ssekyanzijoel0@gmail.com' },
  { id: '55', name: 'Cletus Mugabo', title: 'IT Technician/ Support', avatar: '', email: 'cletusmug@gmail.com' },
  { id: '56', name: 'Shafik Goreh', title: 'IT Technician/ Support', avatar: '', email: 'goreh.shafik@outlook.com' },
  { id: '57', name: 'Omalla Simon Peter', title: 'IT Technician/ Support', avatar: '', email: 'omalla.simon.peter@gmail.com' },
  { id: '58', name: 'Isophel Natwijuka', title: 'Senior PHP Developer', avatar: '', email: 'isophelnatwijuka@gmail.com' },
  { id: '59', name: 'Umar Isabirye Batamye', title: 'Senior PHP Developer', avatar: '', email: 'ubatamyeonline@gmail.com' },
  { id: '60', name: 'Shanitah Atukunda', title: 'QA Tester', avatar: '', email: 'shanitah89@gmail.com' },
  { id: '61', name: 'Joel Steven Ssekywa', title: 'QA Tester', avatar: '', email: 'joelofelectronics@gmail.com' },
  { id: '62', name: 'Joshua Odera', title: 'Senior PHP Developer', avatar: '', email: 'kuteesajosh@gmail.com' },
  { id: '63', name: 'Andrew Mamawi', title: 'Senior PHP Developer', avatar: '', email: 'andrewmamawi@gmail.com' },
];


function AppRoutes() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={<Hero onVoteClick={() => navigate('/vote')} />} />
      <Route path="/vote" element={<VotingForm onBack={() => navigate('/')} />} />
      <Route path="/admin" element={<AdminLogin onLogin={() => navigate('/admin-dashboard')} onBack={() => navigate('/')} />} />
      <Route path="/admin-dashboard" element={<AdminDashboard onBack={() => navigate('/')} />} />
      <Route path="*" element={<Hero onVoteClick={() => navigate('/vote')} />} />
    </Routes>
  );
}

function App() {
  const [employees] = useState<Employee[]>(mockEmployees);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const addVote = (voteData: Omit<Vote, 'id' | 'timestamp'>) => {
    const existingVote = votes.find(vote => vote.voterId === voteData.voterId);
    if (existingVote) {
      return false;
    }
    if (voteData.voterId === voteData.employeeId) {
      return false;
    }
    const newVote: Vote = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      ...voteData
    };
    setVotes(prev => [...prev, newVote]);
    return true;
  };

  const contextValue: AppContextType = {
    employees,
    votes,
    currentUser,
    isAdmin,
    addVote,
    setCurrentUser,
    setIsAdmin
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
          <Header />
          <AppRoutes />
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;