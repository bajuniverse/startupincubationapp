const Unauthorized = () => {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded text-center">
      <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
      <p className="mb-4">
        You don't have permission to access this page. Only administrators can view and manage applications.
      </p>
      <a href="/" className="text-blue-600 hover:underline">
        Return to Home
      </a>
    </div>
  );
};

export default Unauthorized;