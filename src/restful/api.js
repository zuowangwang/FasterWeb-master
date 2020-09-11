import axios from 'axios'
import store from '../store/state'
import router from '../router'
import {Notification} from 'element-ui';

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'){
    var base_Url = window.location.protocol + '//' + window.location.hostname + ':' +'8000';
}else{
    var base_Url = window.location.protocol + '//' + window.location.host ;
}
export const baseUrl = base_Url;

axios.defaults.withCredentials = true;
axios.defaults.baseURL = baseUrl;

axios.interceptors.request.use(function (config) {
    if (store.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = `JWT ${store.token}`;
    }
    return config;
    },function (error) {
        return Promise.reject(error);
    });
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    try {
        if (error.response.status === 401) {
            Notification.error({
                message: '请先登录'
            });
            router.replace({
                name: 'Login'
            })
        }else if (error.response.status === 500 || error.response.status === 404) {
            Notification.error({
                message: '服务器内部异常, 请检查'
            })
        }else if (error.response.status === 504) {
            Notification.error({
                message: '请求超时,请联系系统管理员'
            })
        }else if (error.response.status === 405) {
          Notification.error({
            message: 'Not Allowed'
          })
        }else{
            if (error.response.data.constructor === String){
                Notification.error({
                    title: 'error',
                    message: error.response.data
                })
            } else {
                for (let key in error.response.data){
                    if (error.response.data[key].constructor === Array){
                        Notification.error({
                            title: key,
                            message: error.response.data[key][0]
                            })
                    }else if (error.response.data[key].constructor === String){
                        Notification.error({
                            title: key,
                            message: error.response.data[key]
                        })
                    }
                }
            }
        }
        return Promise.reject(error.response.data)
    }
    catch (e) {
        Notification.error({
            message: '服务器连接超时，请重试'
        })
    }
});

// user api
// export const register = params => {
//     return axios.post('/api/user/register/', params).then(res => res.data)
// };

export const login = params => {
    return axios.post('/api/user/login/', params).then(res => res)
};

// fastrunner api
export const addProject = params => {
    return axios.post('/api/fastrunner/project/', params).then(res => res)
};

export const deleteProject = url => {
    return axios.delete('/api/fastrunner/project/'+ url + '/').then(res => res)
};

export const getProjectList = params => {
    return axios.get('/api/fastrunner/project/').then(res => res)
};

export const getProjectDetail = pk => {
    return axios.get('/api/fastrunner/dashboard/' + pk + '/').then(res => res)
};

export const getPagination = url => {
    return axios.get(url).then(res => res)
};

export const updateProject = (url, params) => {
    return axios.patch('/api/fastrunner/project/' + url + '/', params).then(res => res)
};

export const addPycode = (data,params) => {
    return axios({url:'/api/fastrunner/pycode/', method:'POST', data:data, params:params})
};

export const deletePycode = (url, params) => {
    return axios.delete('/api/fastrunner/pycode/' + url + '/', params)
};

export const delAllPycode = (data, params) => {
    return axios.delete('/api/fastrunner/pycode/-1', {data, params})
};

export const getPycodeList = params => {
    return axios.get('/api/fastrunner/pycode/', params)
};

export const getPycodeListPaginationBypage = params => {
    return axios.get('/api/fastrunner/pycode/', params)
};

export const getPycode = (url, params) => {
    return axios.get('/api/fastrunner/pycode/' + url + '/', params)
};

export const runPycode = (url, params) => {
    return axios.get('/api/fastrunner/runpycode/' + url + '/', params)
};

export const updatePycode = (url, params, data) => {
    return axios({url:'/api/fastrunner/pycode/' + url + '/', method:'PATCH', params:params,data:data})
};

export const getTree = (url, params) => {
    return axios.get('/api/fastrunner/tree/' + url + '/', params).then(res => res.data)
};

export const updateTree = (url, params) => {
    return axios.patch('/api/fastrunner/tree/' + url + '/', params).then(res => res.data)
};

export const uploadFile = params => {
    return baseUrl + '/api/fastrunner/file/'
};

