import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

const inputClasses =
  "w-full border border-navy-900/20 bg-white-warm px-4 py-3 text-base text-navy-900 placeholder:text-navy-700/50 focus:border-brass-500 focus:outline-2 focus:outline-offset-1 focus:outline-brass-400 aria-[invalid=true]:border-red-700";

type CommonProps = {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
};

function FieldShell({
  name,
  label,
  error,
  required,
  children,
}: CommonProps & { children: React.ReactNode }) {
  const t = useTranslations("forms");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-semibold text-navy-900">
        {label}
        {!required && (
          <span className="ml-1.5 font-normal text-navy-700/70">
            {t("optional")}
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  type = "text",
  ...props
}: CommonProps & { type?: "text" | "email" | "tel" }) {
  return (
    <FieldShell {...props}>
      <input
        id={props.name}
        name={props.name}
        type={type}
        required={props.required}
        maxLength={props.maxLength}
        autoComplete={props.autoComplete}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? `${props.name}-error` : undefined}
        className={inputClasses}
      />
    </FieldShell>
  );
}

export function TextAreaField(props: CommonProps) {
  return (
    <FieldShell {...props}>
      <textarea
        id={props.name}
        name={props.name}
        rows={5}
        required={props.required}
        maxLength={4000}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? `${props.name}-error` : undefined}
        className={cn(inputClasses, "resize-y")}
      />
    </FieldShell>
  );
}

export function SelectField({
  options,
  placeholder,
  ...props
}: CommonProps & {
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <FieldShell {...props}>
      <div className="relative">
        <select
          id={props.name}
          name={props.name}
          required={props.required}
          defaultValue=""
          aria-invalid={props.error ? true : undefined}
          aria-describedby={props.error ? `${props.name}-error` : undefined}
          className={cn(inputClasses, "appearance-none pr-11")}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="m3.5 6 4.5 4.5L12.5 6" strokeLinecap="square" />
        </svg>
      </div>
    </FieldShell>
  );
}

/** Honeypot — invisible to humans, present for bots. loadedAt lives in the
 * client form (a server-rendered Date.now() would bake the BUILD time into
 * the static HTML and neuter the time gate). */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      className="absolute -left-[9999px] h-0 overflow-hidden"
    >
      <label htmlFor="website">Website</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
