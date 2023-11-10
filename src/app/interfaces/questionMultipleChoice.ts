import { Course } from "./course";
import { PointsEnum } from "./pointsEnum";
import { Professor } from "./professor";
import { QuestionAlternative } from "./questionAlternative";
import { QuestionTypeEnum } from "./questionTypeEnum";

export interface QuestionMultipleChoice {
  id?: any;
  statement?: any;
  pointsEnum?: any;
  courseName: any;
  correctAnswer: any;
  alternativeA: any;
  alternativeB: any;
  alternativeC: any;
  alternativeD: any;
  alternativeE: any;
}
