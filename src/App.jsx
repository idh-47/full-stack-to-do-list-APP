import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Trash2,
  Edit2,
  Plus,
  LogOut,
  Sparkles,
  Target,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";

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

// Login Page with Animations
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskTitan9000
            </CardTitle>
            <CardDescription>
              Welcome back! Ready to conquer your tasks?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="your@email.com"
                className="transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                className="transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Register here
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center"
            >
              <Target className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Join TaskTitan9000
            </CardTitle>
            <CardDescription>Start crushing your goals today!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
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
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

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

  const confirmDelete = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDelete = async () => {
    try {
      await API.deleteTodo(deleteDialog.id);
      setTodos((prevTodos) =>
        prevTodos.filter((t) => t.id !== deleteDialog.id)
      );
      setDeleteDialog({ open: false, id: null });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-sm border-b sticky top-0 z-10 backdrop-blur-sm bg-white/95"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TaskTitan9000
                </h1>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-6xl mx-auto p-4 mt-6 space-y-6">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Total Tasks
                    </p>
                    <p className="text-4xl font-bold text-blue-700">
                      {stats.total}
                    </p>
                  </div>
                  <Target className="w-12 h-12 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      Completed
                    </p>
                    <p className="text-4xl font-bold text-green-700">
                      {stats.done}
                    </p>
                  </div>
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">
                      Active
                    </p>
                    <p className="text-4xl font-bold text-orange-700">
                      {stats.active}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Add Todo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
                  placeholder="What needs to be conquered today?"
                  className="flex-1 text-lg"
                />
                <Button
                  onClick={handleAddTodo}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-2 flex-wrap">
                {["all", "active", "done"].map((f) => (
                  <Button
                    key={f}
                    onClick={() => setFilter(f)}
                    variant={filter === f ? "default" : "outline"}
                    className={
                      filter === f
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : ""
                    }
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Todos List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <div className="text-center py-12 text-gray-500">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  Loading todos...
                </div>
              ) : filteredTodos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 text-gray-500"
                >
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">
                    {filter === "all"
                      ? "No todos yet. Time to add one!"
                      : `No ${filter} todos.`}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredTodos.map((todo, index) => (
                      <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                      >
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                            todo.is_done
                              ? "bg-gray-50 border-gray-200"
                              : "bg-white border-blue-200 hover:border-blue-300 hover:shadow-md"
                          }`}
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleDone(todo)}
                            className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                              todo.is_done
                                ? "bg-green-500 border-green-500"
                                : "border-gray-300 hover:border-green-500"
                            }`}
                          >
                            <AnimatePresence>
                              {todo.is_done && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <CheckCircle2 className="w-5 h-5 text-white" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>

                          {editingId === todo.id ? (
                            <Input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onBlur={() => handleSaveEdit(todo)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleSaveEdit(todo)
                              }
                              className="flex-1"
                              autoFocus
                            />
                          ) : (
                            <span
                              className={`flex-1 text-lg ${
                                todo.is_done
                                  ? "line-through text-gray-500"
                                  : "text-gray-800"
                              }`}
                            >
                              {todo.title}
                            </span>
                          )}

                          <div className="flex gap-1">
                            <Button
                              onClick={() => handleEdit(todo)}
                              variant="ghost"
                              size="sm"
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => confirmDelete(todo.id)}
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Todo</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this todo? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, id: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-xl text-gray-600">
                    Loading TaskTitan9000...
                  </p>
                </motion.div>
              </div>
            );
          }

          if (!user) {
            return (
              <AnimatePresence mode="wait">
                {page === "login" ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LoginPage onSwitchToRegister={() => setPage("register")} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RegisterPage onSwitchToLogin={() => setPage("login")} />
                  </motion.div>
                )}
              </AnimatePresence>
            );
          }

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Dashboard />
            </motion.div>
          );
        }}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}
