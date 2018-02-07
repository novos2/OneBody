import {Employee} from "./employee";
import {Patient} from "./patient";

export class Treatment{
  constructor(
    public treatmentType:string,
    public employeeID: number,
    public patientID: number,
    public treatmentStartDate: string,
    public treatmentEndDate: string,
    public treatmentRoom: string,
    public notes: string
  ){}
}
