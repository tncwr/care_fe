export type roundsType = NormalRound | ICURound | VentilatorRound

export type t = {
  createdAt: Js.Date.t,
  admittedTo: string,
  createdByTelemedicine: bool,
  neurologicalMonitoring: CriticalCare__NeurologicalMonitoring.t,
  hemodynamicParameter: CriticalCare__HemodynamicParameters.t,
  nursingCare: CriticalCare__NursingCare.t,
  arterialBloodGasAnalysis: CriticalCare__ABGAnalysis.t,
  ioBalance: CriticalCare__IOBalance.t,
  dialysis: CriticalCare_Dialysis.t,
  pressureSoreParameter: CriticalCare__PressureSore.t,
  bloodSugar: CriticalCare_BloodSugar.t,
  ventilatorParameters: CriticalCare__VentilatorParameters.t,
  medicine: array<Prescription__Prescription.t>,
  others: CriticalCare__Others.t,
  roundsType: roundsType,
}

let make = (
  ~createdAt,
  ~admittedTo,
  ~createdByTelemedicine,
  ~neurologicalMonitoring,
  ~hemodynamicParameter,
  ~nursingCare,
  ~arterialBloodGasAnalysis,
  ~ioBalance,
  ~dialysis,
  ~pressureSoreParameter,
  ~bloodSugar,
  ~medicine,
  ~ventilatorParameters,
  ~others,
  ~roundsType,
) => {
  createdAt: createdAt,
  admittedTo: admittedTo,
  createdByTelemedicine: createdByTelemedicine,
  neurologicalMonitoring: neurologicalMonitoring,
  hemodynamicParameter: hemodynamicParameter,
  nursingCare: nursingCare,
  arterialBloodGasAnalysis: arterialBloodGasAnalysis,
  ioBalance: ioBalance,
  dialysis: dialysis,
  pressureSoreParameter: pressureSoreParameter,
  bloodSugar: bloodSugar,
  medicine: medicine,
  ventilatorParameters: ventilatorParameters,
  others: others,
  roundsType: roundsType,
}

let neurologicalMonitoring = t => t.neurologicalMonitoring
let hemodynamicParameters = t => t.hemodynamicParameter
let nursingCare = t => t.nursingCare
let arterialBloodGasAnalysis = t => t.arterialBloodGasAnalysis
let ioBalance = t => t.ioBalance
let dialysis = t => t.dialysis
let pressureSoreParameter = t => t.pressureSoreParameter
let bloodSugar = t => t.bloodSugar
let medicine = t => t.medicine
let ventilatorParameters = t => t.ventilatorParameters
let others = t => t.others
let roundsType = t => t.roundsType

let makeRoundsType = d => {
  switch d["rounds_type"] {
  | "NORMAL" => NormalRound
  | "ICU" => ICURound
  | "VENTILATOR" => VentilatorRound
  | _ => NormalRound
  }
}

let makeFromJs = dailyRound => {
  make(
    ~createdAt=DateFns.decodeISO(dailyRound["created_date"]),
    ~admittedTo=dailyRound["admitted_to"],
    ~createdByTelemedicine=dailyRound["created_by_telemedicine"],
    ~neurologicalMonitoring=CriticalCare__NeurologicalMonitoring.makeFromJs(dailyRound),
    ~hemodynamicParameter=CriticalCare__HemodynamicParameters.makeFromJs(dailyRound),
    ~nursingCare=CriticalCare__NursingCare.makeFromJs(dailyRound),
    ~arterialBloodGasAnalysis=CriticalCare__ABGAnalysis.makeFromJs(dailyRound),
    ~ioBalance=CriticalCare__IOBalance.makeFromJs(dailyRound),
    ~dialysis=CriticalCare_Dialysis.makeFromJs(dailyRound),
    ~pressureSoreParameter=CriticalCare__PressureSore.makeFromJs(dailyRound),
    ~bloodSugar=CriticalCare_BloodSugar.makeFromJs(dailyRound),
    ~medicine=Prescription__Prescription.makeFromJs(dailyRound["medication_given"]),
    ~ventilatorParameters=CriticalCare__VentilatorParameters.makeFromJs(dailyRound),
    ~others=CriticalCare__Others.makeFromJs(dailyRound),
    ~roundsType=makeRoundsType(dailyRound),
  )
}
