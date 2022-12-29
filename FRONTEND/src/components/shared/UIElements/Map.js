import React, { useRef, useEffect } from 'react';
import './Map.css';

// need google map sdk to render google map. need credit card to avail.
// no sdk so no map shown.

const Map = (props) => {
  const mapRef = useRef();
  const { center, zoom } = props;

  // for google map.
  // will run at first but arfter jsx with return in the below lines got processed.
  // useEffect(() => {
  //   // controlled from outside this component with props.
  //   const map = new window.SVGFEMorphologyElement.maps.Map(mapRef.current, {
  //     center: center,
  //     zoom: zoom,
  //   });

  //   // to render a marker at the center of map.
  //   new window.google.maps.Marker({ position: center, map: map });
  // }, [center, zoom]);

  useEffect(() => {
    new window.ol.Map({
      target: mapRef.current.id,
      layers: [
        new window.ol.layer.Tile({
          source: new window.ol.source.OSM(),
        }),
      ],
      view: new window.ol.View({
        center: window.ol.proj.fromLonLat([center.lng, center.lat]),
        zoom: zoom,
      }),
    });
  }, [center, zoom]);

  // id prop added for openlayers map render.
  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
      id='map'
    ></div>
  );
};

export default Map;
