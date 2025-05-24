import React from "react";

export default function LoadingBar({ loading }) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (loading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(interval);
            return 100;
          }
          return Math.min(oldProgress + 10, 100);
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [loading]);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${progress}%`, transition: "width 0.1s ease-in-out" }}
      />
    </div>
  );
}
