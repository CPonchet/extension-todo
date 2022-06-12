import axios from "axios";
import { useContext, useCurrentUser } from 'lumapps-sdk-js';
import { TodoLists, TaskList, TodoList } from "./types";

const { token } = useCurrentUser();
const { baseUrl } = useContext();

//axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
axios.defaults.withCredentials = true;

const axios_instance = axios.create({
  baseURL: "https://graph.microsoft.com/v1.0/me",
  headers: {
    "Content-Type": "application/json",
  },
});

axios_instance.interceptors.request.use(
  (config) => {
    const ms_access_token = localStorage.getItem('ms_access_token');
    if (ms_access_token) {
      config.headers["Authorization"] = `Bearer ${ms_access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios_instance.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const config = error.config;
  if(error.response && error.response.status === 401) {
      await renewToken();
      return axios_instance(config);
  }
  return Promise.reject(error)
});

export async function getTodoListsFromGraph(props: { cursorList: string; }) : Promise<TodoLists> {
  return await axios_instance.get("/todos/list?$select=id,displayName", {
    params: { cursor: props.cursorList }
  })
}

export async function getTodoElementsFromGraph(props: {cursorTasks:string; taskList:TodoList | undefined;}) : Promise<TaskList> {
  return await axios_instance.get(`/todos/list/${props.taskList?.id}/tasks`, { params: { cursor: props.cursorTasks} })
}

async function renewToken() {
    return await axios.post(`${baseUrl}/user/service/getToken`, {}, {
      headers: {
          Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      localStorage.setItem('ms_access_token', response.data.access_token);
    });

}

export default axios_instance;  