import { useState } from "react";
import { createLesson } from "../service/lesson.js";

export function useLessonForm(courseId, onSuccess) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    content: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const resetForm = () => {
    setFormData({ title: "", overview: "", content: "" });
    setError(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.overview.trim()) {
      setError("Overview is required");
      return;
    }
    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }

    try {
      setLoading(true);
      await createLesson(courseId, {
        title: formData.title.trim(),
        overview: formData.overview.trim(),
        content: formData.content.trim(),
      });

      resetForm();
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      setError(err.message || "Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  return {
    showForm,
    setShowForm,
    formData,
    error,
    loading,
    handleFormChange,
    handleSubmit,
    resetForm,
  };
}

