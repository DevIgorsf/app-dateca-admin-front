import { QuestionTypeEnum } from "./questionTypeEnum";
import { Professor } from "./professor";
import { PointsEnum } from "./pointsEnum";

export interface Question {
  id: number;
  name: string;
  statement: string;
  pointsEnum: PointsEnum;
  questionTypeEnum: QuestionTypeEnum;
  professorCreate: Professor;
}
