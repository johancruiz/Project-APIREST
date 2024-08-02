import axios from "axios";

// Define the base URL for the API
const API_URL = 'http://localhost:8081/projects';

// Define the types for the functions' parameters
interface Project {
    id: string;
    photoUrl: string;
    title: string;
    status: string;
    description: string;
}

interface FormData {
    // Add fields if needed; adjust according to your form data structure
}

// Save a new project
export async function saveProject(project: Project): Promise<any> {
    return await axios.post(API_URL, project);
}

// Get a list of projects with pagination
export async function getProjects(page: number = 0, size: number = 10): Promise<any> {
    return await axios.get(`${API_URL}?page=${page}&size=${size}`);
}

// Get a specific project by ID
export async function getProject(id: string): Promise<any> {
    return await axios.get(`${API_URL}/${id}`);
}

// Update an existing project
export async function updateProject(project: Project): Promise<any> {
    return await axios.post(`${API_URL}/${project.id}`, project);
}

// Update the photo for a specific project
export async function updatePhoto(formData: FormData): Promise<any> {
    return await axios.put(`${API_URL}/photo`, formData);
}

// Delete a specific project by ID
export async function deleteProject(id: string): Promise<any> {
    return await axios.delete(`${API_URL}/${id}`);
}
