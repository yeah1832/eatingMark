import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import ErrorPage from './ErrorPage.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js'

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try { 
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
        const sortedPlaces = sortPlacesByDistance(
          places, 
          position.coords.latitude,
          position.coords.longitude
        );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError('장소를 불러오지 못했습니다. 다시 시도해주세요.');
        setIsFetching(false);
      }
    }
    fetchPlaces();
    }, [])
  
    if (error) {
      return <ErrorPage title="에러가 발생했습니다!" message={error.message}/>
    }
  return (
    <Places
      title="맛집 목록"
      places={availablePlaces}
      loadingText="데이터를 불러오는 중입니다..."
      isLoading={isFetching}
      fallbackText="데이터가 없습니다."
      onSelectPlace={onSelectPlace}
    />
  );
}
