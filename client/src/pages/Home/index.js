import React, { useEffect, useState } from "react";
import { Col, Row, message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllMovies } from "../../apicalls/movies";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function Home() {
  const [searchText, setSearchText] = useState("");
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllMovies();
      if (response.success) {
        setMovies(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <input
        type="text"
        className="search-input"
        placeholder="Search for movies"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <Row gutter={[20]} className="mt-2">
        {movies
          .filter((movie) =>
            movie.title.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((movie) => (
            <Col span={6}>
              <div
                className="flex flex-col cursor-pointer"
                onClick={() =>
                  navigate(
                    `/movie/${movie._id}?date=${moment().format("YYYY-MM-DD")}`
                  )
                }
              >
                <img
                  src={movie.poster}
                  alt="poster"
                  height={200}
                  className="br-2"
                />

                <div className="flex flex-col justify-center p-1 ">
                  <h1 className="text-md mb-1">{movie.title}</h1>
                  <p className="text-sm text-grey">{movie.genre}</p>
                </div>
              </div>
            </Col>
          ))}
      </Row>
    </div>
  );
}

export default Home;
