import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// import "./UserDetails.css";
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

export default function UserDetails() {
  const [rows, setRows] = useState([]);
  const [sliderImageUrl, setSliderImageUrl] = useState([]);
  const [guestList, setGuestList] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);

  const [venueList, setVenueList] = useState([]);
  const [cohostList, setCoHostList] = useState([]);

  const [rating, setRating] = useState();
  const location = useLocation();
  console.log(location.state.id);

  const selectedUser = location.state.response.filter((item) => {
    return item._id === location.state.id;
  });

  const getData = selectedUser[0];
  console.log(venueList);
  console.log(sliderImageUrl);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // useEffect(() => {
  //   axios
  //     .post(`${baseUrl}user/rating`, {
  //       id: getData.visitor_id,
  //     })
  //     .then((responce) => {
  //       console.log(responce.data.response.overall_rating);
  //       setRating(responce.data.response.overall_rating);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // });

  const getdataList = () => {
    axios
      .get(`${baseUrl}getUserEvent/${location.state.id}`)
      .then((response) => {
        console.log(response.data.events);
        setRows(response.data.events);
        // setFeedbackList(response.data.feedback_details);
        setVenueList(response.data.events[0]?.venue_Date_and_time);
        setSliderImageUrl(response.data.events[0]?.images);
        setCoHostList(response.data.events[0]?.co_hosts);
        setGuestList(response.data.events[0]?.Guests);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getdataList();
  }, []);

  return (
    <>
      <div className="main_div">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-12">
              {getData.profileImage ? (
                <img
                  alt="not found"
                  className="rounded-circle mt-5"
                  width="150px"
                  src={`http://13.51.205.211:6002/${getData.profileImage}`}
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
                <h4 className="mt-3 host_style">User </h4>
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
                        <Tab label="User Detais" {...a11yProps(0)} />

                        <Tab label="Event Details" {...a11yProps(1)} />
                        <Tab label="Guest List" {...a11yProps(2)} />
                        <Tab label="Venue" {...a11yProps(3)} />
                        <Tab label="Co-Host" {...a11yProps(4)} />
                        <Tab label="Photos" {...a11yProps(5)} />
                      </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                      <div className="container">
                        <div className="row">
                          <div className="col-3">
                            <p className="paragraf_style"> Id</p>
                            <p className="paragraf_style"> Name</p>
                            <p className="paragraf_style">Phone Number</p>
                            <p className="paragraf_style">Email id</p>
                            <p className="paragraf_style">Created Date</p>
                            <p className="paragraf_style">Status</p>
                          </div>
                          <div className="col-9">
                            <p className="paragraf_style">
                              {getData._id ? getData._id : "_"}
                            </p>
                            <p className="paragraf_style">
                              {getData.fullName ? getData.fullName : "_"}
                            </p>
                            <p className="paragraf_style">
                              {getData.phone_no ? getData.phone_no : "_"}
                            </p>
                            <p className="paragraf_style">
                              {" "}
                              {getData.email ? getData.email : "_"}
                            </p>
                            <p className="paragraf_style">
                              {" "}
                              {getData.createdAt ? getData.createdAt : "_"}
                            </p>
                            <p className="paragraf_style">
                              {" "}
                              {getData.user_status == "1" ? (
                                <p
                                  className="  badge "
                                  style={{
                                    color: "#ffffff",
                                    backgroundColor: "#29cc97",
                                  }}
                                >
                                  Active
                                </p>
                              ) : (
                                <p
                                  className="  badge "
                                  style={{
                                    color: "#ffffff",
                                    backgroundColor: "#fec400",
                                  }}
                                >
                                  InActive
                                </p>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            {guestList && guestList.length ? (
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
                                    {guestList?.map((row, i) => {
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
                    <TabPanel value={value} index={1}>
                      {rows && rows.length > 0 ? (
                        <div className="container">
                          <div className="row">
                            <div className="col-3">
                              <p className="paragraf_style"> Id</p>
                              <p className="paragraf_style"> Title</p>
                              <p className="paragraf_style">Event Type</p>
                              <p className="paragraf_style"> Description</p>
                              <p className="paragraf_style">Create Date</p>
                              <p className="paragraf_style">Status</p>
                            </div>
                            <div className="col-9">
                              <p className="paragraf_style">
                                {rows[0]?._id ? rows[0]._id : "_"}
                              </p>
                              <p className="paragraf_style">
                                {rows[0]?.title ? rows[0]?.title : "_"}
                              </p>
                              <p className="paragraf_style">
                                {rows[0]?.event_Type
                                  ? rows[0]?.event_Type
                                  : "_"}
                              </p>
                              <p className="paragraf_style">
                                {rows[0]?.description
                                  ? rows[0]?.description
                                  : "_"}
                              </p>
                              <p className="paragraf_style">
                                {rows[0]?.createdAt ? rows[0]?.createdAt : "_"}
                              </p>
                              <p className="paragraf_style">
                                {rows[0]?.event_status == "1" ? (
                                  <p
                                    className="  badge "
                                    style={{
                                      color: "#ffffff",
                                      backgroundColor: "#29cc97",
                                    }}
                                  >
                                    Active
                                  </p>
                                ) : (
                                  <p
                                    className="  badge "
                                    style={{
                                      color: "#ffffff",
                                      backgroundColor: "#fec400",
                                    }}
                                  >
                                    InActive
                                  </p>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        "Event Not Create!"
                      )}
                    </TabPanel>

                    <TabPanel value={value} index={3}>
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <TableContainer>
                              {venueList && venueList.length ? (
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
                                    {venueList?.map((row, i) => {
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
                              ) : (
                                "Venue Not Available"
                              )}
                            </TableContainer>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <TableContainer>
                              {cohostList && cohostList.length ? (
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
                              ) : (
                                "Co-Host Not Available"
                              )}
                            </TableContainer>
                          </div>
                        </div>
                      </div>
                    </TabPanel>

                    <TabPanel value={value} index={5}>
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <div className="parent">
                              {sliderImageUrl && sliderImageUrl.length > 0 ? (
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
                                          alt="image"
                                        />
                                      </div>
                                    );
                                  })}
                                </Carousel>
                              ) : (
                                <p>No images available</p>
                              )}
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
