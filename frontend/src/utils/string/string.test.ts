import { expect, test } from "vitest"
import { extractNames } from "."

test("extractNames", () => {
	expect(extractNames("DOE John")).toEqual({
		firstName: "John",
		lastName: "DOE"
	})

	expect(extractNames("DOE  John")).toEqual({
		firstName: "John",
		lastName: "DOE"
	})

	expect(extractNames("DOE John John")).toEqual({
		firstName: "John John",
		lastName: "DOE"
	})

	expect(extractNames("John")).toEqual({
		firstName: "John",
		lastName: ""
	})

	expect(extractNames("")).toEqual({
		firstName: "",
		lastName: ""
	})
})