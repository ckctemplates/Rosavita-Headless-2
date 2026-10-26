/**
 * Floating-label field used by the contact form. The label is a real <label>
 * and sits inside the field until the control is focused or has a value.
 * @param {{
 *   id: string,
 *   name: string,
 *   label: string,
 *   type?: string,
 *   multiline?: boolean,
 *   defaultValue?: string,
 *   error?: string,
 *   required?: boolean,
 *   autoComplete?: string,
 *   maxLength?: number,
 *   inputMode?: 'text' | 'email' | 'tel' | 'numeric',
 *   spellCheck?: boolean,
 * }} props
 */
export function FormField({
  id,
  name,
  label,
  type = 'text',
  multiline = false,
  defaultValue = '',
  error,
  required = false,
  autoComplete,
  maxLength,
  inputMode,
  spellCheck,
}) {
  const describedBy = error ? `${id}-error` : undefined;
  const sharedProps = {
    id,
    name,
    defaultValue,
    className: 'rv-field__control',
    placeholder: ' ',
    required,
    autoComplete,
    maxLength,
    inputMode,
    spellCheck,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  };

  return (
    <div className={`rv-field${error ? ' rv-field--invalid' : ''}`}>
      {multiline ? (
        <textarea {...sharedProps} rows={8} />
      ) : (
        <input {...sharedProps} type={type} />
      )}
      <label className="rv-field__label" htmlFor={id}>
        {label}
        {required ? (
          <span className="rv-field__required" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {error ? (
        <p className="rv-field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
