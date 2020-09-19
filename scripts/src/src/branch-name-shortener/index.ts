export function shortenBranchName(branchname: string, length: number) {
  const nonSpecialChars = branchname.replace(/([^a-zA-Z0-9])/, "");
  return nonSpecialChars.slice(0, length);
}
