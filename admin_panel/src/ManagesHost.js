// import * as React from "react";
// import { useEffect, useState } from "react";
// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useNavigate } from "react-router-dom";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { NavLink, Link } from "react-router-dom";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

// import BootstrapSwitchButton from "bootstrap-switch-button-react";
// import Swal from "sweetalert2";
// import axios from "axios";
// export default function ManagesHost() {
//   const [dataSearch, setDataSearch] = useState();
//   const navigate = useNavigate();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [rows, setRows] = useState([]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const getdataList = () => {
//     axios
//       .get(" http://192.168.0.67:5000/api/hostlist")
//       .then((response) => {
//         console.log(response);
//         setRows(response.data.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   useEffect(() => {
//     getdataList();
//   }, []);

//   const addCustomerData = () => {
//     navigate("/admin/order/add-order");
//   };

//   const deleteUser = (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.value) {
//         deleteApi(id);
//       }
//     });
//   };

//   const deleteApi = (id) => {
//     let deleteId = id;
//     axios
//       .post(`http://192.168.0.67:4000/api/delete/user/${deleteId}`)
//       .then((response) => {
//         Swal.fire("Deleted!", "Your file has been deleted.", "success");
//         getdataList();
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };
//   const toggleData = () => {
//     alert("vishal");
//   };
//   const handleFilter = (event) => {
//     const newData = rows.filter((row) =>
//       row.first_name.toLowerCase().includes(event.target.value.toLowerCase())
//     );
//     setRows(newData);
//   };
//   return (
//     <div>
//       <Paper sx={{ width: "100%", overflow: "hidden", padding: "12px" }}>
//         <Typography
//           gutterBottom
//           variant="h5"
//           component="div"
//           sx={{ padding: "20px" }}
//         >
//           Hosts List
//         </Typography>
//         <Divider />
//         <Box height={10} />
//         <Stack direction="row" spacing={2} className="my-2 mb-2">
//           <TextField
//             sx={{ width: "25%" }}
//             label="Search by name"
//             id="outlined-size-small"
//             size="small"
//             onChange={handleFilter}
//           />
//           <Typography
//             variant="h6"
//             component="div"
//             sx={{ flexGrow: 1 }}
//           ></Typography>{" "}
//         </Stack>
//         <Box height={10} />
//         <TableContainer>
//           <Table stickyHeader aria-label="sticky table">
//             <TableHead>
//               <TableRow>
//                 <TableCell align="left" style={{ minWidth: "100px" }}>
//                   Hosts ID
//                 </TableCell>
//                 <TableCell align="left" style={{ minWidth: "100px" }}>
//                   Hosts Name
//                 </TableCell>
//                 <TableCell align="left" style={{ minWidth: "100px" }}>
//                   Email
//                 </TableCell>
//                 <TableCell align="left" style={{ minWidth: "100px" }}>
//                   contact Number
//                 </TableCell>
//                 <TableCell align="left" style={{ minWidth: "100px" }}>
//                   Profile
//                 </TableCell>
//                 <TableCell align="left" style={{ minWidth: "100px" }}>
//                   available item
//                 </TableCell>

//                 <TableCell align="left" style={{ minWidth: "100px" }}>
//                   View
//                 </TableCell>
//                 <TableCell align="left" style={{ minWidth: "100px" }}>
//                   Action
//                 </TableCell>
//                 <TableCell align="left" style={{ minWidth: "100px" }}>
//                   Active/Inactive
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {rows
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((row, i) => {
//                   console.log(">>>>>>>>>>>>>>>>>>>>" + row.job_title);
//                   return (
//                     <TableRow
//                       hover
//                       role="checkbox"
//                       tabIndex={-1}
//                       key={row.code}
//                     >
//                       <TableCell align="left">{i + 1}</TableCell>
//                       <TableCell align="left">{row.first_name}</TableCell>
//                       <TableCell align="left">{row.email}</TableCell>
//                       <TableCell align="left">{row.mobile_no}</TableCell>

//                       <TableCell align="left">
//                         {/* <img
//                           src={"http://52.15.47.207:4000/images/" + row.profile}
//                           alt="loading"
//                         /> */}
//                         <img
//                           src={"http://192.168.0.66:5000/images/" + row.profile}
//                           alt="loading"
//                           style={{
//                             width: "50px",
//                             height: "50px",
//                             borderRadius: "50%",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell align="left">
//                         {/* {row.Identify_document} */}
//                         <a
//                           href={
//                             "http://192.168.0.66:5000/identification/" +
//                             row.Identify_document
//                           }
//                           target="Loading Pdf file"
//                           rel="noreferrer"
//                         >
//                           <PictureAsPdfIcon />
//                         </a>
//                       </TableCell>
//                       <TableCell align="left">
//                         {
//                           <VisibilityIcon
//                             onClick={() =>
//                               navigate("/admin/host-detail", {
//                                 state: {
//                                   id: row.id,
//                                   response: rows,
//                                 },
//                               })
//                             }
//                           />
//                         }
//                       </TableCell>

//                       <TableCell align="left">
//                         <Stack spacing={2} direction="row">
//                           {/* <EditIcon
//                             style={{
//                               fontSize: "20px",
//                               color: "green",
//                               cursor: "pointer",
//                             }}
//                             className="cursor-pointer"
//                             onClick={() =>
//                               navigate("/admin/users/edit-user", {
//                                 state: {
//                                   id: row._id,
//                                   response: rows,
//                                 },
//                               })
//                             }
//                           /> */}
//                           <DeleteIcon
//                             style={{
//                               fontSize: "20px",
//                               color: "red",
//                               cursor: "pointer",
//                             }}
//                             onClick={() => {
//                               deleteUser(row.id);
//                             }}
//                           />
//                         </Stack>
//                       </TableCell>

//                       <TableCell align="left">
//                         {
//                           <BootstrapSwitchButton
//                             onClick={() => {
//                               // activeInactive(row.id);
//                             }}
//                             width={100}
//                             onlabel="Active"
//                             offlabel="Inactive"
//                             onstyle="success"
//                           />
//                         }
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[10, 25, 100]}
//           component="div"
//           count={rows.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//     </div>
//   );
// }
