import Header from "@/modules/home/ui/components/header";
import MobileMenuButton from "@/modules/home/ui/components/header/mobile-menu-button";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {/* MobileMenuButton must live outside <header> so the drawer
          is not trapped inside the header's stacking context */}
      <MobileMenuButton />
      <main className="pt-15">{children}</main>
    </>
  );
};

export default HomeLayout;
