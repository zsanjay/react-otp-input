import { useState, useRef, useEffect } from "react";
import '../App.css';

export default function OTP({ otpLength = 6 }) {
  const [optFields, setOtpFields] = useState(new Array(otpLength).fill(""));
  const ref = useRef([]);
  function handleKeyDown(e, index) {
    const key = e.key;
    if(key === "ArrowLeft") {
        if (index > 0) ref.current[index - 1].focus();
        return;
    }
    if(key === "ArrowRight") {
        if (index + 1 < optFields.length) ref.current[index + 1].focus();
        return;
    }

    const copyOtpFields = [...optFields];

    if (key === "Backspace") {
      copyOtpFields[index] = "";
      setOtpFields(copyOtpFields);

      if (index > 0) ref.current[index - 1].focus();
    }

    if (!/^\d$/.test(key)) {
      return;
    }

    copyOtpFields[index] = key;
    setOtpFields(copyOtpFields);

    if (index + 1 < optFields.length) ref.current[index + 1].focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.match(/\d/g);
    if(!digits) return;

    const nextOtp = optFields.slice();
    for(let i = 0; i < otpLength && digits.length; ++i) {
        nextOtp[i] = digits[i];
    }
    setOtpFields(nextOtp);
    const nextFocus = digits.length < otpLength ? digits.length : otpLength - 1;
    ref.current[nextFocus]?.focus();
  }

  useEffect(() => {
    ref.current[0]?.focus();
  },[]);

  return (
    <div className="container">
      {optFields.map((value, index) => {
        return (
            <input
            key={index}
            value={value}
            ref={(currentInput) => (ref.current[index] = currentInput)}
            type="text"
            maxLength={1}
            className="otp-input"
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
        />
        );
      })}
    </div>
  );
}
