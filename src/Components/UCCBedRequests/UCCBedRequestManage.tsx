import React, { useState, useCallback, useEffect, ReactElement } from "react";

import loadable from "@loadable/component";
import moment from "moment";
import { UCCBedRequestData } from "./UCCBedRequest";
import * as Notification from "../../Utils/Notifications.js";
import { statusType, useAbortableEffect } from "../../Common/utils";
import { useDispatch } from "react-redux";
import { Typography } from "@material-ui/core";
import { retrieveBedRequest } from "../../Redux/actions";
import Pagination from "../Common/Pagination";
import { navigate } from "raviger";
import QRCode from "qrcode.react";
const PageTitle = loadable(() => import("../Common/PageTitle"));
const Loading = loadable(() => import("../Common/Loading"));

interface UCCBedRequestManageProps {
  uccId: number;
}

const UCCBedRequestManage = (props: UCCBedRequestManageProps) => {
  const { uccId } = props;
  const [ucc_bed_request, setUCCBedRequest] = useState<UCCBedRequestData>();
  const [isPrintMode, setIsPrintMode] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [ucc_bed_request_details, setUCCBedRequestDetail] = useState<
    UCCBedRequestData[]
  >([]);
  const [uccBedRequestDetails, setUCCBedRequestDetails] = useState<
    ReactElement | ReactElement[]
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const limit = 14;

  const fetchData = useCallback(
    async (status: statusType) => {
      setIsLoading(true);
      const [uccBedRequestData]: any = await Promise.all([
        dispatch(retrieveBedRequest(uccId)),
      ]);
      if (!status.aborted) {
        setIsLoading(false);
        if (!uccBedRequestData.data)
          Notification.Error({
            msg: "Something went wrong..!",
          });
        else {
          setUCCBedRequest(uccBedRequestData.data);
          setUCCBedRequestDetail(uccBedRequestData.data);
          setTotalCount(uccBedRequestData.data.count);
        }
      }
    },
    [dispatch, uccId, offset]
  );

  useAbortableEffect(
    (status: statusType) => {
      fetchData(status);
    },
    [dispatch, fetchData]
  );

  const handlePagination = (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    setCurrentPage(page);
    setOffset(offset);
  };

  const PrintPreview = () => (
    <div className="">
      <div className="my-4 flex justify-end ">
        <button
          onClick={(_) => window.print()}
          className="btn btn-primary mr-2"
        >
          <i className="fas fa-print mr-2"></i> Print QR Code
        </button>
        <button
          onClick={(_) => setIsPrintMode(false)}
          className="btn btn-default"
        >
          <i className="fas fa-times mr-2"></i> Close
        </button>
      </div>
    </div>
  );

  const working_status = (is_working: boolean | undefined) => {
    const bgColorClass = is_working ? "bg-green-500" : "bg-red-500";
    return (
      <span
        className={`${bgColorClass} text-white text-sm px-2 py-1 uppercase rounded-full`}
      >
        {!is_working && "Not "} Working
      </span>
    );
  };

  const status = (
    asset_status: "ACTIVE" | "TRANSFER_IN_PROGRESS" | undefined
  ) => {
    if (asset_status === "ACTIVE") {
      return (
        <span className="bg-green-500 text-white text-sm px-2 py-1 uppercase rounded-full">
          ACTIVE
        </span>
      );
    }
    return (
      <span className="bg-yellow-500 text-white text-sm px-2 py-1 uppercase rounded-full">
        TRANSFER IN PROGRESS
      </span>
    );
  };

  const populateTableRows = (txns: UCCBedRequestData[]) => {
    if (txns.length > 0) {
      setUCCBedRequestDetails(
        ucc_bed_request_details.map(
          (ucc_bed_request_detail: UCCBedRequestData) => (
            <tr>
              <td className="px-6 py-4 text-left whitespace-no-wrap text-sm leading-5 text-cool-gray-500">
                <span className="text-cool-gray-900 font-medium">
                  {ucc_bed_request_detail.HospitalName}
                </span>
              </td>
              <td className="px-6 py-4 text-left whitespace-no-wrap text-sm leading-5 text-cool-gray-500">
                <span className="text-cool-gray-900 font-medium">
                  {ucc_bed_request_detail.Name}
                </span>
              </td>
              <td className="px-6 py-4 text-left whitespace-no-wrap text-sm leading-5 text-cool-gray-500">
                <span className="text-cool-gray-900 font-medium">
                  {ucc_bed_request_detail.Mobile}{" "}
                  {ucc_bed_request_detail.Remarks}
                </span>
              </td>
              <td className="px-6 py-4 text-left whitespace-no-wrap text-sm leading-5 text-cool-gray-500">
                <span className="text-cool-gray-900 font-medium">
                  {moment(ucc_bed_request_detail.created_date).format("lll")}
                </span>
              </td>
            </tr>
          )
        )
      );
    } else {
      setUCCBedRequestDetails(
        <tr>
          <td
            className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-cool-gray-500 text-center"
            colSpan={4}
          >
            <h5>No Transactions Found</h5>
          </td>
        </tr>
      );
    }
  };

  useEffect(() => {
    populateTableRows(ucc_bed_request_details);
  }, [ucc_bed_request_details]);

  if (isLoading) return <Loading />;
  if (isPrintMode) return <PrintPreview />;
  return (
    <div className="px-2 pb-2">
      <PageTitle title={ucc_bed_request?.Name || "Asset"} />
      <div className="bg-white rounded-lg md:p-6 p-3 shadow">
        <div className="md:flex justify-between">
          <div className="mb-2">
            <div className="text-xl font-semibold">
              {ucc_bed_request?.HospitalName}
            </div>
            <Typography>Location : {ucc_bed_request?.Gender}</Typography>
            <Typography>Facility : {ucc_bed_request?.SpO2}</Typography>
            <Typography>Serial Number : {ucc_bed_request?.Taluk}</Typography>
            <Typography>Warranty Details : {ucc_bed_request?.CT}</Typography>
            <Typography>Type : {ucc_bed_request?.DM}</Typography>
          </div>
          <div className="flex flex-col">
            <div className="mb-1">
              <button
                className="btn btn-primary mt-2 w-full"
                onClick={() => setIsPrintMode(true)}
              >
                Print QR
              </button>
            </div>
            <button
              onClick={() =>
                navigate(
                  `/facility/${ucc_bed_request?.confustion}/assets/${ucc_bed_request?.O2}`
                )
              }
              id="update-asset"
              className="btn-primary btn"
            >
              <i className="fas fa-pencil-alt text-white mr-2"></i>
              Update Asset
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg md:p-6 p-3 shadow mt-2">
        <div className="text-xl font-semibold">Transaction History</div>
        {totalCount > limit && (
          <div className="mt-4 flex w-full justify-center">
            <Pagination
              cPage={currentPage}
              defaultPerPage={limit}
              data={{ totalCount }}
              onChange={handlePagination}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UCCBedRequestManage;
