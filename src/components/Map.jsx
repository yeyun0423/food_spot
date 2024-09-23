import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
const googleMapApiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
const restaurantApiKey = import.meta.env.VITE_RESTAURANT_API_KEY;
const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 37.5665,
  lng: 126.978,
};

// 모달의 루트 요소를 설정합니다.
Modal.setAppElement("#root");

const Map = ({ location }) => {
  const [markerPosition, setMarkerPosition] = useState(center);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [review, setReview] = useState("");
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setMarker = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              address: location,
              key: googleMapApiKey,
            },
          }
        );
        console.log(response);

        if (response.data.results.length > 0) {
          const { lat, lng } = response.data.results[0].geometry.location;
          setMarkerPosition({ lat, lng });
        } else {
          setMarkerPosition(center);
        }
      } catch (error) {
        console.error("에러 발생", error);
        setMarkerPosition(center);
      }
    };
    const fetchRestaurant = async () => {
      setLoading(true);
      setItem([]);
      try {
        console.log("실행됨");
        const response = await axios.get(
          "http://api.kcisa.kr/openapi/API_CNV_063/request",
          {
            params: {
              serviceKey: restaurantApiKey,
              numOfRows: 10,
              pageNo: 1,
              areaNm: location,
              clNm: "한식",
            },
          }
        );

        if (response.data.response.body.items == null) {
          alert("맛집이 없습니다.");
        }
        setItem(response.data.response.body.items.item);
        console.log(item);
      } catch (error) {
        console.error("에러 발생 맛집 정보를 가져오는데 실패했습니다", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
    setMarker();
  }, [location]);

  const handleMarkerClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReview("");
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  return (
    <>
      {" "}
      <div className="map">
        <LoadScript googleMapsApiKey={googleMapApiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPosition}
            zoom={15}
          >
            <Marker position={markerPosition} onClick={handleMarkerClick} />
          </GoogleMap>
        </LoadScript>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel="한줄평 남기기"
          className="modal"
          overlayClassName="overlay"
        >
          <h2>한줄평 남기기</h2>
          <input
            type="text"
            value={review}
            onChange={handleReviewChange}
            placeholder="한줄평을 입력하세요"
          />
          <button onClick={handleCloseModal}>제출</button>
          <button onClick={handleCloseModal}>닫기</button>
        </Modal>
      </div>
      <ul>
        {loading ? (
          <p>로딩 중입니다...</p>
        ) : (
          item.map((item, index) => <li key={index}>{item.rstrNm}</li>)
        )}
      </ul>
    </>
  );
};

export default Map;
