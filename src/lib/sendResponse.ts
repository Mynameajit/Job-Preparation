import { NextResponse } from "next/server";

export const sendResponse = (
  success: boolean,
  statusCode: number,
  message: string,
  data: any = null
) => {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status: statusCode }
  );
};
