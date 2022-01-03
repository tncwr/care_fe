import moment from "moment";
import { useDispatch } from "react-redux";
import QrReader from "react-qr-reader";
import { statusType, useAbortableEffect } from "../../Common/utils";
import * as Notification from "../../Utils/Notifications.js";
import PageTitle from "../Common/PageTitle";
import { viewBedRequests, retrieveBedRequest } from "../../Redux/actions";
import { Badge } from "../Patient/ManagePatients";
import { UCCBedRequestData } from "./UCCBedRequest";
import React, { useState, useCallback, useEffect } from "react";
import { navigate, useQueryParams } from "raviger";
import loadable from "@loadable/component";
import Pagination from "../Common/Pagination";
import { InputSearchBox } from "../Common/SearchBox";
//import { make as SlideOver } from "../Common/SlideOver.gen";
//import AssetFilter from "./AssetFilter";
import { FacilityModel } from "../Facility/models";
import AdvancedFilterButton from "../Common/AdvancedFilterButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import CSS from "csstype";

const Loading = loadable(() => import("../Common/Loading"));

const UCCBedRequestsList = (props: any) => {
  const [qParams, setQueryParams] = useQueryParams();
  const [ucc_bed_requests, setUCCBedRequests] = useState<UCCBedRequestData[]>([
    {},
  ] as UCCBedRequestData[]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isScannerActive, setIsScannerActive] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [facilityName, setFacilityName] = useState<string>();
  const [asset_type, setAssetType] = useState<string>();
  const [locationName, setLocationName] = useState<string>();
  const limit = 14;
  const dispatch: any = useDispatch();
  const uccBedRequestsExist =
    ucc_bed_requests.length > 0 && Object.keys(ucc_bed_requests[0]).length > 0;
  const fetchData = useCallback(
    async (status: statusType) => {
      setIsLoading(true);
      const params = qParams.search
        ? {
            limit,
            offset,
          }
        : {
            limit,
            offset,
          };
      const { data }: any = await dispatch(viewBedRequests(params));
      if (!status.aborted) {
        setIsLoading(false);
        if (!data)
          Notification.Error({
            msg: "Something went wrong..!",
          });
        else {
          setUCCBedRequests(data.results);
          setTotalCount(data.count);
        }
      }
    },
    [dispatch, offset]
  );

  useAbortableEffect(
    (status: statusType) => {
      fetchData(status);
    },
    [dispatch, fetchData]
  );

  const badge = (key: string, value: any, paramKey: string[]) => {
    return (
      value && (
        <span className="inline-flex h-full items-center px-3 py-1 rounded-full text-xs font-medium leading-4 bg-white text-gray-600 border">
          {key}
          {": "}
          {value}
          <i className="fas fa-times ml-2 rounded-full cursor-pointer hover:bg-gray-500 px-1 py-0.5"></i>
        </span>
      )
    );
  };

  const onSearchSuspects = (search: string) => {
    if (search !== "") setQueryParams({ ...qParams, search }, true);
    else setQueryParams({ ...qParams, search: "" }, true);
  };

  const handlePagination = (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    setCurrentPage(page);
    setOffset(offset);
  };

  const updateQuery = (params: any) => {
    const nParams = Object.assign({}, qParams, params);
    setQueryParams(nParams, true);
    console.log(qParams);
  };

  const applyFilter = (data: any) => {
    const filter = { ...qParams, ...data };
    updateQuery(filter);
    setShowFilters(false);
  };

  const lineSpace: CSS.Properties = {
    marginBottom: "5px",
  };

  const BedType = [
    "ICU",
    "Ventilator Bed",
    "O2 Bed",
    "Non O2 Bed",
    "CCC",
    "Icu Bed with Ventilator",
    "Any Of The Above",
  ];
  const RquiredHospitalType = [
    "GOVERMENT_HOSPITAL",
    "PRIVATE_HOSPITAL",
    "ANY",
  ] as const;
  const HospitalType = [
    "Home",
    "Hospital",
    "Triage Facility",
    "Transit/Ambulance",
  ] as const;

  if (isLoading) return <Loading />;

  return (
    <div className="px-4 pb-2">
      <PageTitle title="UCC Bed Requests" hideBack={true} />
      <div className="md:flex mt-5 space-y-2">
        <div className="bg-white overflow-hidden shadow rounded-lg flex-1 md:mr-2">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm leading-5 font-medium text-gray-500 truncate">
                Total Bed Requests
              </dt>
              <dd className="mt-4 text-5xl leading-9 font-semibold text-gray-900">
                {totalCount}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div></div>
      <div className="flex space-x-2 mt-2 flex-wrap w-full col-span-3">
        {badge("Facility", facilityName, ["facility", "location"])}
        {badge("Asset Name", qParams.search, ["search"])}
        {badge("Location", locationName, ["location"])}
        {badge("Asset Type", asset_type, ["asset_type"])}
        {badge("Status", qParams.status, ["status"])}
      </div>
      <div className="flex-grow mt-10 bg-white">
        <div className="p-8">
          <div
            className="flex flex-wrap md:-mx-4"
            style={{ height: "auto", overflow: "auto" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ref No</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Priority Updation DateTime</TableCell>
                  <TableCell>Hospital Type</TableCell>
                  <TableCell>Bed Type</TableCell>
                  <TableCell>Age/Gender</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>SPo2</TableCell>
                  <TableCell>Pulse</TableCell>
                  <TableCell>O2 Support</TableCell>
                  <TableCell>RR</TableCell>
                  <TableCell>CT Score</TableCell>
                  <TableCell>Asthma</TableCell>
                  <TableCell>Chronic Kidney Disease</TableCell>
                  <TableCell>Hospital Name</TableCell>
                  <TableCell>RT-PCR</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell>Counseling Required</TableCell>
                  <TableCell>Type Of Hospital Requested</TableCell>
                  <TableCell>fever</TableCell>
                  <TableCell>DM</TableCell>
                  <TableCell>HT</TableCell>
                  <TableCell>IHD</TableCell>
                  <TableCell>TB</TableCell>
                  <TableCell>Priority Case</TableCell>
                  <TableCell>Priority Case Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uccBedRequestsExist ? (
                  ucc_bed_requests.map((ucc_bed_request: UCCBedRequestData) => (
                    <TableRow>
                      <TableCell>{ucc_bed_request.ReferenceID}</TableCell>
                      <TableCell>
                        <div className="px-2">
                          <div style={lineSpace}>
                            <button className="btn btn-primary">
                              Bed Allotment
                            </button>
                          </div>
                          <div>
                            <button className="btn btn-primary">
                              Rejected
                            </button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{ucc_bed_request.Name}</TableCell>
                      <TableCell>{ucc_bed_request.Mobile}</TableCell>
                      <TableCell>{ucc_bed_request.PriorityDate}</TableCell>
                      <TableCell>
                        {HospitalType[ucc_bed_request.HomeorHsptl]}
                      </TableCell>
                      <TableCell>{ucc_bed_request.TypeOfBedReq}</TableCell>
                      <TableCell>
                        {ucc_bed_request.Age}/{ucc_bed_request.Gender}
                      </TableCell>
                      <TableCell>{ucc_bed_request.Address}</TableCell>
                      <TableCell>{ucc_bed_request.SpO2}</TableCell>
                      <TableCell>{ucc_bed_request.PR}</TableCell>
                      <TableCell>{ucc_bed_request.O2}</TableCell>
                      <TableCell>{ucc_bed_request.RR}</TableCell>
                      <TableCell>{ucc_bed_request.CT1}</TableCell>
                      <TableCell>
                        {ucc_bed_request.Asthma ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {ucc_bed_request.Chronic_Kidney_Disease ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>{ucc_bed_request.HospitalName}</TableCell>
                      <TableCell>{ucc_bed_request.CT}</TableCell>
                      <TableCell>{ucc_bed_request.Remarks}</TableCell>
                      <TableCell>
                        {ucc_bed_request.Counseling_Required ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {RquiredHospitalType[ucc_bed_request.Bed]}
                      </TableCell>
                      <TableCell>
                        {ucc_bed_request.fever ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>{ucc_bed_request.DM ? "Yes" : "No"}</TableCell>
                      <TableCell>{ucc_bed_request.HT ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        {ucc_bed_request.IHD ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>{ucc_bed_request.TB ? "Yes" : "No"}</TableCell>
                      <TableCell>{ucc_bed_request.priority_status}</TableCell>
                      <TableCell>{ucc_bed_request.PriorityRemarks}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10}>
                      <div className="w-full pb-2 cursor-pointer mb-3">
                        <p className="text-xl font-bold capitalize text-center">
                          No UCC Bed Requests Found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
      </div>
    </div>
  );
};

export default UCCBedRequestsList;
