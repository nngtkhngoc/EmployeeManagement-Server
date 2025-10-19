export class SuccessResponseDto {
  code = "SUCCESS";
  data;
  constructor(data) {
    this.data = data;
  }
}
