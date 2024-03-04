import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
const defaultState = {
  name: "",
};

function EditModification() {
  
  const navigate = useNavigate();
  const [state, setState] = useState(defaultState);
  const [selectedImage, setSelectedImage] = useState(null);
  const [values, setValues] = useState([]);
  const [valuesMake, setValuesMake] = useState([]);
  const [valuesYear, setValuesYear] = useState([]);

  const [age, setAge] = useState("");

  const submitInputdata = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  useEffect(() => {
    axios
      .get("http://192.168.0.64:4000/api/get/vehicle/types")
      .then((response) => {
        console.log(response.data);
        setValues(response.data.response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(" http://192.168.0.64:4000/api/get/vehicle/make")
      .then((response) => {
        console.log(response.data.data);
        setValuesMake(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {

    axios
      .get("http://192.168.0.64:4000/api/get/year")
      .then((response) => {
        console.log(response.data.data);
        setValuesYear(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const submitAllData = () => {
    console.log(state);
    axios
      .post("http://192.168.0.64:4000/api/add/vehicle/make", {
        name: state.makeName,
        vehicle_id: state.makeType,
      })
      .then((response) => {
        console.log(response);
        Swal.fire(
          "make added sucessfully!",
          "You clicked the button!",
          "success"
        );
        navigate("/admin/make-type");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const imageFunction = (event) => {
    setSelectedImage(event.target.files[0]);
    setState({ ...state, profile: event.target.files[0] });
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="header-div">
            <span>
              <i class="fas fa-users"></i>
            </span>
            <span>Edit Modification</span>
          </div>
        </div>
        <div className="row row-style mt-3">
          <div className="col-12">
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <TextField
                  fullWidth
                  className="mb-1 mt-2 w-100"
                  type="email"
                  label="Name"
                  name="name"
                  value={state.name}
                  onChange={submitInputdata}
                  size="normal"
                />
              </div>
              <div>
                <FormControl sx={{ minWidth: 120 }} className="mt-2">
                  <InputLabel id="demo-simple-select-helper-label">
                    Make Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    name="makeType"
                    value={state.makeType}
                    label="Categories"
                    onChange={submitInputdata}
                  >
                    <MenuItem value=""></MenuItem>
                    {values.map((opts, i) => (
                      <MenuItem value={opts._id}>{opts.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div>
                <FormControl sx={{ minWidth: 120 }} className="mt-2">
                  <InputLabel id="demo-simple-select-helper-label">
                    Model Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    name="makeType"
                    value={state.makeType}
                    label="Categories"
                    onChange={submitInputdata}
                  >
                    <MenuItem value=""></MenuItem>
                    {valuesMake.map((opts, i) => (
                      <MenuItem value={opts._id}>{opts.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div>
                <FormControl sx={{ minWidth: 120 }} className="mt-2">
                  <InputLabel id="demo-simple-select-helper-label">
                    Year Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    name="makeType"
                    value={state.makeType}
                    label="Categories"
                    onChange={submitInputdata}
                  >
                    <MenuItem value=""></MenuItem>
                    {valuesYear.map((opts, i) => (
                      <MenuItem value={opts._id}>{opts?.year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-12 d-flex justify-content-center mt-2">
                <button
                  type="button"
                  className="add-user-btn-style btn_add_customer"
                  onClick={submitAllData}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditModification;
