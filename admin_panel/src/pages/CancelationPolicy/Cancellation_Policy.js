import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../features/Api/BaseUrl";

const defaultState = {
  heading: "",
  data: "",
};

function Cancellation_Policy() {
  const navigate = useNavigate();
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    axios
      .get(`${baseUrl}cancel/policy`)
      .then((response) => {
        console.log(response.data.data);
        const selectedUser = response.data.data;
        setState((prevData) => ({
          ...prevData,
          heading: response.data.data.heading,
          data: response.data.data.description,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const submitData = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const submitFormData = () => {
    console.log(state);

    axios
      .post(`${baseUrl}cancel/policy`, {
        heading: state.heading,
        description: state.data,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          Swal.fire(
            "Cancellation policy update  successfully!",
            "You clicked the button!",
            "success"
          );
          navigate("/admin");
        } else {
          console.log("else");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="container " style={{ backgroundColor: "#fff" }}>
        <div className="row m-0 ">
          <div className="col-12 my-3">
            <h4 className="text-center">This is Cancelation Policy</h4>
          </div>
          <div className="col-12 my-3">
            <TextField
              fullWidth
              variant="outlined"
              size="large"
              s
              label={"headding "}
              onChange={submitData}
              name="heading"
              value={state.heading}
            />
          </div>
          <div className="col-12 my-3">
            <CKEditor
              editor={ClassicEditor}
              data={state.data}
              onReady={(editor) => {
                console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                console.log({ event, editor, data });
                setState((prevState) => {
                  return {
                    ...prevState,
                    data: data,
                  };
                });
              }}
              onBlur={(event, editor) => {
                console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                console.log("Focus.", editor);
              }}
            />
          </div>
          <div className="col-12 my-3 d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-primary  "
              onClick={submitFormData}
            >
              Submit <ArrowRightAltIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cancellation_Policy;
