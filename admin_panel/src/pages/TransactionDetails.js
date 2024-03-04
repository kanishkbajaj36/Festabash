import React from "react";
import "./TransactionDetails.css";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
function TransactionDetails() {
  return (
    <>
      <div className="card">
        <div className="card-body pb-3">
          <div className="col-12">
            <h3>Payment Details</h3>
          </div>
          <div className="row align-items-center">
            <div className="col-xl-4 mb-3">
              <h6 className="mb-2">ID Payment</h6>
              <h2 className="mb-0">#00123521</h2>
            </div>
            <div className="col-xl-8 d-flex flex-wrap justify-content-between align-items-center">
              <div className="d-flex me-3 mb-3 ms-2 align-items-start">
                <i className="fa fa-phone scale-2 me-4 mt-2"></i>
                <div>
                  <h6 className="mb-2">Telephone</h6>
                  <h4 className="mb-0">+91 6397656333</h4>
                </div>
              </div>
              <div className="d-flex me-3 mb-3 ms-2 align-items-start">
                <i className="fa fa-envelope scale-2 me-4 mt-2"></i>
                <div>
                  <h6 className="mb-2">Email</h6>
                  <h4 className="mb-0">VishalPatel@mail.com</h4>
                </div>
              </div>
              <div className="d-flex mb-3">
                <a
                  className="btn btn-dark light me-3"
                  href="/react/demo/transaction-details"
                >
                  <LocalPrintshopIcon />
                  Print
                </a>
                <a
                  className="btn btn-primary"
                  href="/react/demo/transaction-details"
                >
                  <FileDownloadIcon />
                  Download Report
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body pb-3 transaction-details d-flex flex-wrap justify-content-between align-items-center">
          <div className="user-bx-2 me-3 mb-3">
            <img
              src="data:image/png;base64,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"
              className="rounded"
              alt=""
            />
            <div>
              <h3>Richard Michael</h3>
              <span className="common_style">@richardmichael</span>
            </div>
          </div>
          <div className="me-3 mb-3">
            <h6 className="mb-2">Payment Method</h6>
            <h4 className="mb-0 common_style">MasterCard 404</h4>
          </div>
          <div className="me-3 mb-3">
            <h6 className="mb-2">Invoice Date</h6>
            <h4 className="mb-0 common_style">April 29, 2020</h4>
          </div>
          <div className="me-3 mb-3">
            <h6 className="mb-2">Due Date</h6>
            <h4 className="mb-0 common_style">June 5, 2020</h4>
          </div>
          <div className="me-3 mb-3">
            <h6 className="mb-2">Date Paid</h6>
            <h4 className="mb-0 common_style">June 4, 2020</h4>
          </div>
          <div className="amount-bx mb-3">
            <AttachMoneyIcon className="i" />
            <div>
              <h6 className="mb-1">Amount</h6>
              <h3 className="mb-0">$ 986.23</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="card">
          <div className="card-body">
            <div className="d-xl-flex d-block align-items-start description-bx">
              <div>
                <h4 className="card-title">Description</h4>
                <span className="fs-12 common_style">
                  Lorem ipsum dolor sit amet, consectetur
                </span>
                <p className="description common_style mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum
                </p>
              </div>
              <div className="card-bx bg-dark-blue ms-xl-5 ms-0">
                <img
                  className="pattern-img"
                  src="/react/demo/static/media/pattern11.132c1493.png"
                  alt=""
                />
                <div className="card-info text-white">
                  <img
                    src="data:image/png;base64,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"
                    className="mb-4"
                    alt=""
                  />
                  <h2 className="text-white card-balance">$24,567</h2>
                  <p className="fs-16">Wallet Balance</p>
                  <span className="text-white">+0,8% than last week</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionDetails;
