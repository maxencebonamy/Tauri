import { fakeUser } from "@/factories/user.factory"
import type { Notification } from "@/types/notification"

export const fakeNotification = (): Notification => {
	return {
		id: 1,
		message: "Test",
		checked: true,
		type: "BONUS_MALUS",
		userTo: fakeUser(),
		userFrom: fakeUser()
	}
}