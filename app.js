// 지도 생성
const container = document.getElementById('map');
const options = {
    center: new kakao.maps.LatLng(37.5665, 126.9780), // 초기 중심: 서울시청
    level: 4
};
const map = new kakao.maps.Map(container, options);

// 사용자 마커를 저장할 변수
let userMarker = null;

// 실시간 위치 추적
if ('geolocation' in navigator) {
    navigator.geolocation.watchPosition(
        ({ coords }) => {
            const userPos = new kakao.maps.LatLng(coords.latitude, coords.longitude);

            // 이미 마커가 있으면 위치만 이동, 없으면 새로 생성
            if (userMarker) {
                userMarker.setPosition(userPos);
            } else {
                userMarker = new kakao.maps.Marker({
                    position: userPos,
                    map: map,
                    image: new kakao.maps.MarkerImage(
                        'https://cdn-icons-png.flaticon.com/512/684/684908.png', // 사용자 위치 아이콘 (원하면 커스텀 가능)
                        new kakao.maps.Size(30, 30)
                    )
                });
            }

            // 위치 이동 시 지도 중심도 따라가게 하기 (선택사항)
            map.setCenter(userPos);
        },
        err => console.error('위치 추적 에러:', err),
        {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 10000
        }
    );
}

// 쓰레기통 마커 로드
fetch('data/bins.json')
    .then(res => res.json())
    .then(bins => {
        bins.forEach(bin => {
            const position = new kakao.maps.LatLng(bin.lat, bin.lng);
            const marker = new kakao.maps.Marker({ position, map });
            kakao.maps.event.addListener(marker, 'click', () => {
                new kakao.maps.InfoWindow({ content: bin.info }).open(map, marker);
            });
        });
    })
    .catch(err => console.error('bins.json 로드 실패:', err));
