import {UseFormReturn} from "react-hook-form/dist/types";
import c from "classnames";
import React from "react";

interface FormInputProps {
  form: UseFormReturn,
  id?: string;
  type?: string;
  name: string;
  required?: boolean
  minLength?: number;
  maxLength?: number;
  autoComplete?: string;
  label?: string;
}

export default function FormInput({form: {register, formState}, name, id, label, ...props}: FormInputProps) {
  let input = (
    <>
      <input id={id || name} {...props}
             {...register(name, {
               required: props.required ? `'${label || name}' field is required` : false,
               minLength: props.minLength ? {
                 value: props.minLength,
                 message: `'${label || name}' field should be at least ${props.minLength} character long`
               } : undefined,
               maxLength: props.maxLength ? {
                 value: props.maxLength,
                 message: `'${label || name}' field should be less than ${props.maxLength} character long`
               } : undefined,
               pattern: props.type === 'email' ? {
                 value: /^([^\s@])+@(([^\s@.])+\.)+([^\s.]{2,})+$/i,
                 message: "Invalid email address",
               } : undefined,
             })}
             className={c(
               "appearance-none block w-full px-3 py-2 border border-gray-300",
               "rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm",
               formState.errors[name]
                 ? 'focus:border-red-500 focus:ring-red-500 border-red-400'
                 : 'focus:border-indigo-500 focus:ring-indigo-500'
             )}
      />
      {formState.errors[name] && <p className="text-xs mt-1.5 text-red-600">{formState.errors[name].message}</p>}
    </>
  );

  if (!label) return input;

  return (
    <div>
      <label htmlFor={id || name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        {input}
      </div>
    </div>
  )
}
