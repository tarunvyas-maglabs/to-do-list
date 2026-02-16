import { date } from "date-fns/locale";

function taskItem(title, description, dueDate, priority, completed = false, id = null) {
    
    return {
        id: id ?? crypto.randomUUID(),
        title,
        description,
        dueDate,
        priority,
        completed
    }
}

function createProject(name, id = null) {
    id = id ?? crypto.randomUUID();
    const tasks = [];

    const addTask = ({ title, description, dueDate, priority, completed }) => {
        const task = taskItem(title, description, dueDate, priority, completed);
        tasks.push(task);
    }

    const getTasks = () => [...tasks]; 

    const deleteTask = (taskId) => {
        const taskIndex = tasks.findIndex((task) => task.id === taskId);
        if(taskIndex !== -1){
            tasks.splice(taskIndex, 1);
        }
    }

    const getProjectId = () => id;

    const toggleTaskStatus = (taskId) => {
        const task = tasks.find((task) => task.id === taskId);
        if(task){
            task.completed = (task.completed === true) ? false : true;
        }
    }

    const changeDueDate = (taskId, newDate) => {
        const task = tasks.find((task) => task.id === taskId);
        if(task){
            task.dueDate = newDate;
        }
    }

    const changePriority = (taskId, newPriority) => {
        const task = tasks.find((task) => task.id === taskId);
        if(task){
            task.priority = newPriority;
        }
    }

    return {
        name,
        getProjectId,
        toggleTaskStatus,
        changeDueDate,
        changePriority,
        addTask,
        getTasks,
        deleteTask
    };
};

function ProjectHandler() {
    const projects = [];

    const exportData = () => {
        return projects.map(project => ({
            id: project.getProjectId(),
            name: project.name,
            tasks: project.getTasks()
        }));
    }

    const importData = (rawProjects) => {
        projects.length = 0;

        for (const p of rawProjects){
            const project = createProject(p.name, p.id);
            if(p.tasks){
                for(const t of p.tasks){
                    project.addTask(t)
                }
            }
            projects.push(project);
        }
    }

    const addProject = (projectName) => {
        const newProject = createProject(projectName);
        projects.push(newProject);
    }

    const deleteProject = (projectId) => {
        const projectIndex = projects.findIndex((project) => project.getProjectId() === projectId);
        if(projectIndex !== -1){
            projects.splice(projectIndex, 1);
        }
    }

    const getProject = (projectId) => {
        const project = projects.find((project) => project.getProjectId() === projectId);
        if(!project){
            return null;
        }
        return project;
    }

    const getAllProjects = () => {
        return projects.map(p => ({
            id: p.getProjectId(),
            name: p.name
        })
    )};

    const addTask = (projectId,{ title, description, dueDate, priority, completed }) => {
        const project = getProject(projectId);
        if(project){
            project.addTask({ title, description, dueDate, priority, completed });
        }
    }

    const changeDueDate = (projectId, taskId, newDate) => {
        const project = getProject(projectId);
        if(project){
            project.changeDueDate(taskId, newDate);
        }
    }

    const changePriority = (projectId, taskId, newPriority) => {
        const project = getProject(projectId);
        if(project){
            project.changePriority(taskId, newPriority);
        }
    }

    const toggleTaskStatus = (projectId, taskId) => {
        const project = getProject(projectId);
        if(project){
            project.toggleTaskStatus(taskId);
        }
    }

    const getTasks = (projectId) => {
        const project = getProject(projectId);
        if(project){
            const tasks = project.getTasks();
            return [...tasks];
        }
    }

    const getProjectMeta = (projectId) => {
        const p = projects.find(p => p.getProjectId() === projectId);
        return p ? { id: p.getProjectId(), name: p.name } : null;
    };

    return {
        addTask,
        exportData,
        importData,
        getProjectMeta,
        toggleTaskStatus,
        changeDueDate,
        deleteProject,
        getTasks,
        changePriority,
        addProject,
        getAllProjects
    }
}


export { ProjectHandler, createProject };