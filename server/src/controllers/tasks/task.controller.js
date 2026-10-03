import { taskService } from "../../services/index.js";
import httpStatus from "http-status";
import pick from "../../utils/pick.js";

import catchAsync from "../../utils/catchAsync.js";

export const createTask = catchAsync(async (req, res) => {
  const newTask = await taskService.createTask(req.body, req.user);
  res.status(httpStatus.CREATED).send({ code: 1, newTask });
});

export const getTasks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["title", "status", "priority"]);

  const options = pick(req.query, ["sortBy", "sortOrder", "limit", "page"]);

  const results = await taskService.getTasks(filter, options,req.user);

  res.send({
    code: 1,
    results,
  });
});

export const getTaskById = catchAsync(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id,req.user);
  res.send({ task, code: 1 });
});

export const updateTaskById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updatedTask = await taskService.updateTaskById(
    id,
    req.body,
    req.user
  );

  res.send({
    code: 1,
    data: updatedTask,
  });
});

export const deleteTaskById = catchAsync(async(req,res)=>{
    await taskService.deleteTaskById(req.params.id,req.user);
    res.status(httpStatus.OK).send({ code: 1 });
})