import React from 'react';
import Project from "./Project"

interface ProjectData {
    id: string;
    photoUrl: string;
    title: string;
    status: string;
    description: string; // Añadido description
}

interface ProjectListProps {
    data: {
        content?: ProjectData[];
        totalPages: number;
    };
    currentPage: number;
    getAllProjects: (page: number) => void;
    onDelete: (id: string) => void; // Añadido prop para eliminar
}

const ProjectList: React.FC<ProjectListProps> = ({ data, currentPage, getAllProjects, onDelete }) => {
    const projects = data?.content ?? []; // Default to an empty array if content is undefined

    const handleDelete = (id: string) => {
        onDelete(id);
    };

    return (
        <main className='main'>
            {projects.length === 0 && <div>No Projects. Please add a new project</div>}

            <ul className='project__list'>
                {projects.map(project => (
                    <li key={project.id}>
                        <Project project={project} />
                        <button onClick={() => handleDelete(project.id)}  type='button' className="btn btn-danger" >Delete</button>
                    </li>
                ))}
            </ul>

            {projects.length > 0 && data.totalPages > 1 &&
            <div className='pagination'>
                <a onClick={() => getAllProjects(currentPage - 1)} className={currentPage === 0 ? 'disabled' : ''}>&laquo;</a>

                {data && [...Array(data.totalPages).keys()].map((page) => 
                    <a onClick={() => getAllProjects(page)} className={currentPage === page ? 'active' : ''} key={page}>{page + 1}</a>)}

                <a onClick={() => getAllProjects(currentPage + 1)} className={data.totalPages === currentPage + 1 ? 'disabled' : ''}>&raquo;</a>
            </div>            
            }

        </main>
    )
}

export default ProjectList
