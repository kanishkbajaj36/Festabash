import React, { useEffect, useState } from "react";
import "./CustomerDetails.css";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { baseUrl } from "../../features/Api/BaseUrl";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Divider from "@mui/material/Divider";
import StarsIcon from "@mui/icons-material/Stars";
function CustomerDetails() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [rating, setRating] = useState("");

  const location = useLocation();
  console.log(location.state);
  const selectedUser = location.state.response.filter((item) => {
    return item.id === location.state.id;
  });

  const getData = selectedUser[0];
  console.log(getData);
  const bookingHistory = () => {
    axios
      .post(`${baseUrl}customer/bookings`, {
        visitorId: getData.id,
      })
      .then((responce) => {
        console.log(responce.data.data);
        setRows(responce.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    bookingHistory();
  }, []);
  return (
    <>
      <div className="container emp-profile">
        <form method="post">
          <div className="row">
            <div className="col-md-4">
              <div className="profile-img">
                {getData.profile ? (
                  <img
                    src={"http://suppr.me/images/" + getData.profile}
                    alt="loading"
                  />
                ) : (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="loading"
                  />
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-head">
                <h5>
                  {getData.first_name} {getData.last_name}{" "}
                </h5>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      id="home-tab"
                      data-toggle="tab"
                      href="#home"
                      role="tab"
                      aria-controls="home"
                      aria-selected="true"
                    >
                      About
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="tab-content profile-tab" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <label>User Id</label>
                    </div>
                    <div className="col-md-6">
                      {getData.id ? <p>{getData.id}</p> : <p>_</p>}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label>Email</label>
                    </div>
                    <div className="col-md-6">
                      {getData.email ? <p>{getData.email}</p> : <p>_</p>}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Phone Number</label>
                    </div>
                    <div className="col-md-6">
                      {getData.mobile_no ? (
                        <p>{getData.mobile_no}</p>
                      ) : (
                        <p>_</p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Address</label>
                    </div>
                    <div className="col-md-6">
                      {getData.address ? <p>{getData.address}</p> : <p>_</p>}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Join Date</label>
                    </div>
                    <div className="col-md-6">
                      {getData.join_date ? (
                        <p>{getData.join_date}</p>
                      ) : (
                        <p>_</p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Document</label>
                    </div>
                    <div className="col-md-6 mb-2">
                      <a
                        href={
                          "http://suppr.me/identification/" +
                          getData.Identify_document
                        }
                      >
                        <PictureAsPdfIcon />
                      </a>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Rating</label>
                    </div>
                    <div className="col-md-6">
                      <p>
                        {getData.ratings ? (
                          <p>
                            {" "}
                            <StarsIcon className="rating_icon_style" />
                            {getData.ratings}
                          </p>
                        ) : (
                          <p>
                            {" "}
                            <StarsIcon />_
                          </p>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="profile"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <label>Experience</label>
                    </div>
                    <div className="col-md-6">
                      <p>Expert</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Hourly Rate</label>
                    </div>
                    <div className="col-md-6">
                      <p>10$/hr</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Total Projects</label>
                    </div>
                    <div className="col-md-6">
                      <p>230</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>English Level</label>
                    </div>
                    <div className="col-md-6">
                      <p>Expert</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Availability</label>
                    </div>
                    <div className="col-md-6">
                      <p>6 months</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <label>Your Bio</label>
                      <br />
                      <p>Your detail description</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div>
        <h6>Booking History</h6>
        <Paper sx={{ width: "100%", overflow: "hidden", padding: "12px" }}>
          <Divider />

          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" style={{ minWidth: "100px" }}>
                    Host Name
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: "100px" }}>
                    Booking Number
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: "100px" }}>
                    Number of Guest{" "}
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: "100px" }}>
                    Total Amount
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: "95px" }}>
                    Date
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: "60px" }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, i) => {
                  console.log(row + "OOOOOOOOOOOOOOOOO");
                  return row ? (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      <TableCell align="left"> {row.host_name} </TableCell>
                      <TableCell align="left">{row.booking_id}</TableCell>
                      <TableCell align="center">{row.no_of_guests}</TableCell>
                      <TableCell align="left">{row.price}</TableCell>
                      <TableCell align="left">{row.booking_date}</TableCell>
                      <TableCell align="left">
                        {row.status == 0 ? (
                          <p
                            className="mb-2 mr-2 badge "
                            style={{
                              color: "#ffffff",
                              backgroundColor: "#fec400",
                            }}
                          >
                            pending
                          </p>
                        ) : row.status == 1 ? (
                          <p
                            className="mb-2 mr-2 badge "
                            style={{
                              color: "#ffffff",
                              backgroundColor: "#29cc97",
                            }}
                          >
                            Accept
                          </p>
                        ) : row.status == 2 ? (
                          <p
                            className="mb-2 mr-2 badge "
                            style={{
                              color: "#ffffff",
                              backgroundColor: "#13cae1",
                            }}
                          >
                            Reject
                          </p>
                        ) : (
                          <p
                            className="mb-2 mr-2 badge "
                            style={{
                              color: "#ffffff",
                              backgroundColor: "red",
                            }}
                          >
                            cancelled
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableCell align="left">"No Booking History" </TableCell>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </>
  );
}

export default CustomerDetails;
