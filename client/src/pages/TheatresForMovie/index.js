import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetMovieById } from "../../apicalls/movies";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { GetAllTheatresByMovie } from "../../apicalls/theatres";

function TheatresForMovie() {
  // get date from query string
  const tempDate = new URLSearchParams(window.location.search).get("date");
  const [date, setDate] = useState(tempDate || moment().format("YYYY-MM-DD"));

  const [movie, setMovie] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetMovieById(params.id);
      if (response.success) {
        setMovie(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getTheatres = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllTheatresByMovie({ date, movie: params.id });
      if (response.success) {
        setTheatres(response.data);
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

  useEffect(() => {
    getTheatres();
  }, [date]);

  return (
    movie && (
      <div>
        {/* movie information */}
        <div
          className="flex justify-between items-center mb-2 bg-img p-1"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)), url(${movie.poster})`,
          }}
        >
          <div className="flex gap-2 items-center p-1">
            <div style={{ width: "30%", height: "100%" }}>
              <img
                src={movie.poster}
                alt="poster"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div>
              <h1 className="text-2xl p-1 text-white">
                {movie.title} ({movie.language})
              </h1>
              <h1 className="text-md p-1 text-white">
                Duration: {movie.duration} mins
              </h1>
              <h1 className="text-md p-1 text-white">
                Release Date: {moment(movie.releaseDate).format("MMMM Do yyyy")}
              </h1>
              <h1 className="text-md p-1 text-white">Genre: {movie.genre}</h1>
            </div>
          </div>

          <div className="p-1">
            <h1 className="text-md text-white mb-1">Select Date</h1>
            <input
              type="date"
              min={moment().format("YYYY-MM-DD")}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                navigate(`/movie/${params.id}?date=${e.target.value}`);
              }}
            />
          </div>
        </div>

        <hr />

        {/* movie theatres */}
        <div className="mt-2 ml-2">
          <h1 className="text-xl">Theatres</h1>
        </div>

        <div className="mt-1 flex flex-col gap-1">
          {theatres.map((theatre) => (
            <div className="p-2">
              <div className="divider"></div>
              <h1 className="text-sm mt-1 mb-1">
                {theatre.name}: {theatre.address}
              </h1>

              <div className="flex gap-2">
                {theatre.shows
                  .sort(
                    (a, b) => moment(a.time, "HH:mm") - moment(b.time, "HH:mm")
                  )
                  .map((show) => (
                    <div
                      className="show-card p-1 cursor-pointer"
                      onClick={() => {
                        navigate(`/book-show/${show._id}`);
                      }}
                    >
                      <h1 className="text-sm">
                        {moment(show.time, "HH:mm").format("hh:mm A")}
                      </h1>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
}

export default TheatresForMovie;
