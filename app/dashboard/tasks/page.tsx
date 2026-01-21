import { getTasks, getSelectOptions } from "@/app/dashboard/tasks/actions";
import TasksBoard from "@/components/tasks/TasksBoard";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const tasks = await getTasks();
  const { properties, contacts } = await getSelectOptions();

  return (
    <div className="h-[calc(100vh-100px)]"> 
      {/* Ajustamos la altura para que el scroll del kanban funcione bien */}
      <TasksBoard 
        tasks={tasks || []} 
        properties={properties || []}
        contacts={contacts || []}
      />
    </div>
  );
}