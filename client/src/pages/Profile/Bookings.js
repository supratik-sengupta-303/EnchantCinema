import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { Col, message, Row } from "antd";
import { useDispatch } from "react-redux";
import { GetBookingOfUser } from "../../apicalls/bookings";
import moment from "moment";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetBookingOfUser();
      if (response.success) {
        setBookings(response.data);
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
      <Row gutter={[16, 16]}>
        {bookings.map((booking) => (
          <Col span={12}>
            <div className="card p-2 flex justify-between">
              <div>
                <h1 className="text-xl">
                  {booking.show.movie.title} ({booking.show.movie.language})
                </h1>
                <div className="divider"></div>
                <p className="text-sm text-grey">
                  {booking.show.theatre.name} ({booking.show.theatre.address})
                </p>
                <p className="text-sm text-grey">
                  Date & Time: {moment(booking.show.date).format("MMM Do YYYY")}{" "}
                  - {moment(booking.show.time, "HH:mm").format("hh:mm A")}
                </p>
                <p className="text-sm text-grey">
                  Total Amount: ₹
                  {booking.show.ticketPrice * booking.seats.length}
                </p>
                <p className="text-sm text-grey">Booking ID: {booking._id}</p>
              </div>

              <div className="flex flex-col justify-between items-center">
                <img
                  src={booking.show.movie.poster}
                  alt="poster"
                  height={100}
                  width={120}
                  className="br-1"
                />
                <h1 className="text-sm">Seats: {booking.seats.join(", ")}</h1>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Bookings;