export const downloadTestdata = params => {
    return axios.post('/api/fastrunner/download/',params,{responseType:'blob' })
};

export const testdataList = params => {
    return axios.get('/api/fastrunner/file/', params).then(res => res.data)
};

export const getTestdataListPaginationBypage = params => {
    return axios.get('/api/fastrunner/file/', params).then(res => res.data)
};

export const deleteTestdata = (url, params) => {
    return axios.delete('/api/fastrunner/file/' + url + '/', params)
};

export const delAllTestdata = (params,data) => {
    return axios.delete('/api/fastrunner/file/-1', {params,data})
};

export const addAPI = params => {
    return axios.post('/api/fastrunner/api/', params).then(res => res.data)
};

export const updateAPI = (url, params) => {
    return axios.patch('/api/fastrunner/api/' + url + '/', params).then(res => res.data)
};

export const apiList = params => {
    return axios.get('/api/fastrunner/api/', params).then(res => res.data)
};

export const delAPI = url => {
    return axios.delete('/api/fastrunner/api/' + url + '/').then(res => res.data)
};

export const delAllAPI = params => {
    return axios.delete('/api/fastrunner/api/', params).then(res => res.data)
};

export const getAPISingle = url => {
    return axios.get('/api/fastrunner/api/' + url + '/').then(res => res.data)
};

export const getPaginationBypage = params => {
    return axios.get('/api/fastrunner/api/', params).then(res => res.data)
};

export const addTestCase = (params, data) => {
    return axios({url:'/api/fastrunner/testcase/', method: 'POST', params:params, data:data})
};

export const updateTestCase = (url, params, data) => {
  return axios({url:'/api/fastrunner/testcase/' + url + '/',method:'PATCH', params:params,data:data})
};

export const testList = params => {
    return axios.get('/api/fastrunner/testcase/', params)
};

export const deleteTest = (url,params) => {
    return axios.delete('/api/fastrunner/testcase/' + url + '/', params)
};

export const delAllTest = (params,data) => {
    return axios.delete('/api/fastrunner/testcase/-1', {params,data})
};

export const coptTest = (params, data) => {
    return axios({url:'/api/fastrunner/testcase/', method: 'POST', params:params, data:data})
};

export const SyncTestCase = (url, params) => {
    return axios({url:'/api/fastrunner/TestCaseSync/' + url + '/', method:'PATCH',params:params})
};

export const editTest = (url,params) => {
    return axios.get('/api/fastrunner/testcase/' + url + '/', params)
};

export const getTestPaginationBypage = params => {
    return axios.get('/api/fastrunner/testcase/', params).then(res => res.data)
};

export const addConfig = params => {
    return axios.post('/api/fastrunner/config/', params).then(res => res.data)
};

export const updateConfig = (url, params) => {
    return axios.patch('/api/fastrunner/config/' + url + '/', params).then(res => res.data)
};


export const configList = params => {
    return axios.get('/api/fastrunner/config/', params).then(res => res.data)
};

export const copyConfig = (url, params) => {
    return axios.post('/api/fastrunner/config/' + url + '/', params).then(res => res.data)
};

export const copyAPI = (url, params) => {
    return axios.post('/api/fastrunner/api/' + url + '/', params).then(res => res.data)
};

export const deleteConfig = url => {
    return axios.delete('/api/fastrunner/config/' + url + '/').then(res => res.data)
};

export const delAllConfig = params => {
    return axios.delete('/api/fastrunner/config/', params).then(res => res.data)
};

export const getConfigPaginationBypage = params => {
    return axios.get('/api/fastrunner/config/', params).then(res => res.data)
};

export const getAllConfig = url => {
    return axios.get('/api/fastrunner/config/' + url + '/').then(res => res.data)
};

export const runSingleAPI = params => {
    return axios.post('/api/fastrunner/run_api/', params).then(res => res.data)
};

export const runAPIByPk = (url, params) => {
    return axios.get('/api/fastrunner/run_api_pk/' + url + '/', params).then(res => res.data)
};

