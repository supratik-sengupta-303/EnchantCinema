import React from "react";
import { Col, Form, Modal, Row, message } from "antd";
import Button from "../../components/Button";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { AddMovie, UpdateMovie } from "../../apicalls/movies";
import moment from "moment";

function MovieForm({
  showMovieFormModal,
  setShowMovieFormModal,
  selectedMovie,
  setSelectedMovie,
  getData,
  formType,
}) {
  if (selectedMovie) {
    selectedMovie.releaseDate = moment(selectedMovie.releaseDate).format(
      "YYYY-MM-DD"
    );
  }

  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;

      if (formType === "add") {
        response = await AddMovie(values);
      } else {
        response = await UpdateMovie({
          ...values,
          movieId: selectedMovie._id,
        });
      }

      if (response.success) {
        getData();
        message.success(response.message);
        setShowMovieFormModal(false);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <Modal
      title={formType === "add" ? "Add Movie" : "Edit Movie"}
      open={showMovieFormModal}
      onCancel={() => {
        setShowMovieFormModal(false);
        setSelectedMovie(null);
      }}
      footer={null}
      width={800}
    >
      <Form layout="vertical" onFinish={onFinish} initialValues={selectedMovie}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Movie Name"
              name="title"
              rules={[{ required: true, message: "Please input movie name!" }]}
            >
              <input type="text" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Movie Description"
              name="description"
              rules={[{ required: true, message: "Please input description!" }]}
            >
              <textarea type="text" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Movie Duration (mins)"
              name="duration"
              rules={[{ required: true, message: "Please input duration!" }]}
            >
              <input type="number" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Language"
              name="language"
              rules={[{ required: true, message: "Please input language!" }]}
            >
              <select name="" id="">
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bengali">Bengali</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
              </select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Movie Release Date"
              name="releaseDate"
              rules={[
                { required: true, message: "Please input release date!" },
              ]}
            >
              <input type="date" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Genre"
              name="genre"
              rules={[{ required: true, message: "Please input genre!" }]}
            >
              <select name="" id="">
                <option value="">Select Genre</option>
                <option value="Action">Action</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Drama">Drama</option>
                <option value="Comedy">Comedy</option>
                <option value="Romance">Romance</option>
              </select>
            </Form.Item>
          </Col>

          <Col span={16}>
            <Form.Item
              label="Poster URL"
              name="poster"
              rules={[{ required: true, message: "Please input poster link!" }]}
            >
              <input type="text" />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-1">
          <Button
            title="Cancel"
            variant="outlined"
            type="button"
            onClick={() => {
              setShowMovieFormModal(false);
              setSelectedMovie(null);
            }}
          />
          <Button title="Save" type="submit" />
        </div>
      </Form>
    </Modal>
  );
}

export default MovieForm;
