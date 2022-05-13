import { Router } from 'express';
import TodoController from '../handlers/todo.handler';
import catchAsyncErrors from '../middleware/catch-async-errors';

const router = Router();
const todoController = new TodoController();

router.get('/todos', catchAsyncErrors(todoController.getAllTodos));
router.get('/todos/:id', catchAsyncErrors(todoController.getOneTodo));
router.delete('/todos/:id', catchAsyncErrors(todoController.deleteTodo));
router.post('/create-todo', catchAsyncErrors(todoController.createTodo));
router.patch('/edit-todo/:id', catchAsyncErrors(todoController.editTodo));

export { router as todoRoutes };
