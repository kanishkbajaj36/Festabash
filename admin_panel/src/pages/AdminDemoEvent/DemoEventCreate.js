import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import "./DemoEventCreate.css";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";
import Swal from "sweetalert2";
import { baseUrl } from "../../features/Api/BaseUrl";
import axios from "axios";

import { Divider } from "@mui/material";

const variants = [
  {
    id: 1,
    name: "Office",
  },
  {
    id: 2,
    name: "Workshop ",
  },
  {
    id: 3,
    name: "Site",
  },
];

const DemoEventCreate = () => {
  const [eventType, setEventType] = React.useState("");
  const [demoEventErr, setDemoEventErr] = React.useState(false);

  const [fileInputKey, setFileInputKey] = useState(Date.now()); // To clear the file input field

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [preImages, setPreImages] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;

    // Update the state with selected images
    setImages((prevImages) => [...prevImages, ...selectedFiles]);

    // Generate preview for selected images
    const previewList = Array.from(selectedFiles).map((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        setPreviewImages((prevPreviews) => [
          ...prevPreviews,
          { id: file.name, src: event.target.result },
        ]);
      };

      reader.readAsDataURL(file);

      return null; // Preventing a warning since map expects a return
    });
  };

  const handleRemoveImage = (id) => {
    // Remove image from state and preview
    setImages((prevImages) => prevImages.filter((image) => image.name !== id));
    setPreviewImages((prevPreviews) =>
      prevPreviews.filter((preview) => preview.id !== id)
    );
  };
  const [inputArr, setInputArr] = useState([]);
  const [inputData, setInputData] = useState({
    title: "",
    event_type: "",
    description: "",
    venue_name: "",
    location: "",
    date: "",
    start_time: "",
    end_time: "",
  });

  const [variantName, setVariantName] = React.useState([]);
  const [dropDown, setDropDown] = React.useState("");
  const [postSummited, setPostSummited] = useState(false);
  const navigate = useNavigate();

  const handleChangeDropDown = (event) => {
    setDropDown(event.target.value);
  };
  const dataSubmit = () => {
    if (!name) {
      alert("please fields inputfield");
    } else {
      setPostSummited(true);
    }
  };

  let name, value;
  const submitInputdata = (e) => {
    console.log(e.target.value);
    name = e.target.name;
    value = e.target.value;
    setInputData({ ...inputData, [name]: value });
  };

  const localStorageValue = localStorage.getItem("id");

  const submitFormData = () => {
    if (
      inputData.title === "" ||
      inputData.description === "" ||
      eventType === "" ||
      images.length === 0 || // Check if images array is empty
      inputData.venue_name === "" ||
      inputData.location === "" ||
      inputData.date === "" ||
      inputData.start_time === "" ||
      inputData.end_time === "" // Check if end_time is empty
    ) {
      setDemoEventErr(true);
      return;
    }

    // Create an array of objects for venue_Date_and_time
    const venueDateTimeArray = [
      {
        sub_event_title: inputData.title,
        venue_Name: inputData.venue_name,
        venue_location: inputData.location,
        date: inputData.date,
        start_time: inputData.start_time,
        end_time: inputData.end_time,
      },
    ];

    var bodyFormData = new FormData();
    bodyFormData.append("title", inputData?.title);
    bodyFormData.append("description", inputData?.description);
    bodyFormData.append("event_Type", eventType);
    bodyFormData.append(
      "venue_Date_and_time",
      JSON.stringify(venueDateTimeArray)
    ); // Convert array to JSON string and append to FormData

    for (let i = 0; i < images.length; i++) {
      const image = images[i].file; // Access the image file
      bodyFormData.append(`images`, image, image.name);
    }

    for (var pair of bodyFormData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    axios
      .post(`${baseUrl}create_DemoEvent/${localStorageValue}`, bodyFormData)
      .then((response) => {
        Swal.fire(
          "Demo Event Create successfully!",
          "You clicked the button!",
          "success"
        );
        navigate("/admin");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function changeHandle(e) {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  }
  let { item, quantity, mru } = inputData;
  function addItem() {
    setInputArr([...inputArr, { item, quantity, mru }]);

    setInputData({
      item: "",
      quantity: "",
      mru: "",
    });
  }
  const handleFileSelect = (event) => {
    const files = event.target.files;
    console.log(files);

    const imageList = [];
    setPreImages((prevImages) => [...prevImages, ...imageList]);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.startsWith("image/")) {
        imageList.push({
          id: Date.now() + i, // Generate a unique ID
          file,
        });
      }
    }

    setImages((prevImages) => [...prevImages, ...imageList]);
    setFileInputKey(Date.now()); // Clear the file input field
  };

  const handleChange = (event) => {
    setEventType(event.target.value);
  };
  const handleDelete = (id) => {
    // Remove image from state and preview
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
    setPreviewImages((prevPreviews) =>
      prevPreviews.filter((preview) => preview.id !== id)
    );
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="Add-request-bg">
            <h6 className="text-center add-invoice-style">Add Demo Event </h6>

            <div className="row">
              <div className="col-6">
                <span style={{ color: "red" }}>
                  {demoEventErr && !inputData.title
                    ? "*Please Enter  Your Title!"
                    : ""}
                </span>
                <TextField
                  fullWidth
                  className="w-100"
                  type="text"
                  label="Title"
                  size="normal"
                  name="title"
                  value={inputData.title}
                  onChange={submitInputdata}
                />
              </div>
              <div className="col-6">
                <span style={{ color: "red" }}>
                  {demoEventErr && !eventType
                    ? "*Please Select  Your Type!"
                    : ""}
                </span>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Title Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={eventType}
                      label="Title Type"
                      onChange={handleChange}
                    >
                      <MenuItem value="Business_Conference">
                        Business_Conference
                      </MenuItem>
                      <MenuItem value="Music_Festivals">
                        Music_Festivals
                      </MenuItem>
                      <MenuItem value="Birthday">Birthday</MenuItem>
                      <MenuItem value="Exhibitions">Exhibitions</MenuItem>
                      <MenuItem value="Wedding_Anniversary">
                        Wedding_Anniversary
                      </MenuItem>
                      <MenuItem value="sports">sports</MenuItem>
                      <MenuItem value="marriage">marriage</MenuItem>
                      <MenuItem value="Demo">Demo</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <span style={{ color: "red" }}>
                  {demoEventErr && !inputData.description
                    ? "*Please Enter  Your Description!"
                    : ""}
                </span>
                <TextField
                  className="mb-1 mt-3 w-100"
                  id="outlined-multiline-static"
                  label=" Description"
                  multiline
                  rows={4.5}
                  type="text"
                  name="description"
                  value={inputData.description}
                  onChange={submitInputdata}
                  fullWidth
                />
              </div>
              <div className="col-6">
                <span style={{ color: "red" }}>
                  {demoEventErr && images.length === 0
                    ? "*Please Upload  Your Images!"
                    : ""}
                </span>
                <h6 className="mt-2">Upload Event Image</h6>
                <div>
                  <input
                    type="file"
                    key={fileInputKey}
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                  />

                  <div className="image-container">
                    {images.map((image, i) => (
                      <div key={i} className="image-item">
                        <img
                          src={URL.createObjectURL(image.file)}
                          alt={image.file.name}
                        />
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(image.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <br />
            <br />
            <Divider className="divider-style" />
            <br />
            <div className="row ">
              <h6>Venue Date and VEnue Time:</h6>

              <div className="col-6">
                <span style={{ color: "red" }}>
                  {demoEventErr && !inputData.venue_name
                    ? "*Please Enter  Your Venue !"
                    : ""}
                </span>
                <TextField
                  fullWidth
                  className="w-100 mt-2 "
                  type="text"
                  label=" Event Name"
                  name="venue_name"
                  value={inputData.venue_name}
                  onChange={submitInputdata}
                  autoComplete="off"
                />
              </div>
              <div className="col-6">
                <span style={{ color: "red" }}>
                  {demoEventErr && !inputData.location
                    ? "*Please Enter  Your Location!"
                    : ""}
                </span>
                <TextField
                  fullWidth
                  className="w-100 mt-2"
                  type="text"
                  label="Location"
                  name="location"
                  value={inputData.location}
                  onChange={submitInputdata}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="row ">
              <div className="col-6">
                <span style={{ color: "red" }}>
                  {demoEventErr && !inputData.date
                    ? "*Please Select Your Date!"
                    : ""}
                </span>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Date"
                      className="w-100 mt-2"
                      onChange={(newValue) =>
                        setInputData({
                          ...inputData,
                          date: moment(newValue.$d).format("YYYY-MM-DD"),
                        })
                      }
                      renderInput={(props) => <TextField {...props} />}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>

              <div className="col-6">
                <span style={{ color: "red" }}>
                  {demoEventErr && !inputData.start_time
                    ? "*Please Select  Your Start Time!"
                    : ""}
                </span>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker"]}>
                    <TimePicker
                      label="Start Time"
                      className="w-100 mt-2"
                      onChange={(newValue) =>
                        setInputData({
                          ...inputData,
                          start_time: moment(newValue.$d).format("HH:mm:ss"),
                        })
                      }
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
            <div className="row ">
              <div className="col-6">
                <span style={{ color: "red" }}>
                  {demoEventErr && !inputData.end_time
                    ? "*Please Select Your End Time!"
                    : ""}
                </span>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker"]}>
                    <TimePicker
                      label="End Time"
                      className="w-100 mt-2"
                      onChange={(newValue) =>
                        setInputData({
                          ...inputData,
                          end_time: moment(newValue.$d).format("HH:mm:ss"),
                        })
                      }
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>

            <div className="col-12 d-flex justify-content-center ">
              <button className="submit-btn-style  " onClick={submitFormData}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DemoEventCreate;
