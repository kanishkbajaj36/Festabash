import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Chart from "react-apexcharts";
import { baseUrl } from "../../features/Api/BaseUrl";
import axios from "axios";
import CountUp from "react-countup";

const Dashboard = () => {
  const [totaldata, setTotaldata] = useState("");
  const getdataList = () => {
    axios
      .get(`${baseUrl}all_Details`)
      .then((response) => {
        console.log(response);
        setTotaldata(response.data);
        // setRows(response.data.data);
        // setSearchApiData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getdataList();
  }, []);
  const [options, setOptions] = useState({
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  });
  const [series, setSeries] = useState([
    {
      name: " Total Users ",
      data: [30, 40, 45, 50, 49, 60, 70, 91, 40, 45, 50, 49],
      color: "#702061",
    },
    {
      name: "Total Events",
      data: [10, 9, 15, 20, 19, 20, 30, 41, 10, 15, 20, 29],
      color: "#1e90ff",
    },
    // {
    //   name: "Total Operations",
    //   data: [20, 15, 25, 30, 39, 40, 40, 51, 30, 25, 30, 19],
    //   color: "#008080",
    // },
  ]);

  return (
    <div className="">
      <div className="row">
        <div className="  col-lg-3 col-md-6 col-sm-12  mt-2">
          <div className="bg-white p-2 pending_style">
            <div>
              <p className="desc"> Total Users</p>
              <h4 className="mb-0 sub-title">
                <CountUp start={0} end={totaldata.user_count} />
              </h4>
            </div>
          </div>
        </div>
        <div className="  col-lg-3 col-md-6 col-sm-12 mt-2">
          <div className="bg-white p-2 active_style">
            <div>
              <p className="desc"> Total Events</p>
              <h4 className="mb-0 sub-title">
                {" "}
                <CountUp start={0} end={totaldata.event_count} />
              </h4>
            </div>
          </div>
        </div>
        <div className="  col-lg-3 col-md-6 col-sm-12  mt-2">
          <div className="bg-white p-2 delivered_style">
            <div>
              <p className="desc">Total Feedbacks</p>
              <h4 className="mb-0 sub-title">
                <CountUp start={0} end={totaldata.feedback_count} />
              </h4>
            </div>
          </div>
        </div>
        <div className="col-xl-3  col-lg-3 col-md-6 col-sm-12  mt-2">
          <div className="bg-white p-2 cancelled_style">
            <div>
              <p className="desc"> Department</p>
              <h4 className="mb-0 sub-title">
                <CountUp start={0} end={100} />
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3 ">
        <div className="  col-lg-3 col-md-6 col-sm-12  mt-2">
          <div className="bg-white p-2 pending_style">
            <div>
              <p className="desc">Total Operations</p>
              <h4 className="mb-0 sub-title">000</h4>
            </div>
          </div>
        </div>
        <div className="  col-lg-3 col-md-6 col-sm-12  mt-2">
          <div className="bg-white p-2 active_style">
            <div>
              <p className="desc">Total Revenue</p>
              <h4 className="mb-0 sub-title">000</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4">
          <h6 className="desc">MONTHLY REVENUE</h6>
        </div>
        <div className="col-12">
          <Chart options={options} series={series} type="bar" width="100%" />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
