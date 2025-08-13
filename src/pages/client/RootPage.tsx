import { Outlet } from "react-router-dom";
import Header from "@/pages/common/Header";
import Footer from "@/pages/common/Footer";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { useEffect } from "react";
import { getCurrentUserSession } from "@/features/slices/authThunk";
const RootPage = () => {
  const dispatch = useAppDispatch();
  const { isLogin } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isLogin) dispatch(getCurrentUserSession());
  }, [dispatch, isLogin]);

  return (
    <div className="min-w-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootPage;
