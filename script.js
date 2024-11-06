document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const celebrationPopup = document.getElementById("celebration-popup");
    const calendar = document.getElementById("calendar");
    const calendarTitle = document.getElementById("calendar-title");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");
    const taskListContainer = document.getElementById("task-list-container");

    let selectedDate = null;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    renderCalendar();
    loadTasks();

    function renderCalendar() {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        calendarTitle.textContent = `${firstDayOfMonth.toLocaleString('default', { month: 'long' })} ${currentYear}`;
        calendar.innerHTML = "";

        // Empty days at start
        for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
            const emptyDay = document.createElement("div");
            calendar.appendChild(emptyDay);
        }

        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const currentDate = new Date(currentYear, currentMonth, day);
            const dayElement = document.createElement("div");
            dayElement.className = "calendar-day";
            dayElement.textContent = day;
            dayElement.addEventListener("click", () => {
                selectedDate = currentDate;
                taskListContainer.style.display = "block";
                updateTaskList();
            });
            calendar.appendChild(dayElement);
        }
    }

    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText && selectedDate) {
            addTask(taskText, selectedDate);
            saveTasks();
            taskInput.value = "";
            updateTaskList();
        }
    });

    function addTask(taskText, taskDate, isCompleted = false) {
        const taskItem = document.createElement("li");
        taskItem.className = "task-item";
        if (isCompleted) taskItem.classList.add("completed");

        const taskContent = document.createElement("span");
        taskContent.textContent = `${taskText} (Due: ${taskDate.toLocaleDateString()})`;

        const taskActions = document.createElement("div");
        taskActions.className = "task-actions";

        const completeBtn = document.createElement("button");
        completeBtn.innerHTML = '<i class="fas fa-check complete-btn"></i>';
        completeBtn.addEventListener("click", () => {
            taskItem.classList.add("completed");
            showCelebration();
            saveTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fas fa-trash delete-btn"></i>';
        deleteBtn.addEventListener("click", () => {
            taskList.removeChild(taskItem);
            saveTasks();
        });

        taskActions.appendChild(completeBtn);
        taskActions.appendChild(deleteBtn);

        taskItem.appendChild(taskContent);
        taskItem.appendChild(taskActions);
        taskList.appendChild(taskItem);
    }

    function updateTaskList() {
        taskList.innerHTML = "";
        const tasks = JSON.parse(localStorage.getItem("tasks")) || {};
        const dateKey = selectedDate.toDateString();
        const selectedTasks = tasks[dateKey] || [];
        selectedTasks.forEach(task => {
            addTask(task.text, selectedDate, task.completed);
        });
    }

    function saveTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || {};
        const dateKey = selectedDate.toDateString();
        tasks[dateKey] = [];
        document.querySelectorAll(".task-item").forEach(taskItem => {
            const taskContent = taskItem.querySelector("span").textContent;
            const taskText = taskContent.replace(/ \(.*?\)$/, ''); // Remove due date text
            tasks[dateKey].push({
                text: taskText,
                completed: taskItem.classList.contains("completed")
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || {};
        for (let dateKey in tasks) {
            tasks[dateKey].forEach(task => addTask(task.text, new Date(dateKey), task.completed));
        }
    }

    function showCelebration() {
        celebrationPopup.style.display = "block";
        setTimeout(() => {
            celebrationPopup.style.display = "none";
        }, 3000); // Show for 3 seconds
    }

    prevMonthBtn.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
});
