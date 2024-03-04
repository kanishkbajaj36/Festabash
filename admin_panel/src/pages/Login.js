import React, { useState } from "react";
import "./Login.css";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { baseUrl } from "../features/Api/BaseUrl";
import axios from "axios";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const defaultState = {
  email: "",
  password: "",
};

function Login() {
  const [state, setState] = useState(defaultState);
  const [fieldEmptyErr, setFieldEmptyErr] = useState(false);

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  const navigate = useNavigate();

  const forgotPassword = () => {
    navigate("/forgot-password");
  };

  const loginApproved = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const submitData = (e) => {
    e.preventDefault();
    if (state.email == "" || state.password == "") {
      setFieldEmptyErr(true);
    } else {
      axios
        .post(`${baseUrl}login_Admin `, {
          email: state.email,
          password: state.password,
        })
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            const getId = response.data.data._id;
            const getName = response.data.data.firstName;
            const image = response.data.data.profileImage;
            const email = response.data.data.email;
            localStorage.setItem("id", getId);
            localStorage.setItem("name", getName);
            localStorage.setItem("image", image);
            // localStorage.setItem("email", email);
            Swal.fire(
              "Admin login sucessfully!",
              "You clicked the button!",
              "success"
            );
            navigate("/admin");
          }
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
                    <img src="https://festabash.com/images/hero1.svg" className="food-img" alt="" />
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12  p-5">
                    <div className="sign-in-your">
                      <div className="text-center mb-3">
                        <img
                          src="festabash.png"
                          className=" festabash-l0go mb-3"
                          alt=""
                        />
                        <h4 className="fs-2 font-w800 admin-color">Admin</h4>
                      </div>
                      <span style={{ color: "red" }}>
                        {fieldEmptyErr
                          ? "Please enter Email or password !"
                          : " "}
                      </span>
                      <form onSubmit={submitData}>
                        <div className="mb-3">
                          <TextField
                            fullWidth
                            className="mb-1 mt-3 w-100 "
                            label="Email"
                            name="email"
                            type="text"
                            error={false}
                            autoComplete="off"
                            onChange={loginApproved}
                            value={state.email}
                            size="normal"
                            color="secondary"
                          />
                          <span style={{ color: "red" }}>
                            {error.isError
                              ? error.errors.response.data.message
                              : " "}
                          </span>
                        </div>
                        <div className="mb-3">
                          <TextField
                            fullWidth
                            classNameName="mb-1 mt-3 w-100"
                            label="Password"
                            name="password"
                            type="password"
                            onChange={loginApproved}
                            value={state.password}
                            size="normal"
                            color="secondary"
                          />
                          <span style={{ color: "red" }}>
                            {error.isError
                              ? error.errors.response.data.pmessage
                              : " "}
                          </span>
                        </div>
                        <div className="row d-flex justify-content-between mt-4 mb-2"></div>
                        <div className="text-center">
                          <button
                            type="submit"
                            className="btn btn_style btn-block"
                          >
                            Login
                            <ArrowRightAltIcon />
                          </button>
                        </div>
                      </form>
                      <div className="text-center mt-3">
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={forgotPassword}
                        >
                          Forgot password?{" "}
                        </span>
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

export default Login;
