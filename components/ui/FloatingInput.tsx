
import React, { InputHTMLAttributes } from 'react';

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  Icon?: React.ElementType;
}

const FloatingInput: React.FC<FloatingInputProps> = ({ label, id, Icon, ...props }) => {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />}
      <input
        id={id}
        className={`block px-4 py-3 w-full text-sm text-white bg-transparent rounded-lg border border-white/30 appearance-none focus:outline-none focus:ring-0 focus:border-teal-400 peer ${Icon ? 'pl-10' : ''}`}
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-slate-900/50 px-2 peer-focus:px-2 peer-focus:text-teal-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 ${Icon ? 'left-9' : 'left-1'}`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;