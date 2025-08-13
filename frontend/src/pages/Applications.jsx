import ApplicationForm from '../components/forms/ApplicationForm';
import RequireAuth from '../components/RequireAuth';

const Application = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Startup Incubation Application</h1>
      <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
        Complete the form below to submit your application for our startup incubation program. 
        We will review your application and get back to you within 5 business days.
      </p>
    </div>
  );
};

export default function ProtectedApplication() {
  return (
    <RequireAuth>
      <Application />
    </RequireAuth>
  );
};
