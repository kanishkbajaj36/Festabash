import React, { useState, useEffect } from "react";
import "./MainLayout.css";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { AiOutlineDashboard, AiOutlineUser } from "react-icons/ai";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import PolicyIcon from "@mui/icons-material/Policy";
import HeatPumpIcon from "@mui/icons-material/HeatPump";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LayersIcon from "@mui/icons-material/Layers";
import { useLocation } from "react-router-dom"; // Import the useLocation hook
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const { Header, Sider, Content, Footer } = Layout;
const MainLayout = () => {
  const [nameValue, setNameValue] = useState("");
  const [imageValue, setImageValue] = useState("");
  const location = useLocation(); // Get the current location
  const { state } = location;
  console.log(location, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  const localStorageValue = localStorage.getItem("name");
  const getActiveKey = () => {
    const path = location.pathname;
    // Implement your logic to determine the active key based on the 'path'
    // For example, you can use a switch statement or if-else conditions.
    // Here's a simple example:
    switch (path) {
      case "/admin":
        return ""; // Use the localStorage value if available, otherwise, use an empty string
      case "/admin/admin-demo-list":
        return "admin-demo-list";
      case "/admin/user-feedback-list":
        return "user-feedback-list";
      case "/admin/users-list":
        return "users-list";
      case "/admin/event-list":
        return "event-list";

      case "/admin/landing-page":
        return "landing-page";
      case "/admin/notification":
        return "notification";

      case "/admin/Cancelation-Policy":
        return "Cancelation-Policy";
      case "/admin/privacy-policy":
        return "privacy-policy";
      case "/admin/terms-conditions":
        return "terms-conditions";

      case "/admin/customer-reviews":
        return "customer-reviews";
      case "/admin/contact-us-list":
        return "contact-us-list";

      // Add more cases for other pages
      default:
        return "";
    }
  };

  const getParentMenuKey = (path) => {
    // Implement your logic to determine the parent menu key based on the 'path'
    // For example, you can use a switch statement or if-else conditions.
    // Here's a simple example:
    switch (path) {
      case "/admin/host-list":
      case "/admin/activity-list":
      case "/admin/area-list":
      case "/admin/Allergens-list":
      case "/admin/Cuisine-list":
      case "/admin/Place-list":
      case "/admin/Country-list":
      case "/admin/city-list":
      case "/admin/emirate-list":
      case "/admin/interest-list":
        return "manage-host";
      case "/admin/customer-reviews":
      case "/admin/host-reviews":
        return "Reviews";
      // Add more cases for other children
      default:
        return "";
    }
  };

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  const signoutData = () => {
    localStorage.clear();
    navigate("/");
  };
  // const adminame = localStorage.getItem("name");
  const adminImage = localStorage.getItem("image");
  useEffect(() => {
    // Retrieve the current value from localStorage
    const storedName = localStorage.getItem("name");
    const storedImage = localStorage.getItem("image");

    if (storedName) {
      setNameValue(storedName);
    } else {
      // If the "name" key doesn't exist in localStorage, set it with the value from state
      localStorage.setItem("name", state?.dataValue?.firstName || "");
      setNameValue(state?.dataValue?.firstName || "");
    }
    if (storedImage) {
      setImageValue(storedImage);
    } else {
      // If the "image" key doesn't exist in localStorage, set it with the value from state
      localStorage.setItem("image", state?.dataValue?.image || "");
      setImageValue(state?.dataValue?.image || "");
    }
  }, [nameValue, imageValue, state]);
  console.log("Name===================>", state?.dataValue?.image);

  return (
    <Layout /* onContextMenu={(e) => e.preventDefault()} */>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h2 className="text-white fs-5 text-center py-3 mb-0">
            <span className="sm-logo">
              {" "}
              <img
                src="festabash.png"
                className=" festabash-l0go mb-3"
                style={{ width: "50px" }}
                alt=""
              />
            </span>
            <span className="lg-logo">FestaBash</span>
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[getActiveKey()]} // Set the active key based on the URL
          defaultOpenKeys={[getParentMenuKey(location.pathname)]} // Set the open parent menu based on the URL
          onClick={({ key }) => {
            if (key === "signout") {
              // Handle signout
            } else {
              navigate(key);
            }
          }}
          items={[
            {
              key: "",
              icon: <AiOutlineDashboard className="fs-4" />,
              label: "Dashboard",
            },
            {
              key: "users-list",
              icon: <AiOutlineUser className="fs-4" />,
              label: "Manages Users",
            },

            {
              key: "event-list",
              icon: <BookmarkBorderIcon className="fs-4" />,
              label: "Manages Events ",
            },
            {
              key: "user-feedback-list",
              icon: <RadioButtonCheckedIcon className="fs-4" />,
              label: "User Feedback",
            },
            {
              key: "admin-demo-list",
              icon: <AiOutlineUser className="fs-4" />,
              label: "Admin Demo Event",
            },
            {
              key: "notification",
              icon: <NotificationsActiveIcon className="fs-4" />,
              label: "Notifications",
            },

            {
              key: "contact-us-list",
              icon: <LayersIcon className="fs-4" />,
              label: "Contact Us",
            },

            {
              key: "terms-conditions",
              icon: <HeatPumpIcon className="fs-4" />,
              label: "Terms and Conditions",
            },
            {
              key: "privacy-policy",
              icon: <PolicyIcon className="fs-4" />,
              label: "Privacy policy",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="d-flex gap-4 align-items-center">
            <div className="d-flex gap-3 align-items-center dropdown">
              <div
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {imageValue ? (
                  <img
                    style={{ borderRadius: "50%" }}
                    width={32}
                    height={32}
                    src={`http://13.51.205.211:6002/${imageValue}`}
                    alt="loading"
                  />
                ) : (
                  <img
                    style={{ borderRadius: "50%" }}
                    width={32}
                    height={32}
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="loading"
                  />
                )}
              </div>
              <div>
                <h5 className="mb-0">{nameValue}</h5>
              </div>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <NavLink
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="/admin/my-profile"
                  >
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="/admin/change-password"
                  >
                    Change Password
                  </NavLink>
                </li>
                <li>
                  <button
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    onClick={signoutData}
                  >
                    Signout
                  </button>
                </li>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            // padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          FestaBash Admin Panel ©2023 Created by Admin
        </Footer>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
