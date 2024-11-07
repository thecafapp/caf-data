const TimeInput = ({ value = "", onChange = () => { }, min = "", max = "" }) => {
  const convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
  };
  return (
    <div style={{ position: "relative" }}>
      <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="time"
        className="tremor-TextInput-input w-full bg-transparent outline-none rounded-tremor-default transition duration-100 border shadow-tremor-input dark:shadow-dark-tremor-input bg-tremor-background dark:bg-dark-tremor-background hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis border-tremor-border dark:border-dark-tremor-border text-sm focus:ring-2 focus:border-tremor-brand-subtle focus:ring-tremor-brand-muted focus:dark:border-dark-tremor-brand-subtle focus:dark:ring-dark-tremor-brand-muted"
        min={min}
        max={max}
        onChange={(e) => onChange(e)}
        value={
          value.includes("AM") || value.includes("PM")
            ? convertTime12to24(value)
            : value
        }
      />
    </div>
  );
};

export default TimeInput;
