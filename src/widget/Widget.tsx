import React, { useEffect, useState } from 'react';

import { Typography, Box, Link, ListItem, Divider, List } from "@mui/material";
import { BoxProps } from "@mui/material/Box";

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

import { PredefinedErrorBoundary } from 'lumapps-sdk-js';

import moment from 'moment';

import { Theme } from '@lumx/react';

import { getTodoListsFromGraph, getTodoElementsFromGraph } from './ms_graph';
import type { Task, TodoList } from "./types";

type Widget = import('lumapps-sdk-js').ContentComponent<
    import('./types').SampleAppGlobalParams,
    import('./types').SampleAppParams
>;

function Item(props: BoxProps) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 1,
        ...sx
      }}
      {...other}
    />
  );
}

function TaskRender(props:any) {
  const completed = props.status === "notStarted" ? false : true;
  const status = completed ? "Completed" : "Not started";
  const backgroundColorCompleted = completed ? "#efefef" : "";
  const colorCompleted = completed ? "#959494 !important" : "black";
  const dueDate = moment(props.dueDateTime).format("YYYY-MM-DD HH:mm");
  const runningLateColor = moment(new Date(), "YYYY-MM-DD HH:mm").diff(dueDate) > 0 && !completed ? "red": "";
  return (
    <Box
      sx={{
        display: "flex",
        p: 1,
        width: "100%",
        borderRadius:"5px",
        color: { colorCompleted },
        backgroundColor: backgroundColorCompleted,
        padding: "0px",
        minHeight: "70px",
      }}
    >
      <Item sx={{ width:"40px", color: { colorCompleted }}}>
        { props?.importance === "high" && <KeyboardArrowUpIcon sx={{ color: completed ? colorCompleted : "red" }}  /> }
        { props?.importance !== "high" && <HorizontalRuleIcon sx={{ color: completed ? colorCompleted : "#1a81e3" }}  /> }
      </Item>
      <Item sx={{ flexGrow: 1, color: colorCompleted}}>
        <Typography variant="body1" sx={{ paddingBottom:"5px", color: colorCompleted}}>
          <Link href="https://to-do.office.com/tasks/inbox?auth=2" target="_" sx={{textDecoration: "none", color: "inherit"}}>{`${props.title} ` }</Link>
          { props.reminder &&
              <NotificationsIcon sx={{ width: "18px", verticalAlign: "bottom", color: colorCompleted}} />
          }
          { !props.reminder &&
              <NotificationsOffIcon sx={{ width: "18px", verticalAlign: "bottom", color: colorCompleted}} />
          }
        </Typography>
        { props.dueDateTime &&
          <Typography variant="subtitle2" sx={{ paddingBottom:"5px", fontSize:"12px", color: runningLateColor}}><QueryBuilderIcon  sx={{ paddingBottom:"5px", width: "14px", verticalAlign: "middle", color: colorCompleted}} />{`\u00A0 ${dueDate}`}</Typography>
        }
        {
         // Empty text ... 
        }
        { props.description !== "<div><font size=\"2\"><span style=\"font-size:11pt;\"><div class=\"PlainText\">&nbsp;</div></span></font></div>" && <div dangerouslySetInnerHTML={{ __html: `<i>${props.description}</i>` }} /> }
      </Item>
      <Item sx={{ color: colorCompleted }}>
        { props.status &&
          <Typography variant="body2" sx={{ paddingBottom:"5px", color: colorCompleted}}><i>{ status }</i></Typography>
        }
      </Item>
    </Box>
  );
}

function NoTask() {
  return (
    <Box
      sx={{
        display: "flex",
        p: 1,
        width: "100%"
      }}
    >
      <Item sx={{ margin:"auto", padding: "70px" }}>
        <img src="/reminder.svg" style={{ width:"100px" }} alt='No task today' />
        <Typography variant="body1" sx={{ textAlign: "center" }}>No task today</Typography>
      </Item>
    </Box>
  );
}

const Widget: Widget = ({ value = {}, globalValue = {}, theme = Theme.light }) => {
  const [ cursorList, setCursorList ] = useState<string>("");
  const [ cursorTasks, setCursorTasks ] = useState<string>("");
  const [ taskLists, setTaskLists ] = useState<TodoList[]>([]);
  const [ tasks, setTasks ] = useState<Task[]>([]);
  const [ taskList, setTaskList ] = useState<TodoList|undefined>();

  async function getTodoLists() {
    var ret = await getTodoListsFromGraph({cursorList});
    setTaskLists(ret.value);
    if (ret['@odata.nextLink']) {
      setCursorList(ret['@odata.nextLink']);
    } else {
      setCursorList("");
    }
    if (!taskList && ret.value.length > 0) {
      setTaskList(ret.value[0])
    } 
  }

  async function getTodoTasks() {
    var ret = await getTodoElementsFromGraph({cursorTasks, taskList});
    setTasks(ret.value);
    if (ret['@odata.nextLink']) {
      setCursorTasks(ret['@odata.nextLink']);
    } else {
      setCursorTasks("");
    }
  }

  useEffect(() => {
    getTodoLists();
  }, []);

  useEffect(() => {
    getTodoTasks();
  }, [taskList]);

  return (
    <div style={{ minWidth:"400px" }}>
      <Typography sx={{padding:"10px"}} variant="h1" fontSize="1rem" fontWeight="500" >My tasks for today</Typography>
      <Divider
        variant="inset"
        sx={{ marginLeft: "20px", marginRight: "30px" }}
      />
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper"
        }}
      >
        {tasks?.map((element:Task, idx:any) => {
          return (
            <>
              <ListItem key={ `item-${element.id}` } alignItems="flex-start" sx={{width: "100%"}}>
                <TaskRender
                  title={element.title}
                  description={element.description}
                  importance={element.importance}
                  reminder={element.isReminderOn}
                  status={element.status}
                  dueDateTime={element.dueDateTime}
                />
              </ListItem>
              {tasks.length !== idx + 1 && (
                <Divider
                  key={ `divider-${element.id}` }
                  variant="inset"
                  component="li"
                  sx={{ marginLeft: "60px", marginRight: "60px" }}
                />
              )}
            </>
          );
        })}
        {!tasks && NoTask()}
      </List>
    </div>
  );
};

const CalendarWidgetExtension: Widget = (props) => {
    return (
      <PredefinedErrorBoundary>
          <Widget {...props} />
      </PredefinedErrorBoundary>
    );
};

export { CalendarWidgetExtension as Widget };
