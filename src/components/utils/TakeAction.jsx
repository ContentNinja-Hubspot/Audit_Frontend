export const CheckboxGroup = ({
  activeListSelections,
  handleCheckboxChange,
  groupKey,
  options,
}) => (
  <>
    {options.map(({ label, value }) => (
      <label key={value} className="flex items-center gap-2 text-sm text-black">
        <input
          type="checkbox"
          checked={activeListSelections[groupKey]?.[value]}
          onChange={(e) =>
            handleCheckboxChange(groupKey, value, e.target.checked)
          }
          className=""
        />
        <span className="text-start truncate"> {label}</span>
      </label>
    ))}
  </>
);

export const ActionButton = ({ onClick, disabled, label }) => (
  <div className="absolute bottom-3 left-0 w-full flex justify-center">
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-[90%] px-4 py-2 text-sm font-medium text-white transition-all ${
        disabled ? "bg-gray-300 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </button>
  </div>
);
