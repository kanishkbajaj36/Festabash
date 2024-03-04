import * as React from "react";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Swal from "sweetalert2";
import axios from "axios";
import "./AdminDemoList.css";
import { baseUrl } from "../../features/Api/BaseUrl";
import moment from "moment";

export default function AdminDemoList() {
  const adminId = localStorage.getItem("id");
  console.log(adminId);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [searchApiData, setSearchApiData] = useState([]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
  };

  const getdataList = () => {
    axios
      .get(`${baseUrl}getDemoEvent/${adminId}`)
      .then((response) => {
        console.log(response);
        setRows(response.data.events);
        setSearchApiData(response.data.events);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getdataList();
  }, []);

  const cancelBooking = (id) => {
    let deleteId = id;
    axios
      .post(`${baseUrl}booking/cancel`, {
        booking_id: deleteId,
      })
      .then((responce) => {
        Swal.fire(" Booking Cancel!", "Your file has been Cancel;.", "success");
        getdataList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const cancelBookingList = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Booking cancel it!",
    }).then((result) => {
      if (result.value) {
        cancelBooking(id);
      }
    });
  };

  const deletOrderList = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOrder(id);
      }
    });
  };

  const deleteOrder = (id) => {
    axios
      .post(`${baseUrl}booking/delete`, {
        booking_id: id,
      })
      .then((responce) => {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        getdataList();
        console.log(responce);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const approveBooking = (id) => {
    axios
      .post(`${baseUrl}booking/approve`, {
        booking_id: id,
      })
      .then((responce) => {
        console.log(responce);
        Swal.fire("Booking Approve!", "Your file has been deleted.", "success");
        getdataList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClickOpen = () => {
    navigate("/admin/admin-demo-list/demo-event-create");
  };
  const dataActiveInactive = (id, data) => {
    axios
      .post(`${baseUrl}checkAndToggleStatus/${id}`)
      .then((response) => {
        console.log(response);
        console.log(response.data.success);
        if (data == 0) {
          Swal.fire("Status!", "Activate.", "success");
          getdataList();
        } else {
          Swal.fire("Status!", "Deactivate.", "success");
          getdataList();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFilter = (event) => {
    if (event.target.value === "") {
      setRows(searchApiData);
    } else {
      const filterResult = searchApiData.filter((item) => {
        const fullName = `${item.title}`.toLowerCase();
        const phoneNo = `${item.event_Type}`.toLowerCase();
        const searchValue = event.target.value.toLowerCase();

        // Check if the full name, phone number, or email includes the search value
        return fullName.includes(searchValue) || phoneNo.includes(searchValue);
      });
      setRows(filterResult);
    }
    setFilterValue(event.target.value);
  };

  const handleClearFilter = () => {
    setFilterValue("");
    setRows(searchApiData);
  };
  return (
    <div>
      <Paper sx={{ width: "100%", overflow: "hidden", padding: "12px" }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ padding: "20px" }}
        >
          Event Demo List
        </Typography>
        <Divider />
        <Box height={10} />
        <Stack direction="row" spacing={2} classNameName="my-2 mb-2">
          <TextField
            sx={{ width: "25%" }}
            label="Search"
            id="outlined-size-small"
            size="small"
            value={filterValue}
            onChange={(e) => handleFilter(e)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {filterValue && (
                    <IconButton onClick={handleClearFilter} edge="end">
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>{" "}
          <Button
            variant="contained"
            className="submit-btn-style"
            onClick={handleClickOpen}
          >
            Create Demo Event
          </Button>
        </Stack>
        <Box height={10} />
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ minWidth: "80px" }}>
                  ID
                </TableCell>

                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Title
                </TableCell>

                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Type
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  View
                </TableCell>

                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Active/Inactive
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      <TableCell align="left">{i + 1}</TableCell>

                      <TableCell align="left">
                        {row.title ? row.title : "_"}
                      </TableCell>
                      <TableCell align="left">
                        {row.event_Type ? row.event_Type : "-"}
                      </TableCell>
                      <TableCell align="left">
                        {
                          <VisibilityIcon
                            onClick={() =>
                              navigate("/admin/demo-event-details", {
                                state: {
                                  id: row._id,
                                  response: rows,
                                },
                              })
                            }
                          />
                        }
                      </TableCell>

                      <TableCell align="left">
                        {
                          <BootstrapSwitchButton
                            width={100}
                            checked={Boolean(row.event_status)}
                            onlabel="Active"
                            offlabel="Inactive"
                            onstyle="success"
                            onChange={() => {
                              dataActiveInactive(row._id, row.event_status);
                            }}
                          />
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
