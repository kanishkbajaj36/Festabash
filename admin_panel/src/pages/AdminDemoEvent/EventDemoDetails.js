import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "./EventDemoDetails.css";
import moment from "moment";
import Rating from "@mui/material/Rating";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CommentIcon from "@mui/icons-material/Comment";
import AttachmentIcon from "@mui/icons-material/Attachment";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Divider from "@mui/material/Divider";
import { useLocation } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";

import axios from "axios";
import { baseUrl } from "../../features/Api/BaseUrl";
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function EventDemoDetails() {
  const [rows, setRows] = useState([]);
  const [sliderImageUrl, setSliderImageUrl] = useState([]);
  const [guestList, setGuestList] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);

  const [venueList, setVenueList] = useState([]);
  const [cohostList, setCoHostList] = useState([]);

  const [rating, setRating] = useState();
  const location = useLocation();
  console.log(location.state);

  const selectedUser = location.state.response.filter((item) => {
    return item._id === location.state.id;
  });

  const getData = selectedUser[0];
  console.log(getData.images);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setSliderImageUrl(getData.images);
    setGuestList(getData.Guests);
    setVenueList(getData.venue_Date_and_time);
    setCoHostList(getData.co_hosts);
  }, [
    getData.images,
    getData.Guests,
    getData.venue_Date_and_time,
    getData.co_hosts,
  ]);

  return (
    <>
      <div className="main_div">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-12">
              {sliderImageUrl && sliderImageUrl.length > 0 ? (
                <img
                  alt="not found"
                  className="rounded-circle mt-5"
                  width="150px"
                  src={`http://13.51.205.211:6002/${sliderImageUrl[0]}`}
                />
              ) : (
                <img
                  alt="not found"
                  className="rounded-circle mt-5"
                  width="150px"
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                />
              )}
            </div>
            <div className="col-lg-9 col-md-9 col-sm-12">
              <div className="row">
                <h4 className="mt-3 host_style">Event </h4>
              </div>
              <div className="row">
                <div className="col-12">
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                      >
                        <Tab label="Event Detais" {...a11yProps(0)} />
                        <Tab label="Guest List" {...a11yProps(1)} />
                        <Tab label="Venue" {...a11yProps(2)} />
                        <Tab label="Co-Host" {...a11yProps(3)} />
                        <Tab label="Photos" {...a11yProps(4)} />
                      </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                      <div className="container">
                        <div className="row">
                          <div className="col-3">
                            <p className="paragraf_style">Event Id</p>
                            <p className="paragraf_style">Event Title</p>
                            <p className="paragraf_style">Feedback Type</p>
                            <p className="paragraf_style">Event Description</p>
                          </div>
                          <div className="col-9">
                            <p className="paragraf_style">
                              {getData._id ? getData._id : "_"}
                            </p>
                            <p className="paragraf_style">
                              {getData.title ? getData.title : "_"}
                            </p>
                            <p className="paragraf_style">
                              {getData.event_Type ? getData.event_Type : "_"}
                            </p>
                            <p className="paragraf_style">
                              {" "}
                              {getData.description ? getData.description : "_"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabPanel>

                    <TabPanel value={value} index={1}>
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            {guestList && guestList.length > 0 ? (
                              <TableContainer>
                                <Table stickyHeader aria-label="sticky table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell
                                        align="left"
                                        style={{ minWidth: "100px" }}
                                      >
                                        Id
                                      </TableCell>
                                      <TableCell
                                        align="left"
                                        style={{ minWidth: "100px" }}
                                      >
                                        Guest Name
                                      </TableCell>
                                      <TableCell
                                        align="left"
                                        style={{ minWidth: "100px" }}
                                      >
                                        Mobile Number{" "}
                                      </TableCell>
                                      <TableCell
                                        align="left"
                                        style={{ minWidth: "100px" }}
                                      >
                                        Status{" "}
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {guestList.map((row, i) => {
                                      return row ? (
                                        <TableRow
                                          hover
                                          role="checkbox"
                                          tabIndex={-1}
                                          key={row.code}
                                        >
                                          <TableCell align="left">
                                            {i + 1}
                                          </TableCell>
                                          <TableCell align="left">
                                            {row.Guest_Name}{" "}
                                          </TableCell>

                                          <TableCell align="left">
                                            {row.phone_no}
                                          </TableCell>

                                          <TableCell align="left">
                                            {row.status == 0 ? (
                                              <p
                                                className="mb-2 mr-2 badge "
                                                style={{
                                                  color: "#ffffff",
                                                  backgroundColor: "#fec400",
                                                }}
                                              >
                                                Inactive
                                              </p>
                                            ) : (
                                              row.status ==
                                              1(
                                                <p
                                                  className="mb-2 mr-2 badge "
                                                  style={{
                                                    color: "#ffffff",
                                                    backgroundColor: "#29cc97",
                                                  }}
                                                >
                                                  Active
                                                </p>
                                              )
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      ) : (
                                        <TableCell align="left"></TableCell>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            ) : (
                              "No Guest Available"
                            )}
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <TableContainer>
                              <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell
                                      align="left"
                                      style={{ minWidth: "50px" }}
                                    >
                                      Id
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      style={{ minWidth: "100px" }}
                                    >
                                      Name
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      style={{ minWidth: "100px" }}
                                    >
                                      location
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      style={{ minWidth: "100px" }}
                                    >
                                      Date{" "}
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      style={{ minWidth: "100px" }}
                                    >
                                      Start Time
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      style={{ minWidth: "100px" }}
                                    >
                                      End Time
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {venueList.map((row, i) => {
                                    console.log(row + "OOOOOOOOOOOOOOOOO");
                                    return row ? (
                                      <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.code}
                                      >
                                        <TableCell align="left">
                                          {i + 1}
                                        </TableCell>
                                        <TableCell align="left">
                                          {row.venue_Name}
                                        </TableCell>
                                        <TableCell align="center">
                                          {row.venue_location}
                                        </TableCell>
                                        <TableCell align="left">
                                          {moment(row.date)
                                            .subtract(10, "days")
                                            .calendar()}
                                        </TableCell>
                                        <TableCell align="left">
                                          {row.start_time}
                                        </TableCell>
                                        <TableCell align="left">
                                          {row.end_time}
                                        </TableCell>
                                      </TableRow>
                                    ) : (
                                      <TableCell align="left">
                                        {/* "No Booking History"{" "} */}
                                      </TableCell>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            {cohostList.length > 0 ? (
                              <TableContainer>
                                <Table stickyHeader aria-label="sticky table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell
                                        align="left"
                                        style={{ minWidth: "100px" }}
                                      >
                                        Id
                                      </TableCell>
                                      <TableCell
                                        align="left"
                                        style={{ minWidth: "100px" }}
                                      >
                                        Name
                                      </TableCell>
                                      <TableCell
                                        align="left"
                                        style={{ minWidth: "100px" }}
                                      >
                                        Mobile Number
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {cohostList.map((row, i) => (
                                      <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.code}
                                      >
                                        <TableCell align="left">
                                          {i + 1}
                                        </TableCell>
                                        <TableCell align="left">
                                          {row.co_host_Name}
                                        </TableCell>
                                        <TableCell align="center">
                                          {row.phone_no}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            ) : (
                              <p>No Co host available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabPanel>

                    <TabPanel value={value} index={4}>
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <div className="parent">
                              <Carousel
                                responsive={responsive}
                                autoPlay={true}
                                swipeable={true}
                                draggable={true}
                                showDots={true}
                                infinite={true}
                                partialVisible={false}
                                dotListClass="custom-dot-list-style"
                              >
                                {sliderImageUrl.map((imageUrl, index) => {
                                  return (
                                    <div className="slider" key={index}>
                                      <img
                                        src={
                                          "http://13.51.205.211:6002/" +
                                          imageUrl
                                        }
                                        alt="movie"
                                      />
                                    </div>
                                  );
                                })}
                              </Carousel>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
