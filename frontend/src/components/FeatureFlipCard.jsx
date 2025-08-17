import React from 'react';
import styled from 'styled-components';

const FeatureFlipCard = ({ icon, title, description, features, showcase = [] }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="icon">{icon}</div>
        <div className="card__content">
          <p className="card__title">{title}</p>
          <p className="card__description">{description}</p>
          <ul>
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          {showcase.length > 0 && (
            <>
              <p className="showcase-heading">Showcase:</p>
              <ul>
                {showcase.map((item, idx) => (
                  <li key={`show-${idx}`}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 500px;
    height: 360px;
    background-color: rgba(30, 30, 30, 0.8);
    border-radius: 12px;
    overflow: hidden;
    perspective: 1000px;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.08);
    transition: transform 0.5s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card:hover {
    transform: scale(1.04);
    box-shadow: 0 10px 22px rgba(255, 255, 255, 0.1);
  }

  .icon {
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 3.5rem;
    color: #ffffff;
    transition: transform 0.5s ease;
  }

  .icon svg {
    width: 96px;
    height: 96px;
    fill: #ffffff;
  }

  .card:hover .icon {
    transform: scale(0);
  }

  .card__content {
    position: absolute;
    inset: 0;
    padding: 20px;
    background-color: rgba(25, 25, 25, 0.95);
    color: #f0f0f0;
    transform: rotateX(-90deg);
    transform-origin: bottom;
    transition: transform 0.5s ease;
    overflow-y: auto;
  }

  .card:hover .card__content {
    transform: rotateX(0deg);
  }

  .card__title {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }

  .card__description {
    font-size: 14px;
    margin-top: 8px;
    color: #ccc;
  }

  ul {
    padding-left: 18px;
    margin: 10px 0 0;
  }

  li {
    font-size: 13px;
    color: #aaa;
    margin-bottom: 4px;
  }

  .showcase-heading {
    margin-top: 14px;
    font-weight: 600;
    font-size: 14px;
    color: #ddd;
  }
`;

export default FeatureFlipCard;
