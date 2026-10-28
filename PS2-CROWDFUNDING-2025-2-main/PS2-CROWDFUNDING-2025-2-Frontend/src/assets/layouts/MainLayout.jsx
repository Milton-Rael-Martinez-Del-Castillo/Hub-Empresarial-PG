import { Outlet } from "react-router-dom";
import Header from '../components/header';
import Footer from '../components/footer';
import "../../styles/MainLayout.css"; 

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main><Outlet/></main>
      <Footer />
    </div>
  );
};

export default MainLayout;
