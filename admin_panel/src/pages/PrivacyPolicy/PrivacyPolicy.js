import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../features/Api/BaseUrl";
import "./PrivacyPolicy.css";
const defaultState = {
  heading: "",
  data: "",
};

function PrivacyPolicy() {
  const navigate = useNavigate();
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    axios
      .get(`${baseUrl}getPrivacy_and_Policy `)
      .then((response) => {
        console.log(response.data.Data);
        const selectedUser = response.data.Data;
        const getData = selectedUser[0];
        setState((prevData) => ({
          ...prevData,
          heading: getData.Heading,
          data: getData.Description,
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
      .post(`${baseUrl}privacyAndPolicy`, {
        Heading: state.heading,
        Description: state.data,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          Swal.fire(
            "term and condition update  successfully!",
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
            <h4 className="text-center">This is Privacy and policy page</h4>
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
              className="submit-btn-style  "
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

export default PrivacyPolicy;
