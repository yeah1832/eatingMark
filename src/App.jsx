import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { fetchUserPlaces, addOrUpdateUserPlace, deleteUserPlace } from './http.js';
import ErrorPage from '../src/components/ErrorPage.jsx';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    async function  fetchPlaces() {
      setIsFetching(true);
      try{
        const places = await fetchUserPlaces();
        setUserPlaces(places);
      } catch (error){
        setError({message: error.message || '사용자 맛집을 불러오는데 실패했습니다.'})
      }
      setIsFetching(false);
    }
    fetchPlaces();
  }, [])

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await addOrUpdateUserPlace(selectedPlace);
    } catch (error) {
        setUserPlaces(userPlaces);
        setErrorUpdatingPlaces({message: error.message || "맛집 업데이트에 실패했습니다."});
    }
  }

  const handleRemovePlace = useCallback(async () => {
    const placeIdToRemove = selectedPlace.current.id;

    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== placeIdToRemove)
    );

    try {
      // DELETE 요청을 통해 장소 삭제
      await deleteUserPlace(placeIdToRemove);
    } catch (error) {
      setErrorUpdatingPlaces({
        message: error.message || '맛집 삭제에 실패했습니다.',
      });
    }

    setModalIsOpen(false);
  }, []);


  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
      {errorUpdatingPlaces && 
        <ErrorPage 
        title="에러가 발생했습니다!"
        message={errorUpdatingPlaces.message}
        onConfirm={handleError}
       />
      }
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>오늘 뭐먹지?</h1>
        
      </header>
      <main>
        {error && <Error title="에러가 발생했습니다!" message={error.message}/>}
        {!error && (
          <Places
          title="저장된 맛집"
          fallbackText="방문하고 싶은 맛집을 선택하세요!"
          isLoading={isFetching}
          loadingText="장소를 불러오는 중입니다."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        )}
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