export const runAPITree = params => {
    return axios.post('/api/fastrunner/run_api_tree/', params).then(res => res.data)
};

export const runTestByPk = (url, data) => {
    return axios.post('/api/fastrunner/run_testsuite_pk/' + url + '/', data).then(res => res.data)
};

export const runSuiteTree = params => {
    return axios.post('/api/fastrunner/run_suite_tree/', params).then(res => res.data)
};

export const runScheduleTest = url => {
    return axios.get('/api/fastrunner/run_schedule_test/' + url + '/')
};

export const addVariables = params => {
    return axios.post('/api/fastrunner/variables/', params).then(res => res.data)
};

export const variablesList = params => {
    return axios.get('/api/fastrunner/variables/', params).then(res => res.data)
};

export const getVariablesPaginationBypage = params => {
    return axios.get('/api/fastrunner/variables/', params).then(res => res.data)
};

export const updateVariables = (url, params) => {
    return axios.patch('/api/fastrunner/variables/' + url + '/', params).then(res => res.data)
};

export const deleteVariables = url => {
    return axios.delete('/api/fastrunner/variables/' + url + '/').then(res => res.data)
};

export const delAllVariabels = params => {
    return axios.delete('/api/fastrunner/variables/', params).then(res => res.data)
};

export const reportList = params => {
    return axios.get('/api/fastrunner/reports/', params).then(res => res.data)
};

export const deleteReports = (url,params) => {
    return axios.delete('/api/fastrunner/reports/' + url + '/',params)
};

export const getReportsPaginationBypage = params => {
    return axios.get('/api/fastrunner/reports/', params).then(res => res.data)
};

export const delAllReports = (data,params) => {
    return axios({url:'/api/fastrunner/reports/-1', method:'delete', params:params, data:data})
};

export const watchSingleReports = (url,params) => {
    return axios.get('/api/fastrunner/reports/' + url + '/', params)
};

export const addTask = (params, data) => {
    return axios({url:'/api/fastrunner/schedule/', method: 'POST', params:params, data:data})
};

export const copySchedule = (params, data)  => {
    return axios({url:'/api/fastrunner/schedule/', method: 'POST', params:params, data:data})
};

export const updateTask = (url, params, data) => {
    return axios({url:'/api/fastrunner/schedule/' + url + '/', method: 'PATCH', params:params, data:data})
};

export const taskList = params => {
    return axios.get('/api/fastrunner/schedule/', params).then(res => res.data)
};
export const getTaskPaginationBypage = params => {
    return axios.get('/api/fastrunner/schedule/', params).then(res => res.data)
};
export const deleteTasks = (url,params) => {
    return axios.delete('/api/fastrunner/schedule/' + url + '/',params)
};
export const deleteSelectTasks = (params, data) => {
    return axios.delete('/api/fastrunner/schedule/-1/', {params:params, data:data})
};
export const addHostIP = (params, data) => {
    return axios({url:'/api/fastrunner/host_ip/', method: 'POST', params:params, data:data})
};

export const hostList = params => {
    return axios.get('/api/fastrunner/host_ip/', params)
};

export const updateHost = (url, params, data) => {
    return axios({url:'/api/fastrunner/host_ip/' + url + '/',method:'PATCH', params:params,data:data})
};

export const deleteHost = (url, params)=> {
    return axios.delete('/api/fastrunner/host_ip/' + url + '/',params)
};

export const delAllHost = (params,data) => {
    return axios.delete('/api/fastrunner/host_ip/-1', {params,data})
};

export const copyHost = (params, data)  => {
    return axios({url:'/api/fastrunner/host_ip/', method: 'POST', params:params, data:data})
};

export const getHostPaginationBypage = params => {
    return axios.get('/api/fastrunner/host_ip/', params).then(res => res.data)
};

export const getTaskMetaDataList = params => {
    return axios.get('/api/fastrunner/taskmeta/', params)
};

export const lockFile = (params, data) => {
    return axios({url:'/api/fastrunner/lock_file/',method:'POST', params:params,data:data})
};
