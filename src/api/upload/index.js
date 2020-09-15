//所有分类相关的请求都在此发出
import request from "@/utils/request";

const BASE_URL = "/uploadtoken";

export function reqQiniuToken() {
  return request({
    url: BASE_URL,
		method: "GET",
  });
}
