/// <reference types="vite/client" />

import 'react';

declare module 'react' {
  interface FormHTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
    toolautosubmit?: string | boolean;
  }

  interface InputHTMLAttributes<T> {
    toolparamdescription?: string;
  }

  interface SelectHTMLAttributes<T> {
    toolparamdescription?: string;
  }

  interface TextareaHTMLAttributes<T> {
    toolparamdescription?: string;
  }
}
