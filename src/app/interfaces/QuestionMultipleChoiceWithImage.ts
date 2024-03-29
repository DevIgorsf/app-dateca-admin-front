import { Course } from "./course";
import { PointsEnum } from "./pointsEnum";
import { Professor } from "./professor";
import { QuestionTypeEnum } from "./questionTypeEnum";

export interface QuestionMultipleChoiceWithImage {
  id?: any;
  idImages?: string[];
  statement?: any;
  pointsEnum?: any;
  course: any;
  correctAnswer: any;
  alternativeA: any;
  alternativeB: any;
  alternativeC: any;
  alternativeD: any;
  alternativeE: any;
  [key: string]: any;
}