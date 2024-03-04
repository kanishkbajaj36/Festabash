import * as React from "react";
import { useEffect, useState } from "react";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
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
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { baseUrl } from "../../features/Api/BaseUrl";
import moment from "moment";
import "./NotificationList.css";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function NotificationList() {
  const [selectValue, setSelectValue] = React.useState("");
  const [selectUser, setSlectUser] = React.useState("");
  const [error, setError] = useState({
    errors: {},
    isError: false,
  });
  const handleChangeName = (event) => {
    console.log(event.target.value);
    setSlectUser(event.target.value);
  };

  const handleChange = (event) => {
    setSelectValue(event.target.value);
  };
  const [editActivityValue, setEditActivityValue] = useState("");
  const [editActivityValueId, setEditActivityValueId] = useState("");
  //   const [selectValue, setSelectValue] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const [massage, setMassage] = useState("");

  const [openEdit, setOpenEdit] = React.useState(false);

  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [searchApiData, setSearchApiData] = useState([]);
  const [notificationErr, setNotificationErr] = useState(false);
  const [notificationSend, setNotificationSend] = useState(false);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getdataList = () => {
    axios
      .get(`${baseUrl}getAll_Users_Notificatation`)
      .then((response) => {
        console.log(response);
        setRows(response.data.notifications);
        setSearchApiData(response.data.notifications);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const userList = () => {
    axios
      .get(`${baseUrl}getAllUser`)
      .then((response) => {
        console.log(response.data.user_details);
        setName(response.data.user_details);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getdataList();
    userList();
  }, []);

  const addCustomerData = () => {
    navigate("/admin/order/add-order");
  };

  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        deleteApi(id);
      }
    });
  };

  const deleteApi = (id) => {
    let deleteId = id;
    axios
      .delete(`${baseUrl}deleteNotifcationById/${deleteId}`)
      .then((response) => {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        getdataList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const textActivityValue = (event) => {
    // setActivity(event.target.value);
  };
  const submitDataNotification = () => {
    console.log(title, massage, selectValue, selectUser, userId);
    if (!title || !massage || !selectValue ||!location) {
      setNotificationErr(true);
      return;
    }

    axios
      .post(`${baseUrl}sendNotifications`, {
        userId: userId,
        adminChoice: selectValue,
        title: title,
        event_location:location,
        message: massage,
      })
      .then((response) => {
        console.log(response);
        Swal.fire(
          "Notification Send Successfully!",
          "You clicked the button!",
          "success"
        );
        setTitle("");
        setMassage("");
        setSelectValue("");
        setSlectUser("");
        setUserId("");
        setNotificationSend(false);
        getdataList();
        setOpen(false);
      })
      .catch((error) => {
        console.log(error);
        setNotificationErr(false);

        setError({
          errors: error,
          isError: true,
        });
      });
  };

  const editActivity = (id) => {
    setOpenEdit(true);
    const filterData = rows.filter((item) => {
      return item.id == id;
    });
    console.log(filterData);
    const getData = filterData[0];
    console.log(getData.activity_type);
    setEditActivityValue(getData.activity_type);
    setEditActivityValueId(getData.id);
  };

  const editDataUpdate = (event) => {
    setEditActivityValue(event.target.value);
  };
  const updateActivityValue = () => {
    axios
      .put(`${baseUrl}activity`, {
        activity_type: editActivityValue,
        id: editActivityValueId,
      })
      .then((response) => {
        Swal.fire(
          "Activity Update successfully!",
          "You clicked the button!",
          "success"
        );
        getdataList();
        setOpenEdit(false);
      });
  };
  const handleFilter = (e) => {
    if (e.target.value == "") {
      setRows(searchApiData);
    } else {
      const filterResult = searchApiData.filter((item) =>
        item.title.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setRows(filterResult);
    }
    setFilterValue(e.target.value);
  };
  const handleClearFilter = () => {
    setFilterValue("");
    setRows(searchApiData);
  };

  const menuItemSelect = (id) => {
    setUserId(id);
  };
  const sendNotification = () => {
    setNotificationSend(true);
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
          Notification List
        </Typography>
        <Divider />
        <Box height={10} />
        <Stack direction="row" spacing={2} className="my-2 mb-2">
          <TextField
            sx={{ width: "25%" }}
            label="Search by Tittle"
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
            Send Notification
          </Button>
        </Stack>
        <Box height={10} />
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  ID
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Title
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Massages
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
Location                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Date
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Send To
                </TableCell>

                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Action
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
                        {row.message ? row.message : "_"}
                      </TableCell>
                      <TableCell align="left">
                        {row.event_location ? row.event_location : "_"}
                      </TableCell>
                      <TableCell align="left">
                        {row.date
                          ? moment(row.date).format("MMMM Do YYYY")
                          : "_"}
                      </TableCell>
                      <TableCell align="left">
                        {row.send_to == "allUser" ? (
                          <p
                            className="mb-2 mr-2 badge "
                            style={{
                              color: "#ffffff",
                              backgroundColor: "#29cc97",
                            }}
                          >
                            All Users
                          </p>
                        ) : (
                          <p
                            className="mb-2 mr-2 badge "
                            style={{
                              color: "#ffffff",
                              backgroundColor: "#fec400",
                            }}
                          >
                            {row.send_to}
                          </p>
                        )}
                      </TableCell>
                      <TableCell align="left">
                        <Stack spacing={2} direction="row">
                          <DeleteIcon
                            style={{
                              fontSize: "20px",
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              deleteUser(row._id);
                            }}
                          />
                        </Stack>
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
      <div>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <BootstrapDialogTitle
            sx={{ width: "500px" }}
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Send Notification
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <span style={{ color: "red" }}>
              {notificationErr ? "All fields are mandatory!" : ""}
            </span>

            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Please Select
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectValue}
                  label="Please Select"
                  onChange={handleChange}
                >
                  <MenuItem value={2}> All User </MenuItem>
                  <MenuItem
                    value={1}
                    onClick={() => setNotificationSend(!notificationSend)}
                  >
                    Particular User
                  </MenuItem>
                </Select>
              </FormControl>
              {/* <span style={{ color: "red" }}>
                {error.isError ? error.errors.response.data.InvalidChoiceMessag : " "}
              </span> */}
            </Box>
            {notificationSend ? (
              <Box sx={{ minWidth: 120 }} className="mt-3">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Please Select
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectUser}
                    label="Please Select"
                    onChange={handleChangeName}
                  >
                    <MenuItem>Select Name</MenuItem>
                    {name.map((opts) => (
                      <MenuItem
                        key={opts.id}
                        value={opts._id}
                        onClick={() => menuItemSelect(opts._id)}
                      >
                        {opts.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <span style={{ color: "red" }}>
                  {error.isError
                    ? error.errors.response.data.userValidationMessage
                    : " "}
                </span>
              </Box>
            ) : (
              " "
            )}
            <Typography gutterBottom className="mt-3">
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                id="outlined-size-normal"
              />
            </Typography>
            <Typography gutterBottom className="mt-3">
              <TextField
                fullWidth
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                id="outlined-size-normal"
              />
            </Typography>
            <Typography gutterBottom className="mt-2">
              <TextField
                fullWidth
                id="outlined-multiline-static"
                label="Description"
                value={massage}
                onChange={(e) => setMassage(e.target.value)}
                multiline
                rows={2}
              />
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={submitDataNotification}>
              Submit
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </div>
      <div>
        <BootstrapDialog
          onClose={handleCloseEdit}
          aria-labelledby="customized-dialog-title"
          open={openEdit}
        >
          <BootstrapDialogTitle
            sx={{ width: "500px" }}
            id="customized-dialog-title"
            onClose={handleCloseEdit}
          >
            Edit Activity
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              <TextField
                fullWidth
                label="Activity"
                value={editActivityValue}
                onChange={editDataUpdate}
                id="outlined-size-normal"
              />
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={updateActivityValue}>
              Update
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </div>
    </div>
  );
}
