const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600 to-black">
      {children}
    </div>
  );
};

export default UserLayout;
