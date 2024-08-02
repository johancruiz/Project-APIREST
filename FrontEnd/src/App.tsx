import { useEffect, useRef, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { getProjects, saveProject, updatePhoto, deleteProject } from './api/ProjectService';
import Header from './components/Header';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import { toastError, toastSuccess } from './api/ToastService';
import { ToastContainer } from 'react-toastify';
import ProjectDetail from './components/ProjectDetail';

// Define el tipo para los datos del proyecto y la lista de proyectos
interface ProjectData {
  id: string;
  photoUrl: string;
  title: string;
  status: string;
  description: string;
}

interface ProjectListData {
  content: ProjectData[];
  totalPages: number;
  totalElements: number;
}

function App() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<ProjectListData>({ content: [], totalPages: 0, totalElements: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [values, setValues] = useState({
    title: '',
    description: '',
    status: '',
    photoUrl: '',
    id: ''
  });

  const getAllProjects = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const response = await getProjects(page, size);
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      toastError((error as Error).message);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleNewProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await saveProject(values);
      const formData = new FormData();
      formData.append('file', file as File, file?.name || '');
      formData.append('id', data.id);
      const { data: photoUrl } = await updatePhoto(formData);
      toggleModal(false);
      setFile(undefined);
      if (fileRef.current) {
        fileRef.current.value = '';
      }
      setValues({
        title: '',
        description: '',
        status: '',
        photoUrl: '',
        id: ''
      });
      getAllProjects();
    } catch (error) {
      console.log(error);
      toastError((error as Error).message);
    }
  };

  const updateProject = async (project: ProjectData) => {
    try {
      const { data } = await saveProject(project);
      console.log(data);
    } catch (error) {
      console.log(error);
      toastError((error as Error).message);
    }
  };

  const updateImage = async (formData: FormData) => {
    try {
      const { data: photoUrl } = await updatePhoto(formData);
    } catch (error) {
      console.log(error);
      toastError((error as Error).message);
    }
  };

  const deleteProjectById = async (id: string) => {
    try {
      await deleteProject(id);
      toastSuccess('Project deleted successfully');
      getAllProjects(currentPage); // Refresh the list
    } catch (error) {
      console.log(error);
      toastError((error as Error).message);
    }
  };

  const toggleModal = (show: boolean) => {
    if (show) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <>
      <Header toggleModal={toggleModal} nbOfContacts={data.totalElements} />
      <main className='main'>
        <div className='container'>
          <Routes>
            <Route path='/' element={<Navigate to={'/projects'} />} />
            <Route path="/projects" element={<ProjectList data={data} currentPage={currentPage} getAllProjects={getAllProjects} onDelete={deleteProjectById} />} />
            <Route path="/projects/:id" element={<ProjectDetail updateProject={updateProject} updateImage={updateImage}/>} />
          </Routes>
        </div>
      </main>

      {/* Modal */}
      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Project</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewProject}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Title</span>
                <input type="text" value={values.title} onChange={onChange} name='title' required />
              </div>
              <div className="input-box">
                <span className="details">Description</span>
                <input type="textarea" value={values.description} onChange={onChange} name='description' required />
              </div>
              <div className="input-box">
                <span className="details">Project Status</span>
                <input type="text" value={values.status} onChange={onChange} name='status' required />
              </div>
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input type="file" onChange={(event) => setFile(event.target.files?.[0])} ref={fileRef} name='photo' required />
              </div>
            </div>
            <div className="form_footer">
              <button onClick={() => toggleModal(false)} type='button' className="btn btn-danger">Cancel</button>
              <button type='submit' className="btn">Save</button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}

export default App;
