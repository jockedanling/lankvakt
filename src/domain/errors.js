export class InvalidLinkError extends Error {
  constructor() {
    super("The text is not a valid link");
    this.name = "InvalidLinkError";
  }
}
