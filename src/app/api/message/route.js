import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const roomId = request.nextUrl.searchParams.get("roomId");
  const foundRoommesId = [];
  readDB();
  const foundId = DB.rooms.find((x) => x.roomId === roomId);
  for (const messageId of DB.messages) {
    if (messageId.roomId === roomId) {
      foundRoommesId.push(messageId);
    }
  }
  if (!foundId) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
  const messages = foundRoommesId;
  return NextResponse.json({
    ok: true,
    messages,
  });
};

export const POST = async (request) => {
  const body = await request.json();
  const { roomId, messageText } = body;
  readDB();
  const foundroom = DB.rooms.find((x) => x.roomId === roomId);
  if (!foundroom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();
  DB.messages.push({
    roomId,
    messageId,
    messageText,
  });
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: messageText,
  });
};

export const DELETE = async (request) => {
  const body = await request.json();
  const messageId = body.messageId;
  const payload = checkToken();
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  } else if (payload.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();
  const foundmessage = DB.messages.find((x) => x.messageId === messageId);
  if (!foundmessage) {
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }
  DB.messages = DB.messages.filter((x) => x.messageId !== messageId);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
