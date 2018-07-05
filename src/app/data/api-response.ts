export class ApiResponse<T> {

  status: number;

  data: T;

  message: string;

  exceptions: Array<any>;

}
