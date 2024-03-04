import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles(() => ({
  mainTopDivArea: {
    backgroundImage: `url('	https://cutesolution.com/html/vehicle/assets/img/slider/slider-1.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  innerDivArea: {
    heigh: "250px",
    width: "40%",
    borderRadius: "8px",
    backgroundColor: "rgb(253 250 250)",
    border: "5px solid black",
    boxShadow: "rgb(100 100 111 / 20%) 0px 7px 29px 0px",
  },

  resetBtn: {
    color: "#ffffff !important",
    padding: "4px 20px",
    transition: ".5s !important",
    fontSize: "16px !important",
    // borderRadius: "20px !important",
    // border: "2px solid #188dc7 !important",
    backgroundColor: "#009DA6 !important",
    "&:hover": {
      color: "black !important",
      //   border: "2px solid #188dc7 !important",
      background: "#8fc1e2 !important",
    },
  },

  password: {
    color: "#009DA6",
  },
}));

const PasswordEmaile = () => {
  const classes = useStyles();

  return (
    <>
      <div
        className={`bg-image vh-100 w-100 d-flex align-items-center justify-content-center ${classes.mainTopDivArea}`}
      >
        <div className={`row p-4 ${classes.innerDivArea}`}>
          <div className="col ">
            <h5 className="fw-normal">
              RESET <span className={`${classes.password}`}> PASSWORD?</span>
            </h5>
            <p className="fw-bold" style={{ color: "#757575" }}>
              Enter your email to get a password reset link
            </p>
            <TextField
              fullWidth
              label="Enter New Password"
              id="fullWidth"
              autoComplete="off"
            />
            <TextField
              fullWidth
              label="Enter confirm Password"
              id="fullWidth"
              autoComplete="off"
              className="mt-3"
            />
            <p className="mt-3 text-end ">
              <span className="border-bottom border-dark">
                Remember your password ?
              </span>
            </p>
            <div className="row">
              <div className="col-12 text-center">
                <Button
                  type="submit"
                  variant="contained"
                  className={`${classes.resetBtn}`}
                >
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordEmaile;
