import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import catchAsync from "../../common/catchAsync.js";
import taskService from "./task.service.js";

const taskController = {
    getAllTasksByEpic: catchAsync(async (req, res) => {
        const { epicId } = req.params;
        const tasks = await taskService.findAllByEpic(epicId);
        res.status(200).json(new SuccessResponseDto(tasks));
    }),

    getTask: catchAsync(async (req, res) => {
        const { id } = req.params;
        const task = await taskService.findOne(id);
        res.status(200).json(new SuccessResponseDto(task));
    }),

    createTask: catchAsync(async (req, res) => {
        const { epicId } = req.params;
        const taskData = { ...req.body, epicId };
        const newTask = await taskService.create(taskData);
        res.status(201).json(new SuccessResponseDto(newTask));
    }),

    updateTask: catchAsync(async (req, res) => {
        const { id } = req.params;
        const updatedTask = await taskService.update(id, req.body);
        res.status(200).json(new SuccessResponseDto(updatedTask));
    }),

    deleteTask: catchAsync(async (req, res) => {
        const { id } = req.params;
        await taskService.delete(id);
        res.status(200).json(new SuccessResponseDto(null, "Task deleted successfully"));
    }),

    // Set assignments (replace all)
    setAssignments: catchAsync(async (req, res) => {
        const { taskId } = req.params;
        const { employeeIds } = req.body;
        const task = await taskService.setAssignments(taskId, employeeIds || []);
        res.status(200).json(new SuccessResponseDto(task));
    }),
};

export default taskController;
