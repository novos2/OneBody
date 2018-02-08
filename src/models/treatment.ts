import {Employee} from "./employee";
import {Patient} from "./patient";

export class Treatment{
  constructor(
    public treatmentType:string,
    public employeeName: string,
    public patientName: string,
    public treatmentStartDate: string,
    public treatmentEndDate: string,
    public treatmentRoom: string,
    public notes: string
  ){}
}
