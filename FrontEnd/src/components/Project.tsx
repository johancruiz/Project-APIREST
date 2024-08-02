import { Link } from 'react-router-dom'

interface ProjectProps {
  project: {
    id: string;
    photoUrl: string;
    title: string;
    description: string;
    status: string;
  }
}

const Project = ({ project }: ProjectProps) => {
  return (
    <Link to={`/projects/${project.id}`} className="project__item">
      <div className="project__header">
        <div className="project__image">
          <img src={project.photoUrl} alt={project.title} />
        </div>
        <div className="project__details">
          <p className="project_name">{project.title.substring(0, 15)}</p>
          <p className="project_title">{project.description}</p>
        </div>
      </div>
      <div className="project__body">
        {/* <p><i className="bi bi-envelope"></i> {project.email.substring(0, 20)}</p>
        <p><i className="bi bi-geo"></i> {project.address}</p>
        <p><i className="bi bi-telephone"></i> {project.phone}</p>  */}
        <p>{project.status === 'Active' ? <i className='bi bi-check-circle'></i> : 
          <i className='bi bi-x-circle'></i>} {project.status}</p>
      </div>
    </Link>
  )
}

export default Project
