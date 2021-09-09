import { useState } from "react";
import { SelectField } from "../Common/HelperInputFields";
import { SAMPLE_TEST_STATUS, SAMPLE_TEST_RESULT } from "../../Common/constants";
import { navigate } from "raviger";

const useMergeState = (initialState: any) => {
  const [state, setState] = useState(initialState);
  const setMergedState = (newState: any) =>
    setState((prevState: any) => Object.assign({}, prevState, newState));
  return [state, setMergedState];
};

export default function UserFilter(props: any) {
  let { filter, onChange, closeFilter } = props;

  const [filterState, setFilterState] = useMergeState({
    status: filter.status || "",
    result: filter.result || "",
  });

  const clearFilterState = {
    status: "",
    result: "",
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;

    const filterData: any = { ...filterState };
    filterData[name] = value;

    setFilterState(filterData);
  };

  const applyFilter = () => {
    const { status, result } = filterState;
    const data = {
      status: status || "",
      result: result || "",
    };
    onChange(data);
  };

  return (
    <div>
      <div className="flex justify-between">
        <button className="btn btn-default" onClick={closeFilter}>
          <i className="fas fa-times mr-2" />
          Cancel
        </button>
        <button
          className="btn btn-default"
          onClick={(_) => {
            navigate("/sample");
            setFilterState(clearFilterState);
          }}
        >
          <i className="fas fa-times mr-2" />
          Clear Filter
        </button>
        <button className="btn btn-primary" onClick={applyFilter}>
          <i className="fas fa-check mr-2" />
          Apply
        </button>
      </div>

      <div className="font-light text-md mt-2">Filter By:</div>
      <div className="flex flex-wrap gap-2">
        <div className="w-64 flex-none">
          <div className="text-sm font-semibold">Status</div>
          <SelectField
            name="status"
            variant="outlined"
            margin="dense"
            value={filterState.status || 0}
            options={[
              { id: "", text: "SELECT" },
              ...SAMPLE_TEST_STATUS.map(({ id, text }) => {
                return { id, text: text.replaceAll("_", " ") };
              }),
            ]}
            onChange={handleChange}
            errors=""
          />
        </div>

        <div className="w-64 flex-none">
          <div className="text-sm font-semibold">Result</div>
          <SelectField
            name="result"
            variant="outlined"
            margin="dense"
            value={filterState.result || 0}
            options={[{ id: "", text: "SELECT" }, ...SAMPLE_TEST_RESULT]}
            onChange={handleChange}
            errors=""
          />
        </div>
      </div>
    </div>
  );
}
