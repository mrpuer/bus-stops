import React from 'react';
import './App.css';
import MapGL, { Popup } from 'react-map-gl';
import DeckGL, { LineLayer } from 'deck.gl';
import PassengersPins from './PassengersPins';
import StopsPins from './StopsPins';
import passengers from './data/passengers.json';
import stops from './data/stops.json';

const TOKEN = 'pk.eyJ1IjoicHVlciIsImEiOiJja2hxbzhoZHUwdmN1MnNwNXIzNTBhZ2d3In0.KnEkUOx5B2KVhG5Fpy_cdg';

const initVPState = {
  latitude: 45.51273196882052,
  longitude: -73.57225475633703,
  zoom: 15,
  bearing: 0,
  pitch: 0
}

const getPointsDistance = (p1, p2) => {
  return Math.sqrt(((p2.lon - p1.lon) ** 2) + ((p2.lat - p1.lat) ** 2))
}

const stopsPassengersCount = new Array(stops.length).fill(0);

const passengersNearestStopLocations = passengers.map((passenger) => {
  let nearestValue = getPointsDistance(passenger, stops[0]);
  let nearestStopIdx = 0;
  stops.forEach((stop, stopIdx) => {
    const passengerToStopDistance = getPointsDistance(passenger, stop);
    if (passengerToStopDistance < nearestValue) {
      nearestValue = passengerToStopDistance;
      nearestStopIdx = stopIdx;
    }
  });
  stopsPassengersCount[nearestStopIdx] += 1;
  return {
    sourcePosition: [passenger.lon, passenger.lat],
    targetPosition: [stops[nearestStopIdx].lon, stops[nearestStopIdx].lat],
  }
}, []);

function App() {
  const [viewport, setVP] = React.useState(initVPState);
  const [currentPopup, setCurrentPopup] = React.useState(null);

  const renderPopup = () => {
    return currentPopup ? (
      <Popup
        tipSize={5}
        anchor="top"
        longitude={currentPopup.lon}
        latitude={currentPopup.lat}
        closeOnClick={false}
        onClose={() => setCurrentPopup(null)}
      >
        <span className="popupContent">There are {stopsPassengersCount[currentPopup.index]} nearest passengers to this stop</span>
      </Popup>
    ) : null;
  }

  const clickStopMarkerHandler = (idx) => {
    setCurrentPopup(idx);
  };

  return (
    <div className="App">
      <main>
        <MapGL
          {...viewport}
          width="100vw"
          height="100vh"
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxApiAccessToken={TOKEN}
          onViewportChange={(viewport) => {
            console.log(viewport)
            setVP(viewport);
          }}
        >
          <DeckGL
            viewState={viewport}
            layers={[
              new LineLayer({
                data: passengersNearestStopLocations,
                strokeWidth: 32,
              })
            ]}
          />
          <PassengersPins passengersPositions={passengers} />
          <StopsPins stopsPositions={stops} onClick={clickStopMarkerHandler} />
          {renderPopup()}
        </MapGL>
      </main>
    </div>
  );
}

export default App;
