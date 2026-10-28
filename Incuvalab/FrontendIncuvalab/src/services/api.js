// src/services/api.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/moocs"; // Ajustar según tu configuración

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchCoursesByCategory = async (category) => {
  try {
    const response = await axios.get(`${BASE_URL}/courses/${category}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching courses for ${category}:`, error);
    throw error;
  }
};

export const fetchSubjects = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/subjects`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const fetchSchools = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/schools`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  }
};

export const fetchAllMoocsData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/all-courses`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all MOOC data:", error);
    throw error;
  }
};

export const fetchCourseById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/courses/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

export const createCourse = async (courseData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/courses`,
      courseData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// En api.js
export const fetchSlidesByCourseId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/courses/${id}/slides`);
    
    // Mapear los datos correctamente
    const slides = response.data.data.map(slide => ({
      title: slide.title || '',
      content: slide.content || '',
      videoUrl: slide.videoUrl || slide.video_url || '',
      embedUrl: slide.embedUrl || slide.embed_url || '',
      quiz: Array.isArray(slide.quiz) ? slide.quiz : [],
      resources: Array.isArray(slide.resources) ? slide.resources : []
    }));
    
    return slides;
  } catch (error) {
    console.error('Error fetching slides:', error);
    return [];
  }
};

export const fetchMyCourses = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/my-courses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching my courses:", error);
    throw error;
  }
};

export const updateCourse = async (id, courseData, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/courses/${id}`,
      courseData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};
