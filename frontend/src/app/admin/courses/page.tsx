// "use client";

// import React, { useEffect, useState } from 'react';
// import { BookOpen, Users, Eye } from 'lucide-react';
// import api from '@/lib/api';

// interface Course {
//     id: string;
//     title: string;
//     category: string;
//     price: number;
//     isPublished: boolean;
//     instructor: { name: string; email: string };
//     _count: { enrollments: number; modules: number };
//     createdAt: string;
// }

// export default function CoursesManagement() {
//     const [courses, setCourses] = useState<Course[]>([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchCourses = async () => {
//             try {
//                 const res = await api.get('/admin/courses');
//                 setCourses(res.data);
//             } catch (error) {
//                 console.error("Failed to fetch courses", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchCourses();
//     }, []);

//     return (
//         <div className="p-8 max-w-7xl mx-auto">
//             <div className="mb-8">
//                 <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Course Management</h1>
//                 <p className="text-zinc-400">View and manage all platform courses</p>
//             </div>

//             {isLoading ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-zinc-900/50 rounded-2xl animate-pulse" />)}
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {courses.map(course => (
//                         <div key={course.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
//                             <div className="flex items-start justify-between mb-4">
//                                 <div className="flex-1">
//                                     <h3 className="font-bold text-lg text-zinc-100 mb-2">{course.title}</h3>
//                                     <p className="text-sm text-zinc-500 mb-3">{course.category}</p>
//                                 </div>
//                                 <div className={`px-2 py-1 rounded-lg text-xs font-bold ${course.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
//                                     {course.isPublished ? 'Published' : 'Draft'}
//                                 </div>
//                             </div>

//                             <div className="space-y-2 mb-4">
//                                 <div className="flex items-center justify-between text-sm">
//                                     <span className="text-zinc-500">Instructor</span>
//                                     <span className="text-zinc-300">{course.instructor.name}</span>
//                                 </div>
//                                 <div className="flex items-center justify-between text-sm">
//                                     <span className="text-zinc-500">Price</span>
//                                     <span className="text-zinc-300 font-bold">₹{course.price}</span>
//                                 </div>
//                                 <div className="flex items-center justify-between text-sm">
//                                     <span className="text-zinc-500">Enrollments</span>
//                                     <span className="text-zinc-300">{course._count.enrollments}</span>
//                                 </div>
//                                 <div className="flex items-center justify-between text-sm">
//                                     <span className="text-zinc-500">Modules</span>
//                                     <span className="text-zinc-300">{course._count.modules}</span>
//                                 </div>
//                             </div>

//                             <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2">
//                                 <Eye className="w-4 h-4" />
//                                 View Detailsa
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }
"use client";

import React, { useEffect, useState } from "react";
import { Eye, Plus, Trash2, Pencil } from "lucide-react";
import api from "@/lib/api";

interface Course {
  id: string;
  title: string;
  category: string;
  price: number;
  isPublished: boolean;
  instructor: { name: string };
  _count: { enrollments: number; modules: number };
}

export default function CoursesManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number>(0);

  // FETCH COURSES
  useEffect(() => {
    api.get("/admin/courses").then(res => {
      setCourses(res.data);
      setLoading(false);
    });
  }, []);

  // CREATE / UPDATE
  const submitCourse = async () => {
    try {
      if (editingId) {
        const res = await api.put(`/admin/courses/${editingId}`, {
          title, category, price
        });

        setCourses(prev =>
          prev.map(c => c.id === editingId ? res.data : c)
        );
      } else {
        const res = await api.post("/admin/courses", {
          title, category, price
        });
        setCourses(prev => [res.data, ...prev]);
      }

      closeModal();
    } catch (e) {
      console.error(e);
    }
  };

  // DELETE
  const deleteCourse = async (id: string) => {
    await api.delete(`/admin/courses/${id}`);
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  // PUBLISH TOGGLE
  const togglePublish = async (course: Course) => {
    const res = await api.patch(`/admin/courses/${course.id}/publish`);
    setCourses(prev =>
      prev.map(c => c.id === course.id ? res.data : c)
    );
  };

  const openEdit = (course: Course) => {
    setEditingId(course.id);
    setTitle(course.title);
    setCategory(course.category);
    setPrice(course.price);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingId(null);
    setTitle("");
    setCategory("");
    setPrice(0);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Course Management</h1>
          <p className="text-zinc-400">Admin control panel</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl font-bold flex gap-2"
        >
          <Plus size={18} /> Add Course
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-zinc-400">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

              <div className="flex justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{course.title}</h3>
                  <p className="text-sm text-zinc-400">{course.category}</p>
                </div>

                <button
                  onClick={() => togglePublish(course)}
                  className={`text-xs px-2 py-1 rounded-lg ${
                    course.isPublished
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-zinc-700 text-zinc-300"
                  }`}
                >
                  {course.isPublished ? "Published" : "Draft"}
                </button>
              </div>

              <div className="text-sm text-zinc-400 space-y-1 mb-4">
                <div>Price: ₹{course.price}</div>
                <div>Enrollments: {course._count.enrollments}</div>
                <div>Modules: {course._count.modules}</div>
              </div>

              <div className="flex gap-3">
                <button className="btn"><Eye size={16} /></button>
                <button onClick={() => openEdit(course)} className="btn"><Pencil size={16} /></button>
                <button onClick={() => deleteCourse(course.id)} className="btn text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-2xl w-[400px]">
            <h2 className="font-bold text-xl mb-4">
              {editingId ? "Edit Course" : "Add Course"}
            </h2>

            <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <input className="input mt-3" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
            <input className="input mt-3" type="number" placeholder="Price" value={price} onChange={e => setPrice(+e.target.value)} />

            <div className="flex gap-3 mt-5">
              <button onClick={submitCourse} className="btn-primary w-full">
                Save
              </button>
              <button onClick={closeModal} className="btn-secondary w-full">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
