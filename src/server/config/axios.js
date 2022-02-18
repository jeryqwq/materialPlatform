import { message } from 'antd';
import { get as _get } from 'lodash';

/**
 * 网络请求配置
 */
import axios from 'axios';

axios.defaults.timeout = 100000;

/**
 * http request 拦截器
 */
axios.interceptors.request.use(
  (config) => {
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/json',
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * http response 拦截器
 */
axios.interceptors.response.use(
  (response) => {
    const code = _get(response, 'data.code', 0);
    if (response.data.code !== 200) {
      msg(response);
    }
    console.info('请求结果 :', response.data);
    return response;
  },
  (error) => {
    console.error('请求出错：', error);
    message.error('请求出错!');
    return error;
  },
);

/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      (response = {}) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      },
    );
  });
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        msg(err);
        reject(err);
      },
    );
  });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        msg(err);
        reject(err);
      },
    );
  });
}

//失败提示
function msg(err) {
  const msg = _get(err, 'data.message', '请求错误!');
  msg && message.error(msg);
  if (err && err.message) {
    // switch (err.response.code) {
    //   case 400:
    //     message.error(err.response.message);
    //     break;
    //   case 401:
    //     message.error('未授权，请登录');
    //     break;
    //   case 403:
    //     message.error('拒绝访问');
    //     break;
    //   case 404:
    //     message.error('请求地址出错');
    //     break;
    //   case 408:
    //     message.error('请求超时');
    //     break;
    //   case 500:
    //     message.error('服务器内部错误');
    //     break;
    //   case 501:
    //     message.error('服务未实现');
    //     break;
    //   case 502:
    //     message.error('网关错误');
    //     break;
    //   case 503:
    //     message.error('服务不可用');
    //     break;
    //   case 504:
    //     message.error('网关超时');
    //     break;
    //   case 505:
    //     message.error('HTTP版本不受支持');
    //     break;
    //   default:
    // }
  }
}

//统一接口处理，返回数据
export default {
  get,
  post,
  put,
};
