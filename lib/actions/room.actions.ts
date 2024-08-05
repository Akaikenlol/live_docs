"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

export const createDocument = async ({
	userId,
	email,
}: CreateDocumentParams) => {
	const roomId = nanoid();

	try {
		const metadata = {
			creatorId: userId,
			email,
			title: "Untitled",
		};

		const usersAccesses: RoomAccesses = {
			[email]: ["room:write"],
		};
		const room = await liveblocks.createRoom(roomId, {
			metadata,
			usersAccesses,
			defaultAccesses: ["room:write"],
		});

		revalidatePath("/");

		return parseStringify(room);
	} catch (error: any) {
		console.log(`Error happened while creating a room: ${error}`);
		console.log(error.message);
	}
};

export const getDocument = async ({
	roomId,
	userId,
}: {
	roomId: string;
	userId: string;
}) => {
	try {
		const room = await liveblocks.getRoom(roomId);

		// TO DO: To Bring This Back

		// const hasAccess = Object.keys(room.usersAccesses).includes(userId);

		// if (!hasAccess) {
		// 	throw new Error("You do not have an access to this document!");
		// }

		return parseStringify(room);
	} catch (error: any) {
		console.log(`Error happened while getting a room: ${error}`);
		console.log(error.message);
	}
};
