import { Price } from "@/types/types";

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // production URL.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // automatically set by Vercel
    "http://localhost:3000/";
  url = url.includes("http") ? url : `https://${url}`;
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};

export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: { price: Price };
}) => {
  console.log("posting,", url, data);

  const response: Response = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.log("Error in postData", { url, data, res: response });

    throw Error(response.statusText);
  }

  return response.json();
};

export const toDateTime = (seconds: number) => {
  var date = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  date.setSeconds(seconds);
  return date;
};
