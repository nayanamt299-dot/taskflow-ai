import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, Pencil, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import { useToast } from "../components/Toast";

const statuses = ["Todo", "In Progress", "Done"];
const priorities = ["Low", "Medium", "High", "Urgent"];

const emptyForm = {
  title: "",
  description: "",
  status: "Todo",
  priority: "Medium",
  dueDate: "",
  project: "",
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  async function load() {
    setLoading(true);

    try {
      const [taskResponse, projectResponse] = await Promise.all([
        api.get("/tasks"),
        api.get("/projects"),
      ]);

      setTasks(taskResponse.data.tasks || []);
      setProjects(projectResponse.data.projects || []);
    } catch (error) {
      toast(error.response?.data?.message || "Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query);

      const matchesStatus =
        !statusFilter || task.status === statusFilter;

      const matchesPriority =
        !priorityFilter || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  function startCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function edit(task) {
    setEditing(task);

    setForm({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "Todo",
      priority: task.priority || "Medium",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 10)
        : "",
      project: task.project?._id || task.project || "",
    });

    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  }

  async function save(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      toast("Task title is required", "error");
      return;
    }

    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
      };

      if (editing) {
        await api.put(`/tasks/${editing._id}`, payload);
        toast("Task updated successfully");
      } else {
        await api.post("/tasks", payload);
        toast("Task created successfully");
      }

      closeForm();
      load();
    } catch (error) {
      toast(
        error.response?.data?.message || "Failed to save task",
        "error"
      );
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      toast("Task deleted successfully");
      load();
    } catch (error) {
      toast(
        error.response?.data?.message || "Failed to delete task",
        "error"
      );
    }
  }

  async function changeStatus(task, status) {
    try {
      await api.patch(`/tasks/${task._id}/status`, { status });
      toast("Task status updated");
      load();
    } catch (error) {
      toast(
        error.response?.data?.message || "Failed to update status",
        "error"
      );
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p>Manage your work and keep projects moving.</p>
        </div>

        <button className="btn btn-primary" onClick={startCreate}>
          <Plus size={18} />
          New Task
        </button>
      </div>

      <div className="toolbar card">
        <div className="search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks..."
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
        >
          <option value="">All priorities</option>
          {priorities.map((priority) => (
            <option key={priority}>{priority}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-state">Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state card">
          <CheckCircle2 size={42} />
          <h3>No tasks found</h3>
          <p>Create a task or change your filters.</p>
          <button className="btn btn-primary" onClick={startCreate}>
            <Plus size={18} />
            Create Task
          </button>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <div className="task-card card" key={task._id}>
              <div className="task-card-main">
                <div>
                  <h3>{task.title}</h3>

                  {task.description && (
                    <p>{task.description}</p>
                  )}

                  <div className="task-meta">
                    <span className={`badge ${task.priority?.toLowerCase()}`}>
                      {task.priority}
                    </span>

                    <span className="badge">
                      {task.status}
                    </span>

                    {task.project?.name && (
                      <span className="badge">
                        {task.project.name}
                      </span>
                    )}

                    {task.dueDate && (
                      <span>
                        Due{" "}
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={(event) =>
                      changeStatus(task, event.target.value)
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>

                  <button
                    className="icon-btn"
                    onClick={() => edit(task)}
                    title="Edit task"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    className="icon-btn danger"
                    onClick={() => remove(task._id)}
                    title="Delete task"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal card">
            <div className="modal-header">
              <div>
                <h2>{editing ? "Edit Task" : "Create Task"}</h2>
                <p>Enter the task details below.</p>
              </div>

              <button className="icon-btn" onClick={closeForm}>
                ×
              </button>
            </div>

            <form onSubmit={save}>
              <label>
                Title
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value,
                    })
                  }
                  placeholder="Task title"
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  placeholder="Describe the task..."
                  rows="4"
                />
              </label>

              <div className="form-grid">
                <label>
                  Project
                  <select
                    value={form.project}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        project: event.target.value,
                      })
                    }
                  >
                    <option value="">No project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Status
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value,
                      })
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Priority
                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        priority: event.target.value,
                      })
                    }
                  >
                    {priorities.map((priority) => (
                      <option key={priority}>{priority}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Due date
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        dueDate: event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  {editing ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}