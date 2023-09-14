import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Natan Bunkerd",
    studentId: "650610777",
  });
};
