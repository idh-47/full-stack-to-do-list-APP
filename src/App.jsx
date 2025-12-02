import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  Trash2,
  Edit2,
  Plus,
  LogOut,
} from "lucide-react";

const API_BASE = "/api";

const API = {
  async register(email, password) {
    const res = await fetch(`${API_BASE}/register.php`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/login.php`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
  },

  async logout() {
    await fetch(`${API_BASE}/logout.php`, {
      method: "POST",
      credentials: "include",
    });
  },

  async getCurrentUser() {
    try {
      const res = await fetch(`${API_BASE}/me.php`, {
        credentials: "include",
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async getTodos() {
    const res = await fetch(`${API_BASE}/getTodos.php`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch todos");
    return data;
  },

  async addTodo(title) {
    const res = await fetch(`${API_BASE}/addTodo.php`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add todo");
    return data;
  },

  async updateTodo(id, title, is_done) {
    const res = await fetch(`${API_BASE}/updateTodo.php`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title, is_done }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update todo");
    return data;
  },

  async deleteTodo(id) {
    const res = await fetch(`${API_BASE}/deleteTodo.php`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete todo");
    return data;
  },
};
// const API = {
//   async register(email, password) {
//     await new Promise((r) => setTimeout(r, 500));
//     const users = JSON.parse(localStorage.getItem("users") || "[]");
//     if (users.find((u) => u.email === email)) {
//       throw new Error("Email already exists");
//     }
//     const user = { id: Date.now(), email, password };
//     users.push(user);
//     localStorage.setItem("users", JSON.stringify(users));
//     return user;
//   },

//   async login(email, password) {
//     await new Promise((r) => setTimeout(r, 500));
//     const users = JSON.parse(localStorage.getItem("users") || "[]");
//     const user = users.find(
//       (u) => u.email === email && u.password === password
//     );
//     if (!user) throw new Error("Invalid credentials");
//     localStorage.setItem("currentUser", JSON.stringify(user));
//     return user;
//   },

//   async logout() {
//     localStorage.removeItem("currentUser");
//   },

//   async getCurrentUser() {
//     const user = localStorage.getItem("currentUser");
//     return user ? JSON.parse(user) : null;
//   },

//   async getTodos() {
//     const user = await this.getCurrentUser();
//     if (!user) throw new Error("Not authenticated");
//     const todos = JSON.parse(localStorage.getItem(`todos_${user.id}`) || "[]");
//     return todos;
//   },

//   async addTodo(title) {
//     const user = await this.getCurrentUser();
//     if (!user) throw new Error("Not authenticated");
//     const todos = await this.getTodos();
//     const newTodo = {
//       id: Date.now(),
//       user_id: user.id,
//       title,
//       is_done: false,
//       created_at: new Date().toISOString(),
//     };
//     todos.push(newTodo);
//     localStorage.setItem(`todos_${user.id}`, JSON.stringify(todos));
//     return newTodo;
//   },

//   async updateTodo(id, title, isDone) {
//     const user = await this.getCurrentUser();
//     if (!user) throw new Error("Not authenticated");
//     const todos = await this.getTodos();
//     const index = todos.findIndex((t) => t.id === id);
//     if (index === -1) throw new Error("Todo not found");
//     todos[index] = {
//       ...todos[index],
//       title,
//       is_done: isDone,
//       updated_at: new Date().toISOString(),
//     };
//     localStorage.setItem(`todos_${user.id}`, JSON.stringify(todos));
//     return todos[index];
//   },

//   async deleteTodo(id) {
//     const user = await this.getCurrentUser();
//     if (!user) throw new Error("Not authenticated");
//     const todos = await this.getTodos();
//     const filtered = todos.filter((t) => t.id !== id);
//     localStorage.setItem(`todos_${user.id}`, JSON.stringify(filtered));
//     return true;
//   },
// };

// Auth Context
const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    const u = await API.login(email, password);
    setUser(u);
  };

  const register = async (email, password) => {
    const u = await API.register(email, password);
    setUser(u);
  };

  const logout = async () => {
    await API.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Login Page
function LoginPage({ onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = React.useContext(AuthContext);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">TaskTitan9000</h1>
        <p className="text-gray-600 mb-6">Welcome back! Log in to continue.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

// Register Page
function RegisterPage({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = React.useContext(AuthContext);

  const handleSubmit = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600 mb-6">Join TaskTitan9000 today!</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </div>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-purple-600 hover:underline font-medium"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}

// Dashboard
function Dashboard() {
  const { user, logout } = React.useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const data = await API.getTodos();
      setTodos(data || []);
    } catch (err) {
      console.error(err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const todo = await API.addTodo(newTodo);
      setTodos((prevTodos) => [...prevTodos, todo]);
      setNewTodo("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleDone = async (todo) => {
    try {
      await API.updateTodo(todo.id, todo.title, !todo.is_done);
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t.id === todo.id ? { ...t, is_done: !t.is_done } : t
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const handleSaveEdit = async (todo) => {
    if (!editTitle.trim()) return;
    try {
      await API.updateTodo(todo.id, editTitle, todo.is_done);
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t.id === todo.id ? { ...t, title: editTitle } : t
        )
      );
      setEditingId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.is_done;
    if (filter === "done") return t.is_done;
    return true;
  });

  const stats = {
    total: todos.length,
    done: todos.filter((t) => t.is_done).length,
    active: todos.filter((t) => !t.is_done).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">TaskTitan9000</h1>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4 mt-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.done}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">
                {stats.active}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddTodo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "active"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("done")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "done"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Done
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading todos...
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {filter === "all"
                ? "No todos yet. Add one above!"
                : `No ${filter} todos.`}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition ${
                    todo.is_done
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <button
                    onClick={() => handleToggleDone(todo)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                      todo.is_done
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 hover:border-green-500"
                    }`}
                  >
                    {todo.is_done && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </button>

                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleSaveEdit(todo)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSaveEdit(todo)
                      }
                      className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`flex-1 ${
                        todo.is_done
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.title}
                    </span>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [page, setPage] = useState("login");

  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({ user, loading }) => {
          if (loading) {
            return (
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
              </div>
            );
          }

          if (!user) {
            return page === "login" ? (
              <LoginPage onSwitchToRegister={() => setPage("register")} />
            ) : (
              <RegisterPage onSwitchToLogin={() => setPage("login")} />
            );
          }

          return <Dashboard />;
        }}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}
