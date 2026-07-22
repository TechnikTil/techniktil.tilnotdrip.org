import { Application } from "express";

export default interface Route
{
  init(app: Application): void;
}
