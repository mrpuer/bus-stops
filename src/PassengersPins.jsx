import React from 'react';
import { Marker } from 'react-map-gl';

const SIZE = 20;

const PassengersPins = ({passengersPositions}) => {
  return passengersPositions.map(({ lon, lat }, index) => (
    <Marker key={`marker-${index}`} longitude={lon} latitude={lat}>
    <svg
      height={SIZE}
      viewBox="0 0 28 28"
      style={{
        fill: '#d00',
        stroke: 'none',
        transform: `translate(${-SIZE / 2}px,${-SIZE}px)`
      }}
    >
      <circle cx="14" cy="14" r="10" />
    </svg>
  </Marker>));
}

export default PassengersPins;