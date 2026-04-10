interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function AuthInput({ label, required, ...props }: AuthInputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <input
        required={required}
        className="w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 outline-none"
        {...props}
      />
    </label>
  );
}
