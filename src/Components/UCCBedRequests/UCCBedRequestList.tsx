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

  if (isLoading) return <Loading />;
  if (isScannerActive)
    return (
      <div className="md:w-1/2 w-full my-2 mx-auto flex flex-col justify-start items-end">
        <button
          onClick={() => setIsScannerActive(false)}
          className="btn btn-default mb-2"
        >
          <i className="fas fa-times mr-2"></i> Close Scanner
        </button>
        <QrReader
          delay={300}
          onScan={(bccId: any) =>
            bccId ? navigate(`/ucc_bed_request/${bccId}`) : null
          }
          onError={(e: any) =>
            Notification.Error({
              msg: e.message,
            })
          }
          style={{ width: "100%" }}
        />
        <h2 className="text-center text-lg self-center">Scan Asset QR!</h2>
      </div>
    );

  return (
    <div className="px-4 pb-2">
      <PageTitle title="Assets" hideBack={true} />
      <div className="md:flex mt-5 space-y-2">
        <div className="bg-white overflow-hidden shadow rounded-lg flex-1 md:mr-2">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm leading-5 font-medium text-gray-500 truncate">
                Total Assets
              </dt>
              <dd className="mt-4 text-5xl leading-9 font-semibold text-gray-900">
                {totalCount}
              </dd>
            </dl>
          </div>
        </div>
        <div className="flex-1">
          <InputSearchBox
            value={qParams.search}
            search={onSearchSuspects}
            placeholder="Search by Asset Name"
            errors=""
          />
        </div>
        <div className="flex-1 flex flex-col justify-start items-end">
          <AdvancedFilterButton setShowFilters={setShowFilters} />
          <button
            className="btn btn-primary"
            onClick={() => setIsScannerActive(true)}
          >
            <i className="fas fa-search mr-1"></i> Scan Asset QR
          </button>
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
          <div className="flex flex-wrap md:-mx-4">
            {uccBedRequestsExist ? (
              ucc_bed_requests.map((ucc_bed_request: UCCBedRequestData) => (
                <div
                  key={ucc_bed_request.id}
                  className="w-full pb-2 cursor-pointer border-b md:flex justify-between items-center mb-3"
                  onClick={() =>
                    navigate(`/ucc-bed-request/${ucc_bed_request.id}`)
                  }
                >
                  <div className="px-4 md:w-1/2">
                    <div className="md:flex justify-between w-full">
                      <p className="text-xl font-normal capitalize">
                        {ucc_bed_request.Name}
                      </p>
                    </div>
                  </div>
                  <div className="md:flex">
                    <div className="md:flex flex-wrap justify-end">
                      {ucc_bed_request.BedAllotmentStatus ? (
                        <Badge color="green" icon="cog" text="Working" />
                      ) : (
                        <Badge color="red" icon="cog" text="Not Working" />
                      )}
                      <Badge
                        color="blue"
                        icon="location-arrow"
                        text={ucc_bed_request.HospitalName}
                      />
                    </div>
                    <div className="px-2">
                      <div
                        onClick={() =>
                          navigate(`/assets/${ucc_bed_request.id}`)
                        }
                        className="btn btn-default bg-white"
                      >
                        Details
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full pb-2 cursor-pointer mb-3">
                <p className="text-xl font-bold capitalize text-center">
                  No Assets Found
                </p>
              </div>
            )}
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
