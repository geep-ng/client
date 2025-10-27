import { useEffect, useMemo, useState } from "react";

/** Defines the structure for the countdown time remaining */
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// The official launch target date (e.g., Q1 2027 for the 2027 bid)
const LAUNCH_DATE = new Date('2027-01-01T00:00:00'); 

/** Calculates time remaining until the launch date */
const calculateTimeLeft = (): TimeLeft => {
  const difference = +LAUNCH_DATE - +new Date();
  let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

/** Project Launch Countdown component */
const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timerComponents = useMemo(() => {
    return Object.entries(timeLeft).map(([unit, value]) => (
      <div key={unit} className="flex flex-col items-center p-2 md:p-6 bg-white rounded-2xl shadow-xl transition hover:shadow-2xl transform hover:-translate-y-1">
        <span className=" text-xl md:text-5xl font-extrabold text-blue-700">{value.toString().padStart(2, '0')}</span>
        <span className=" text-sm md:text-base font-medium text-gray-500 uppercase mt-2">{unit}</span>
      </div>
    ));
  }, [timeLeft]);

  const isLaunched = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <section id="countdown" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">GEEP Launching Soon!</h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          We are counting down to the official launch of the portal on **{LAUNCH_DATE.toLocaleDateString()}**. Get ready to connect, learn, and lead.
        </p>
        
        <div className="flex justify-center space-x-4 sm:space-x-8">
          {isLaunched ? (
            <div className="text-3xl font-bold text-green-600 p-8 bg-white rounded-xl shadow-lg">The Portal is Live!</div>
          ) : (
            timerComponents
          )}
        </div>
      </div>
    </section>
  );
};

export default Countdown;