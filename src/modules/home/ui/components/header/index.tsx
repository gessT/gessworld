import Navbar from "./navbar";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[999] bg-white dark:bg-gray-900 border-b border-border/60 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
