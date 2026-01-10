import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import catchAsync from "../../common/catchAsync.js";
import epicService from "./epic.service.js";

const epicController = {
    getAllEpicsByProject: catchAsync(async (req, res) => {
        const { projectId } = req.params;
        const epics = await epicService.findAllByProject(projectId);
        res.status(200).json(new SuccessResponseDto(epics));
    }),

    getEpic: catchAsync(async (req, res) => {
        const { id } = req.params;
        const epic = await epicService.findOne(id);
        res.status(200).json(new SuccessResponseDto(epic));
    }),

    createEpic: catchAsync(async (req, res) => {
        const { projectId } = req.params;
        const epicData = { ...req.body, projectId };
        const newEpic = await epicService.create(epicData);
        res.status(201).json(new SuccessResponseDto(newEpic));
    }),

    updateEpic: catchAsync(async (req, res) => {
        const { id } = req.params;
        const updatedEpic = await epicService.update(id, req.body);
        res.status(200).json(new SuccessResponseDto(updatedEpic));
    }),

    deleteEpic: catchAsync(async (req, res) => {
        const { id } = req.params;
        await epicService.delete(id);
        res.status(200).json(new SuccessResponseDto(null, "Epic deleted successfully"));
    }),

    // Executor management
    getExecutors: catchAsync(async (req, res) => {
        const { epicId } = req.params;
        const executors = await epicService.getExecutors(epicId);
        res.status(200).json(new SuccessResponseDto(executors));
    }),

    addExecutor: catchAsync(async (req, res) => {
        const { epicId } = req.params;
        const { employeeId } = req.body;
        const executor = await epicService.addExecutor(epicId, employeeId);
        res.status(201).json(new SuccessResponseDto(executor));
    }),

    removeExecutor: catchAsync(async (req, res) => {
        const { epicId, employeeId } = req.params;
        await epicService.removeExecutor(epicId, employeeId);
        res.status(200).json(new SuccessResponseDto(null, "Executor removed successfully"));
    }),
};

export default epicController;
