import "./styles.css";

import { ProjectHandler, createProject } from "./models.js";



function ScreenController() {
    const handler = ProjectHandler();
    
    const projectsDiv = document.querySelector(".projects");
    
    const contentDiv = document.querySelector(".content");

    const addTaskButton = document.querySelector(".add-task");
    addTaskButton.addEventListener("mouseover", () => {
        const icon = document.querySelector(".add-task-symbol");
        icon.style.fill = "#f05d46";
    })

    addTaskButton.addEventListener("mouseout", () => {
        const icon = document.querySelector(".add-task-symbol");
        icon.style.fill = "#D2503D";
    })

    const dialog = document.querySelector("#dialog");
    const closeAddTaskDialogButton = document.querySelector(".close-btn");
    closeAddTaskDialogButton.addEventListener("click", ()=> {
        dialog.close();
    })

    const projectDialog = document.querySelector("#project-dialog");
    const closeAddProjectDialogButton = document.querySelector(".close-project-btn");
    closeAddProjectDialogButton.addEventListener("click", ()=> {
        projectDialog.close();
    })

    addTaskButton.style.display = "none";

    const createNewTaskButton = document.querySelector("#submit-new-task");
    createNewTaskButton.addEventListener("click", (event) => {
        event.preventDefault();
        const projectId = document.querySelector("#project-id").value;
        let taskTitle = document.querySelector("#task-title").value; 
        let taskDescription = document.querySelector("#task-description").value; 
        let taskDueDate = document.querySelector("#task-due-date").value;
        let taskPriority = document.querySelector("#task-priority").value;
        let taskStatus = document.querySelector("#task-status").checked === true;

        if(projectId && taskTitle && taskDescription && taskDueDate && taskPriority && (taskStatus !== undefined)){
            handler.addTask(projectId, {
                title: taskTitle, 
                description: taskDescription, 
                dueDate: taskDueDate, 
                priority: taskPriority, 
                completed: taskStatus
            });
            localStorage.setItem("projects", JSON.stringify(handler.exportData()));
            updateUI(projectId);
        }

        clearNewTaskForm();
        dialog.close();
    })

    function clearNewTaskForm() {
        let taskTitle = document.querySelector("#task-title"); 
        let taskDescription = document.querySelector("#task-description"); 
        let taskDueDate = document.querySelector("#task-due-date");
        let taskStatus = document.querySelector("#task-status");

        taskTitle.value = "";
        taskDescription.value = "";
        taskDueDate.value = "";
        taskStatus.checked = false;
    }

    const createNewProjectButton = document.querySelector("#submit-new-project");
    createNewProjectButton.addEventListener("click", (event) => {
        event.preventDefault();
        const projectName = document.querySelector("#project-name").value;
        handler.addProject(projectName);
        localStorage.setItem("projects", JSON.stringify(handler.getAllProjects()));
        projectDialog.close();
        updateSideBar();
    })

    function updateSideBar() {
        const projects = handler.getAllProjects();
        let projectList = document.querySelector(".project-list");
        if(projectList){
            projectList.textContent = "";  
        } else {
            projectList = document.createElement("div");
            projectList.classList.add("project-list");
        }
        const addProjectButton = document.createElement("button");
        addProjectButton.classList.add("add-project-btn");
        addProjectButton.textContent = "+Add New Project";
        addProjectButton.addEventListener("click", () => {
            const projectDialog = document.querySelector("#project-dialog");
            projectDialog.showModal();
        })

        for(const project of projects) {
            const projectButton = document.createElement("button");
            projectButton.classList.add("project-btn");
            projectButton.dataset.id = project.id;
            projectButton.addEventListener("click", () => updateUI(project.id));
            projectButton.textContent = project.name;
            projectList.appendChild(projectButton);
        }
        projectList.appendChild(addProjectButton);

        projectsDiv.append(projectList);

    }

    addTaskButton.addEventListener("click", () => {
        dialog.showModal();
        const projectId = document.querySelector("#project-id");
        projectId.value = addTaskButton.dataset.projectId; 
    });

    function updateUI(projectId){
        const meta = handler.getProjectMeta(projectId);
        if(!meta) return;

        contentDiv.textContent = "";
        const h1 = document.createElement("h1");
        h1.textContent = meta.name;
        const taskList = document.createElement("ul");
        taskList.classList.add("tasks-div");
        const tasks = handler.getTasks(projectId);
        for(const task of tasks){
            const card = document.createElement("div");
            card.classList.add("card");
            const title = document.createElement("h2");
            title.textContent = task.title;
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.addEventListener("click", () => {
                handler.toggleTaskStatus(projectId, task.id);
                localStorage.setItem("projects", JSON.stringify(handler.exportData()));
            });
            const description = document.createElement("p");
            description.textContent = task.description;
            const dueDate = document.createElement("input");
            dueDate.type = "date";
            dueDate.value = task.dueDate;
            dueDate.addEventListener("change", () => {
                const newDateValue = dueDate.value;
                handler.changeDueDate(projectId, task.id, newDateValue);
                localStorage.setItem("projects", JSON.stringify(handler.exportData()));
            })
            const priority = document.createElement("select");
            const optionsArray = ["High", "Medium", "Low"];
            for(let i = 0; i < optionsArray.length; i++){
                const option = document.createElement("option");
                option.value = optionsArray[i].toLowerCase();
                option.text = optionsArray[i];
                priority.appendChild(option);
            }
            priority.selectedIndex = optionsArray.findIndex((option)=> option.toLowerCase() === task.priority);
            priority.addEventListener("change", () => {
                const newPriorityIndex = priority.selectedIndex;
                const newPriorityValue = optionsArray[newPriorityIndex];
                handler.changePriority(projectId, task.id, newPriorityValue.toLowerCase());
                localStorage.setItem("projects", JSON.stringify(handler.exportData()));
            })
            card.append(checkbox, title, description, dueDate, priority);
            taskList.append(card);
        }
        addTaskButton.style.display = "flex";
        addTaskButton.dataset.projectId = projectId;
        contentDiv.append(h1, taskList);
    }

    const saved = JSON.parse(localStorage.getItem("projects"));
    if (saved) handler.importData(saved);
    else handler.addProject("Default");
    
    updateSideBar();

}   

ScreenController();