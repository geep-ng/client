import { useCallback, useState } from "react";

/** Waitlist Sign-Up Section */
const Waitlist: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // NOTE: In a real application, this would call a Firebase Firestore function or API endpoint
    // to save the email for the waitlist.
    console.log(`Submitting email to waitlist: ${email}`);

    // Mock API Call
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    setStatus('success');
    setEmail('');

    // Error handling example:
    // setStatus('error');
    // console.error("Waitlist submission failed.");

  }, [email]);

  return (
    <section id="waitlist" className="py-20 bg-blue-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-4xl font-extrabold mb-4">Ready to Lead? Join the Waitlist!</h2>
        <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
          Be the first to get exclusive access to empowerment opportunities, training, and Ambassador enrollment when GEEP officially launches.
        </p>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-lg text-gray-800 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              disabled={status === 'submitting' || status === 'success'}
            />
            <button
              type="submit"
              className="w-full sm:w-auto p-4 bg-yellow-400 text-blue-900 rounded-lg font-bold hover:bg-yellow-500 transition duration-300 shadow-md flex items-center justify-center"
              disabled={status === 'submitting' || status === 'success'}
            >
              {status === 'submitting' ? (
                <svg className="animate-spin h-5 w-5 text-blue-900 mr-3" viewBox="0 0 24 24">...</svg>
              ) : status === 'success' ? (
                'Joined!'
              ) : (
                'Sign Me Up'
              )}
            </button>
          </div>
          {status === 'success' && (
            <p className="text-green-600 mt-3 text-sm font-semibold">Success! We will notify you before the launch.</p>
          )}
          {status === 'error' && (
            <p className="text-red-600 mt-3 text-sm font-semibold">There was an error. Please try again.</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Waitlist