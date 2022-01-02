export interface UCCBedRequestData {
  id: number;
  TypeOfCaller: number;
  TypeOfBedReq: string;
  Counseling_Required: number;
  Remarks: string;
  created_date: string;
  Name: string;
  Age: number;
  Gender: string;
  Address: string;
  Mobile: number;
  District: string;
  Taluk: string;
  HomeorHsptl: number;
  HospitalName: string;
  confustion: number;
  breathlessness: number;
  fever: number;
  DM: number;
  HT: number;
  IHD: number;
  SpO2: string;
  O2: string;
  RR: string;
  PR: string;
  BP_Systolic: string;
  BP_Diastolic: string;
  CT: string;
  Bed: number;
  SourceType: number;
  Asthma: number;
  Chronic_Kidney_Disease: number;
  CT1: number;
  InsertDate: "2022-01-02T14:14:29.470000+05:30";
  priority_status: number;
  BedAllotmentStatus: number;
  TriageID: number;
}

export interface UCCBedRequestResponse {
  count: number;
  next?: string;
  previous?: string;
  results: UCCBedRequestData[];
}
