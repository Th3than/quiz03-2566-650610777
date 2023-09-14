import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  const rooms = [];
  let totalRooms = 0;
  for (const room of DB.rooms) {
    rooms.push(room);
    totalRooms++;
  }
  return NextResponse.json({
    ok: true,
    rooms,
    totalRooms,
  });
};

export const POST = async (request) => {
  const body = await request.json();
  const roomName = body.roomName;
  const payload = checkToken();
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();
  for (const roomsName of DB.rooms) {
    if (roomName === roomsName.roomName) {
      return NextResponse.json(
        {
          ok: false,
          message: `Room ${roomName} already exists`,
        },
        { status: 400 }
      );
    }
  }

  const roomId = nanoid();
  DB.rooms.push({
    roomId,
    roomName,
  });
  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
