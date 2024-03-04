import "./App.css";
import { BrowserRouter as Router, Routes, Route, Form } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login";
import Forgotpassword from "./pages/Forgotpassword";
import MainLayout from "./components/MainLayout";
import TearmandCondition from "../src/pages/TearmAndConditions/TearmandCondition";
import PrivacyPolicy from "../src/pages/PrivacyPolicy/PrivacyPolicy";
import MyProfile from "./pages/MyProfile";
import ChangePassword from "./pages/ChangePassword";
import Protected from "./pages/Protected";
import ResetPassword from "./pages/ResetPassword";
import PageNotFound from "./pages/PageNotFound";
import Cancellation_Policy from "../src/pages/CancelationPolicy/Cancellation_Policy";
import ContactPage from "./pages/ContactUsPage/ContactPage";
import ManagesUsersList from "./pages/ManagesUsers/ManagesUsersList";
import NotificationList from "./pages/NotificationPush/NotificationList";
import UserDetails from "./pages/ManagesUsers/UserDetails";
import ManagesEventList from "./pages/ManagesEvent/ManagesEventList";
import UserFeedbackList from "./pages/Feedback/UserFeedbackList";
import AdminDemoList from "./pages/AdminDemoEvent/AdminDemoList";
import EventDemoDetails from "./pages/AdminDemoEvent/EventDemoDetails";
import DemoEventCreate from "./pages/AdminDemoEvent/DemoEventCreate";
import EventDetails from "./pages/ManagesEvent/EventDetails";
function App() {
  return (
    <Router basename="festabash">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/admin" element={<Protected Component={MainLayout} />}>
          <Route index element={<Dashboard />} />
          <Route
            path="admin-demo-list/demo-event-create"
            element={<DemoEventCreate />}
          />
          <Route path="*" element={<PageNotFound />} />
          <Route path="Cancelation-Policy" element={<Cancellation_Policy />} />
          <Route path="event-detail" element={<EventDetails />} />
          <Route path="user-detail" element={<UserDetails />} />
          <Route path="demo-event-details" element={<EventDemoDetails />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="admin-demo-list" element={<AdminDemoList />} />
          <Route path="notification" element={<NotificationList />} />
          <Route path="contact-us-list" element={<ContactPage />} />
          <Route path="terms-conditions" element={<TearmandCondition />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="user-feedback-list" element={<UserFeedbackList />} />
          <Route path="event-list" element={<ManagesEventList />} />
          <Route path="users-list" element={<ManagesUsersList />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;

// pazination code- https://codesandbox.io/s/create-pagination-in-react-js-using-reacthooks-cgq18?from-embed=&file=/src/App.js:854-869
