import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ContentCalendar from './pages/ContentCalendar.jsx';
import Metrics from './pages/Metrics.jsx';
import Course from './pages/Course.jsx';
import Operations from './pages/Operations.jsx';
import Revenue from './pages/Revenue.jsx';
import CRM from './pages/CRM.jsx';
import FranVirtual from './pages/FranVirtual.jsx';
import Members from './pages/Members.jsx';
import MemberDetail from './pages/MemberDetail.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <>
      <SignedIn>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="content-calendar" element={<ContentCalendar />} />
            <Route path="metrics" element={<Metrics />} />
            <Route path="course" element={<Course />} />
            <Route path="operations" element={<Operations />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="crm" element={<CRM />} />
            <Route path="fran-virtual" element={<FranVirtual />} />
            <Route path="members" element={<Members />} />
            <Route path="members/:id" element={<MemberDetail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
