import React, { useState } from "react";
import "./Login";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { baseUrl } from "../features/Api/BaseUrl";

const defaultState = {
  email: "",
};

function Forgotpassword() {
  const [state, setState] = useState(defaultState);
  const [tokenMassageShow, setTokenMassageShow] = useState("");

  const [emailErr, setEmailErr] = useState("");
  const [forgotErr, setForgotErr] = useState(false);

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  const navigate = useNavigate();
  const forgotPassword = () => {
    navigate("/forgot-password");
  };

  const forgotPass = (event) => {
    const { name, value } = event.target;

    console.log(name, value);

    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const submitData = (e) => {
    console.log(state);
    e.preventDefault();
    console.log(state.email);
    if (state.email == "") {
      setForgotErr(true);
    } else {
      setForgotErr(false);

      axios
        .post(`${baseUrl}forgetPassToken `, {
          email: state.email,
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.success) {
            const forgotToken = response.data.token.token;
            const tokenMassage = response.data.messsage;
            setTokenMassageShow(tokenMassage);
            localStorage.setItem("token", forgotToken);
            Swal.fire(
              "Check your email a password reset email was sent!",
              "You clicked the button!",
              "success"
            );
            setError({ isError: false });
          }
        })
        .catch((error) => {
          console.log(error);
          setError({
            errors: error,
            isError: true,
          });
          // handdale error in proper way
        });
    }

    // if (state.email == "mobappssolutions160@gmail.com") {
    //   setEmailErr("Check your email a password reset email was sent");
    // } else {
    //   setEmailErr("please Enter Valid Email Address");
    // }
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
                        <h4 className="fs-20 font-w800 admin-color">
                          Forgot Password ?
                        </h4>
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "rgb(117, 117, 117)",
                          }}
                        >
                          Enter your email to recover your password
                        </p>
                      </div>
                      <form onSubmit={submitData}>
                        <p
                          style={{
                            fontSize: "16px",
                            color: "#572131",
                            fontWeight: 700,
                          }}
                        ></p>
                        <div className="mb-3">
                          <span style={{ color: "red" }}>
                            {forgotErr ? (
                              "Please enter your Email address!"
                            ) : (
                              <span style={{ color: "green" }}>
                                {tokenMassageShow}
                              </span>
                            )}
                          </span>
                          <TextField
                            fullWidth
                            classNameName="mb-1 mt-3 w-100"
                            label="Email"
                            name="email"
                            type="text"
                            autoComplete="off"
                            onChange={forgotPass}
                            value={state.email}
                            size="normal"
                            color="secondary"
                          />
                          <span style={{ color: "red" }}>
                            {error.isError
                              ? error.errors?.response?.data?.message
                              : " "}
                          </span>
                        </div>
                        <div className="row d-flex justify-content-between mt-4 mb-2">
                          <div className="mb-3"></div>
                        </div>
                        <div className="text-center">
                          <button
                            type="submit"
                            className="btn btn_style btn-block"
                          >
                            Reset Password
                          </button>
                        </div>
                      </form>
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

export default Forgotpassword;
