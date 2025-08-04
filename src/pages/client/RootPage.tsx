import { Outlet } from "react-router-dom";
import Header from "./common/Header";
import Footer from "./common/Footer";
const RootPage = () => {
  return (
    <div className="min-w-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootPage;
