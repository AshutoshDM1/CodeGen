const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        background:
          "linear-gradient(160deg, #000 0%, #00ffd5 20%, #000 40%, #000 60%, #00ff88 80%, #000 100%)",
      }}
      className="h-full flex items-center justify-center "
    >
      {children}
    </div>
  );
};

export default AuthLayout;
