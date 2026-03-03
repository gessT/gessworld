import MobileMenuButton from "./mobile-menu-button";
import Navbar from "./navbar";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto">
        <Navbar />
      </div>
      <MobileMenuButton />
    </header>
  );
};

export default Header;
