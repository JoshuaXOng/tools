import { getLineCount, isIntConvertable } from "./utils";

export const validateCmdValue = (input: string) => {
	if (input.replace(" ", "").length === 0 || !input)
		return "No empty values allowed.";

	if (input[0] !== ":")
		return "I don't know why, but please put : at the start of the input.";

	if (!isIntConvertable(input.slice(1))) 
		return "Only numbers should proceed the colon.";

	if (parseInt(input.slice(1)) < 1)
		return "A value above 1 please.";

	if (getLineCount() && parseInt(input.slice(1)) > getLineCount()!)
		return `A value below ${getLineCount()!} please.`;
} 

export enum JumpType {
	absolute
}

export const decodeCmdValue = (value: string) => {
	if (value[0] === ":") 
    return { jumpType: JumpType.absolute, lineNo: Number(value.slice(1)) }
}
