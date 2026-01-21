"use client";

import { useState } from "react";
import { 
  Plus, Calendar, AlertCircle, CheckCircle, 
  MoreHorizontal, ArrowRight, ArrowLeft, Trash2, MapPin, User, X
} from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { createTask, updateTaskStatus, deleteTask } from "@/app/dashboard/tasks/actions";

export default function TasksBoard({ tasks, properties, contacts }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estado para nueva tarea
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    due_date: "",
    property_id: "",
    contact_id: ""
  });

  // Agrupar tareas por columnas
  const columns = {
    todo: tasks.filter((t: any) => t.status === 'todo'),
    in_progress: tasks.filter((t: any) => t.status === 'in_progress'),
    done: tasks.filter((t: any) => t.status === 'done'),
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
        ...newTask,
        due_date: newTask.due_date ? new Date(newTask.due_date).toISOString() : null,
        property_id: (!newTask.property_id || newTask.property_id === "none") ? null : newTask.property_id,
        contact_id: (!newTask.contact_id || newTask.contact_id === "none") ? null : newTask.contact_id
    };
    await createTask(payload);
    setLoading(false);
    setIsModalOpen(false);
    setNewTask({ title: "", description: "", priority: "medium", status: "todo", due_date: "", property_id: "", contact_id: "" });
  };

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure you want to delete this task?")) {
        await deleteTask(id);
    }
  };

  // Helper de colores para prioridad
  const getPriorityColor = (p: string) => {
    switch(p) {
        case 'high': return 'bg-red-100 text-red-700 border-red-200';
        case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'low': return 'bg-green-100 text-green-700 border-green-200';
        default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Componente de Tarjeta
  const TaskCard = ({ task }: { task: any }) => (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow group animate-in fade-in zoom-in duration-200">
        
        {/* Header Tarjeta */}
        <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                {task.priority}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 {/* Botones de Mover Rápidos */}
                {task.status !== 'todo' && (
                    <button onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'in_progress' : 'todo')} className="p-1 hover:bg-gray-100 rounded text-gray-500" title="Move Back">
                        <ArrowLeft size={14} />
                    </button>
                )}
                {task.status !== 'done' && (
                    <button onClick={() => updateTaskStatus(task.id, task.status === 'todo' ? 'in_progress' : 'done')} className="p-1 hover:bg-gray-100 rounded text-gray-500" title="Move Forward">
                        <ArrowRight size={14} />
                    </button>
                )}
                <button onClick={() => handleDelete(task.id)} className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded ml-1">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>

        <h4 className="font-semibold text-gray-900 text-sm mb-1">{task.title}</h4>
        {task.description && <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>}

        {/* Info Extra */}
        <div className="space-y-1.5 pt-2 border-t border-gray-50">
            {task.due_date && (
                <div className={`flex items-center gap-1.5 text-xs ${isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && task.status !== 'done' ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                    <Calendar size={12} />
                    {format(new Date(task.due_date), "MMM d, yyyy")}
                </div>
            )}
            
            {task.properties && (
                <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded w-fit max-w-full">
                    <MapPin size={10} className="shrink-0" />
                    <span className="truncate">{task.properties.reference}</span>
                </div>
            )}
             {task.contacts && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded w-fit max-w-full">
                    <User size={10} className="shrink-0" />
                    <span className="truncate">{task.contacts.full_name}</span>
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                <p className="text-gray-500 text-sm">Manage your daily to-dos.</p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center bg-[#0048BC] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#003895] transition"
            >
                <Plus className="mr-2 h-4 w-4" /> New Task
            </button>
        </div>

        {/* KANBAN BOARD */}
        <div className="flex-1 overflow-x-auto pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[800px] h-full">
                
                {/* COLUMN 1: TO DO */}
                <div className="flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-200/60">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full border-2 border-gray-400"></div>
                            <h3 className="font-bold text-gray-700 text-sm">To Do</h3>
                        </div>
                        <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{columns.todo.length}</span>
                    </div>
                    <div className="p-3 flex-1 overflow-y-auto space-y-3">
                        {columns.todo.map((task: any) => <TaskCard key={task.id} task={task} />)}
                    </div>
                </div>

                {/* COLUMN 2: IN PROGRESS */}
                <div className="flex flex-col h-full bg-blue-50/30 rounded-xl border border-blue-100">
                    <div className="p-3 border-b border-blue-100 flex justify-between items-center bg-blue-50/50 rounded-t-xl">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin-slow"></div> 
                            {/* Icono animado simple o estatico */}
                            <h3 className="font-bold text-blue-900 text-sm">In Progress</h3>
                        </div>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{columns.in_progress.length}</span>
                    </div>
                    <div className="p-3 flex-1 overflow-y-auto space-y-3">
                         {columns.in_progress.map((task: any) => <TaskCard key={task.id} task={task} />)}
                    </div>
                </div>

                {/* COLUMN 3: DONE */}
                <div className="flex flex-col h-full bg-green-50/30 rounded-xl border border-green-100">
                    <div className="p-3 border-b border-green-100 flex justify-between items-center bg-green-50/50 rounded-t-xl">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-600" />
                            <h3 className="font-bold text-green-900 text-sm">Done</h3>
                        </div>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{columns.done.length}</span>
                    </div>
                    <div className="p-3 flex-1 overflow-y-auto space-y-3 opacity-75">
                         {columns.done.map((task: any) => <TaskCard key={task.id} task={task} />)}
                    </div>
                </div>

            </div>
        </div>

        {/* MODAL NUEVA TAREA */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="font-bold text-lg">Create Task</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSave} className="p-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium block mb-1">Title</label>
                            <input required className="w-full border rounded-lg p-2 text-sm" placeholder="e.g. Call Notary" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-sm font-medium block mb-1">Due Date</label>
                            <input type="datetime-local" className="w-full border rounded-lg p-2 text-sm" value={newTask.due_date} onChange={e => setNewTask({...newTask, due_date: e.target.value})} />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium block mb-1">Priority</label>
                                <select className="w-full border rounded-lg p-2 text-sm bg-white" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">Status</label>
                                <select className="w-full border rounded-lg p-2 text-sm bg-white" value={newTask.status} onChange={e => setNewTask({...newTask, status: e.target.value})}>
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                        </div>
                         {/* Selectores de Relación */}
                         <div>
                            <label className="text-sm font-medium block mb-1">Related Property</label>
                            <select className="w-full border rounded-lg p-2 text-sm bg-white" onChange={e => setNewTask({...newTask, property_id: e.target.value})}>
                                <option value="none">-- None --</option>
                                {properties?.map((p: any) => <option key={p.id} value={p.id}>{p.reference} - {p.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium block mb-1">Related Contact</label>
                            <select className="w-full border rounded-lg p-2 text-sm bg-white" onChange={e => setNewTask({...newTask, contact_id: e.target.value})}>
                                <option value="none">-- None --</option>
                                {contacts?.map((c: any) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                            </select>
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#0048BC] text-white rounded-lg text-sm hover:bg-[#003895]">{loading ? 'Creating...' : 'Create Task'}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}