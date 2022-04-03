import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Plans } from "./pages/Plans";
import { Profile } from "./pages/Profile";
import { Content } from "./pages/Content";
import { ActivePlan } from "./pages/Admin/ActivePlan";
import { CreatePlan } from "./pages/Admin/CreatePlan";
import { ArchivedPlan } from "./pages/Admin/ArchivedPlan";
import { Controllers } from "./pages/Admin/Controllers";
import { NothingFoundBackground } from "./pages/ErrorPage";
import { HeaderNav } from "./components/Header";

function App() {
  const attributes = {
    links: [
      {
        link: "/",
        label: "Home",
      },
      // {
      //   link: "/register",
      //   label: "Register",
      // },
      // {
      //   link: "/features",
      //   label: "Features",
      // },
      {
        link: "/plans",
        label: "Plans",
      },
      {
        link: "/profile",
        label: "Profile",
      },
      {
        link: "/admin/active-plans",
        label: "Admin",
      },
      {
        link: "/content",
        label: "Content",
      },
    ],
  };

  return (
    <Router>
      <HeaderNav {...attributes} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/content" element={<Content />} />
        <Route path="/admin/active-plans" element={<ActivePlan />} />
        <Route path="/admin/create-plans" element={<CreatePlan />} />
        <Route path="/admin/archieved-plans" element={<ArchivedPlan />} />
        <Route path="/admin/controllers" element={<Controllers />} />

        <Route path="*" element={<NothingFoundBackground />} />
      </Routes>
    </Router>
  );
}

export default App;
