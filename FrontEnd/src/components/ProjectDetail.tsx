
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProject, updateProject, updatePhoto } from '../api/ProjectService'; // Cambia a tus métodos de API
import { toastError, toastSuccess } from '../api/ToastService';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  photoUrl: string;
}

interface ProjectDetailProps {
  updateProject: (project: Project) => Promise<void>;
  updateImage: (formData: FormData) => Promise<void>;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ updateProject, updateImage }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [project, setProject] = useState<Project>({
    id: '',
    title: '',
    description: '',
    status: '',
    photoUrl: ''
  });

  const { id } = useParams<{ id: string }>();

  const fetchProject = async (id: string) => {
    try {
      const { data } = await getProject(id);
      setProject(data);
      console.log(data);
      //toastSuccess('Project retrieved');
    } catch (error) {
      console.log(error);
      toastError((error as Error).message);
    }
  };

  const selectImage = () => {
    inputRef.current?.click();
  };

  const udpatePhoto = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', id || '');
      await updateImage(formData);
      setProject((prev) => ({ ...prev, photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}` }));
      toastSuccess('Photo updated');
    } catch (error) {
      console.log(error);
      toastError((error as Error).message);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProject({ ...project, [event.target.name]: event.target.value });
  };

  const onUpdateProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateProject(project);        
      fetchProject(id || '');
      toastSuccess('Project Updated');
    } catch (error) {
      console.log(error);
      toastError((error as Error).message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  return (
    <>
      <Link to='/projects' className='link'><i className='bi bi-arrow-left'></i> Back to list</Link>
      <div className='profile'>
        <div className='profile__details'>
          <img src={project.photoUrl} alt={`Photo of ${project.title}`} />
          <div className='profile__metadata'>
            <p className='profile__name'>{project.title}</p>
            <p className='profile__muted'>JPG, GIF, or PNG. Max size of 10MB</p>
            <button onClick={selectImage} className='btn'><i className='bi bi-cloud-upload'></i> Change Photo</button>
          </div>
        </div>
        <div className='profile__settings'>
          <div>
            <form onSubmit={onUpdateProject} className="form">
              <div className="user-details">
                <input type="hidden" defaultValue={project.id} name="id" required />
                <div className="input-box">
                  <span className="details">Title</span>
                  <input type="text" value={project.title} onChange={onChange} name="title" required />
                </div>
                <div className="input-box">
                  <span className="details">Description</span>
                  <input type="text" value={project.description} onChange={onChange} name="description" required />
                </div>
                <div className="input-box">
                  <span className="details">Status</span>
                  <input type="text" value={project.status} onChange={onChange} name="status" required />
                </div>
              </div>
              <div className="form_footer">
                <button type="submit" className="btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <form style={{ display: 'none' }}>
        <input type='file' ref={inputRef} onChange={(event) => {
          if (event.target.files) {
            udpatePhoto(event.target.files[0]);
          }
        }} name='file' accept='image/*' />
      </form>
    </>
  );
};

export default ProjectDetail;
