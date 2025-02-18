export async function  fetchAvailablePlaces() {
    const response = await fetch('http://localhost:3000/places');
    const resData = await response.json();

    if (!response.ok) {
        throw new Error('맛집을 불러오는 데 실패했습니다.');
    }

    return resData.places;
}

export async function updateUserPlaces(places) {
    const response = await fetch('http://localhost:3000/user-places', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ places }),
    });

    if (!response.ok) {
      throw new Error('사용자 데이터 업데이트에 실패했습니다.');
    }
    return await response.json();
}

export async function fetchUserPlaces(places) {
  const response = await fetch('http://localhost:3000/user-places');
    const resData = await response.json();

    if (!response.ok) {
        throw new Error('사용자 데이터를 불러오는 데 실패했습니다.');
    }

    return resData.places;
}

