import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  .form-control {
    position: relative;
    width: 100%;
  }

  .input {
    color: #fff;
    font-size: 0.9rem;
    background-color: transparent;
    width: 100%;
    box-sizing: border-box;
    padding: 0.7em 0.5em;
    border: none;
    border-bottom: 2px solid #555;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .input-border {
    position: absolute;
    background: linear-gradient(90deg, #FF6464 0%, #FFBF59 50%, #47C9FF 100%);
    height: 2px;
    bottom: 0;
    left: 0;
    width: 0%;
    transition: width 0.3s ease;
  }

  .input:focus {
    outline: none;
  }

  .input:focus + .input-border {
    width: 100%;
  }
`;

const FancyInput = ({ value, onChange, onEnter }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        onEnter();
      }
    };

    const currentInput = inputRef.current;
    if (currentInput) {
      currentInput.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (currentInput) {
        currentInput.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [onEnter]);

  return (
    <StyledWrapper>
      <div className="form-control">
        <input
          ref={inputRef}
          className="input"
          placeholder="Type something intelligent"
          required
          type="text"
          value={value}
          onChange={onChange}
        />
        <span className="input-border" />
      </div>
    </StyledWrapper>
  );
};

export default FancyInput;
