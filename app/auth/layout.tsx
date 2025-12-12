export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        {children}
      </div>
    </div>
  );
}
