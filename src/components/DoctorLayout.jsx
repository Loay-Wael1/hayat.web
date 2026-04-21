import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Settings, Bell } from 'lucide-react';
import logo from '../assets/al_hayat_hospital_logo1.png';
const DoctorLayout = () => {
  const { user, accessToken, logout } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'Doctor') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Doctor Topbar */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'D R')}&background=0ea5e9&color=fff&rounded=true`}
              alt="Doctor Avatar"
              className="w-10 h-10 rounded-full"
            />
            <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3 text-gray-500 border-l pl-4 border-gray-200">
            <button className="hover:text-blue-600 transition-colors"><Settings size={20} /></button>
            <button className="hover:text-blue-600 transition-colors"><Bell size={20} /></button>
          </div>
        </div>

        <div className="text-xl font-bold text-blue-600 w-20">
          <img src={logo} alt="logo" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorLayout;
