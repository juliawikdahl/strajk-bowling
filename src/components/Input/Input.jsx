import "./Input.scss";

function Input({
  label,
  type,
  customClass,
  name,
  handleChange,
  defaultValue,
  disabled,
  maxLength,
}) {
  const inputId = `${name}-${Math.random()}`; // Generera ett unikt id för varje input

  return (
    <section className="input">
      <label htmlFor={inputId} className="input__label">{label}</label>
      <input
        id={inputId} // Koppla id till label via htmlFor
        type={type}
        className={`input__field ${customClass ? customClass : ""}`}
        name={name}
        onChange={handleChange}
        defaultValue={defaultValue ? defaultValue : ""}
        maxLength={maxLength}
        disabled={disabled}
      />
    </section>
  );
}

export default Input;
