import React from "react";

export const Ticket = (props) => {
  const formatId = (_planId) => {
    if (_planId.length > 3) {
      return _planId;
    } else if (_planId.length > 2) {
      return `0${_planId}`;
    } else if (_planId.length > 1) {
      return `00${_planId}`;
    } else if (_planId.length > 0) {
      return `000${_planId}`;
    }
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="500" height="300">
      <path
        fill="url(#a)"
        d="M10,0 h480 a10,10 0 0 1 10,10 v280 a10,10 0 0 1 -10,10 h-480 a10,10 0 0 1 -10,-10 v-280 a10,10 0 0 1 10,-10 z"
      />
      <defs>
        <filter
          id="b"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
          height="300"
          width="500"
        >
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="2"
            flood-opacity=".225"
            width="0%"
            height="0%"
          />
        </filter>
      </defs>
      <svg x="10" y="5">
        <path
          filter="url(#b)"
          fill="#fff"
          d="M72.863 42.949a4.382 4.382 0 0 0-4.394 0l-10.081 6.032-6.85 3.934-10.081 6.032a4.382 4.382 0 0 1-4.394 0l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616 4.54 4.54 0 0 1-.608-2.187v-9.31a4.27 4.27 0 0 1 .572-2.208 4.25 4.25 0 0 1 1.625-1.595l7.884-4.59a4.382 4.382 0 0 1 4.394 0l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616 4.54 4.54 0 0 1 .608 2.187v6.032l6.85-4.065v-6.032a4.27 4.27 0 0 0-.572-2.208 4.25 4.25 0 0 0-1.625-1.595L41.456 24.59a4.382 4.382 0 0 0-4.394 0l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595 4.273 4.273 0 0 0-.572 2.208v17.441a4.27 4.27 0 0 0 .572 2.208 4.25 4.25 0 0 0 1.625 1.595l14.864 8.655a4.382 4.382 0 0 0 4.394 0l10.081-5.901 6.85-4.065 10.081-5.901a4.382 4.382 0 0 1 4.394 0l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616 4.54 4.54 0 0 1 .608 2.187v9.311a4.27 4.27 0 0 1-.572 2.208 4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721a4.382 4.382 0 0 1-4.394 0l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616 4.53 4.53 0 0 1-.608-2.187v-6.032l-6.85 4.065v6.032a4.27 4.27 0 0 0 .572 2.208 4.25 4.25 0 0 0 1.625 1.595l14.864 8.655a4.382 4.382 0 0 0 4.394 0l14.864-8.655a4.545 4.545 0 0 0 2.198-3.803V55.538a4.27 4.27 0 0 0-.572-2.208 4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z"
        />
      </svg>
      <defs>
        <linearGradient
          id="a"
          x1="0"
          y1="0"
          x2="100%"
          y2="0%"
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(55)"
        >
          <stop offset=".1" stop-color="#8A2387" stop-opacity=".98" />
          <stop offset=".8" stop-color="#E94057" stop-opacity=".98" />
          <stop offset="1" stop-color="#F27121" stop-opacity=".98" />
        </linearGradient>
      </defs>
      <svg x="385" y="190" width="90" height="90">
        <path
          filter="url(#b)"
          fill="#fff"
          d="M53.58 5.449a30.484 30.484 0 0 0-7.916 1.044c-8.648 2.32-20.517 9.648-29.35 18.704C7.481 34.253 1.834 44.89 4.19 53.696c2.413 9.015 11.38 17.54 22.072 23.065 10.692 5.526 23.024 7.987 31.481 5.719C66.2 80.211 74.681 72.205 80.27 62.336c5.589-9.868 8.246-21.498 5.806-30.613C81.847 15.914 68.183 5.445 53.581 5.449zm-2.439 5.652c4.202.062 7.556 1.45 9.069 4.142 3.026 5.384-2.461 13.959-12.261 19.155-9.799 5.195-20.199 5.038-23.225-.346s2.467-13.96 12.266-19.155c4.9-2.598 9.949-3.858 14.15-3.796zm30.932 21.561c4.564 17.053-9.89 41.975-25.856 46.258-9.708 2.605-23.929-1.361-34.612-8.701 24.023 10.918 56.274 2.1 60.469-37.557zm-65.066 3.505a6.634 6.634 0 0 1 6.636 6.636 6.638 6.638 0 1 1-13.277 0 6.638 6.638 0 0 1 6.641-6.636z"
        />
      </svg>
      <text
        x="315"
        y="60"
        font-size="40"
        fill="#fff"
        filter="url(#b)"
        font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif"
        font-weight="bold"
      >
        subTree
      </text>
      <text
        x="183"
        y="93"
        font-size="23"
        fill="#fff"
        filter="url(#b)"
        font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif"
        font-weight="bold"
      >
        Subscriptions Made Easy
      </text>
      <text
        x="25"
        y="230"
        font-size="38"
        fill="#fff"
        filter="url(#b)"
        font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif"
        font-weight="bold"
      >
        DinoLabs
      </text>
      <text
        x="25"
        y="270"
        font-size="28"
        fill="#fff"
        filter="url(#b)"
        font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif"
        font-weight="bold"
      >
        #{formatId(props.id)}
      </text>
    </svg>
  );
};
