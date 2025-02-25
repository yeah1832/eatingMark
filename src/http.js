export async function  fetchAvailablePlaces() {
    const response = await fetch('http://localhost:3000/places');
    const resData = await response.json();

    if (!response.ok) {
        throw new Error('맛집을 불러오는 데 실패했습니다.');
    }

    return resData.places;
}

export async function fetchUserPlaces(places) {
  const response = await fetch('http://localhost:3000/users/places');
    const resData = await response.json();

    if (!response.ok) {
        throw new Error('사용자 데이터를 불러오는 데 실패했습니다.');
    }

    return resData.places;
}

export async function addOrUpdateUserPlace(place) {
  const response = await fetch('http://localhost:3000/users/places', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ place }),
  });

  if (!response.ok) {
    throw new Error('사용자 데이터 업데이트에 실패했습니다.');
  }

  return await response.json();
}

export async function deleteUserPlace(placeId) {
  const response = await fetch(`http://localhost:3000/users/places/${placeId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('사용자 데이터를 삭제하는 데 실패했습니다.');
  }

  // 204 응답이면 JSON이 없으므로 null 반환
  return response.status === 204 ? null : await response.json();
}