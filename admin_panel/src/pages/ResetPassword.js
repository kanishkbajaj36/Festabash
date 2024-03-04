import React, { useState } from "react";
import "./Login";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { baseUrl } from "../features/Api/BaseUrl";

const defaultState = {
  newPassword: "",
  confirmPassword: "",
};

function ResetPassword() {
  const [fieldEmptyErr, setFieldEmptyErr] = useState(false);

  const [state, setState] = useState(defaultState);
  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  const navigate = useNavigate();
  const ResetPassword = (event) => {
    const { name, value } = event.target;

    console.log(name, value);

    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  // const endpoint = "reset-password";

  // Define the data you want to send in the request body
  // const postData = {
  //   newPassword: state.email,
  //   confirmPassword: state.password,
  // };
  // var token = localStorage.getItem("token");
  // Define additional parameters to include in the URL
  // const params = {
  //   token: token,
  // };

  // Create the complete URL with query parameters
  // const url = `${baseUrl}${endpoint}?${new URLSearchParams(params).toString()}`;

  // Make the POST request
  // axios
  //   .post(url, postData)
  //   .then((response) => {
  //     // Handle the response here
  //     console.log(response.data);
  //   })
  //   .catch((error) => {
  //     // Handle errors here
  //     console.error(error);
  //   });

  // const resetData = (e) => {
  //   e.preventDefault();
  //   console.log(state);
  //   var tokenGet = localStorage.getItem("token");
  //   alert(tokenGet);
  //   const endpoint = "reset-password";

  //   const params = {
  //     token: tokenGet,
  //   };
  //   const url = `${baseUrl}${endpoint}?${new URLSearchParams(
  //     params
  //   ).toString()}`;

  //   axios
  //     .post(url, {
  //       newPassword: state?.email,
  //       confirmPassword: state?.password,
  //     })
  //     .then((response) => {
  //       // Access the response payload data
  //      console.log(response);

  //       // Now you can use responseData as needed
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setError({
  //         errors: error,
  //         isError: true,
  //       });
  //     });
  // };
  const resetData = (e) => {
    e.preventDefault();

    // Get the input field values from your component's state
    // const newPasswordValue = state.newPassword; // Replace with the actual state variable
    // const confirmPasswordValue = state.confirmPassword; // Replace with the actual state variable

    var tokenGet = localStorage.getItem("token");

    // const endpoint = "reset-password";

    // const params = {
    //   token: tokenGet,
    // };

    // const url = `${baseUrl}${endpoint}?${new URLSearchParams(params)}`;

    // // Create an object to hold the data for the request body
    // const requestBody = {
    //   newPassword: newPasswordValue,
    //   confirmPassword: confirmPasswordValue,
    // };
    if (state.newPassword == "" || state.confirmPassword == "") {
      setFieldEmptyErr(true);
    } else {
      setFieldEmptyErr(false);
      axios
        .post(`${baseUrl}/reset_password/${tokenGet} `, {
          password: state.newPassword,
          confirmPassword: state.confirmPassword,
        })
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            Swal.fire(
              "Password Reset Successfully!",
              "You clicked the button!",
              "success"
            );
            navigate("/");
          }
          // Access the response payload data
          console.log(response);

          // Now you can use responseData as needed
        })
        .catch((error) => {
          console.log(error);
          setError({
            errors: error,
            isError: true,
          });
        });
    }
  };

  return (
    <>
      <div className="container-fluid mt-0">
        <div className="row  align-items-center justify-contain-center bg-login">
          <div className="col-xl-12 ">
            <div className="card border-0">
              <div className="card-body login-bx">
                <div className="row ">
                  <div
                    className="col-xl-6 col-lg-6 col-md-6 col-sm-12  text-center"
                    style={{
                      backgroundColor: " #702061ba",
                      borderRadius: "10px",
                    }}
                  >
                    <img
                      src="https://festabash.com/images/hero1.svg"
                      className="food-img"
                      alt=""
                    />
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 p-5 ">
                    <div className="sign-in-your">
                      <div className="text-center mb-3">
                        <img
                          src="festabash.png"
                          className=" festabash-l0go mb-3"
                          alt=""
                        />
                        <h4 className="fs-20 font-w800 text-black">
                          Reset Password
                        </h4>
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "rgb(117, 117, 117)",
                          }}
                        >
                          Enter your New Password
                        </p>
                      </div>
                      <span style={{ color: "red" }}>
                        {fieldEmptyErr ? "Please enter Your password !" : " "}
                      </span>
                      <div className="mb-3">
                        <TextField
                          fullWidth
                          classNameName="mb-1 mt-3 w-100"
                          type="text"
                          label="New Password"
                          name="newPassword"
                          onChange={ResetPassword}
                          value={state.newPassword}
                          color="secondary"
                        />
                        {/* <span style={{ color: "red" }}>
                          {error.isError
                            ? error?.errors?.response?.data?.errors[0].msg
                            : " "}
                        </span> */}
                      </div>
                      <div className="mb-3">
                        <TextField
                          fullWidth
                          classNameName="mb-1 mt-3 w-100"
                          type="text"
                          label="Confirm Password"
                          name="confirmPassword"
                          onChange={ResetPassword}
                          value={state.confirmPassword}
                          size="normal"
                          color="secondary"
                        />
                        <span style={{ color: "red" }}>
                          {error.isError
                            ? error.errors.response.data?.message
                            : " "}
                        </span>
                      </div>

                      <div className="row d-flex justify-content-between mt-4 mb-2">
                        <div className="mb-3"></div>
                      </div>
                      <div className="text-center">
                        <button
                          onClick={resetData}
                          type="submit"
                          className="btn btn_style btn-block"
                        >
                          submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
