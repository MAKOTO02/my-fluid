import { Transform } from "./transform";

export class GameObject {
  transform: Transform;

  constructor() {
    this.transform = new Transform();
  }
}