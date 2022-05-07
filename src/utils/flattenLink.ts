/**
 *
 * @param link
 */
export async function flattenLink(link: string): Promise<string> {
  const rawlink = link;
  const linky = await rawlink.replace(/^https?:\/\//i, "");
  const linky2 = await linky.split(".").slice(-2).join(".");
  const linky3 = await linky2.split("/")[0];
  return linky3;
}